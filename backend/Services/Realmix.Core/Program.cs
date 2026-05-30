using Google.Protobuf;
using Realmix.Hello;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(op =>
{
    op.AddPolicy("frontend", builder =>
    {
        builder.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


var app = builder.Build();

app.UseCors("frontend");

app.MapPost("/hello", async (HttpContext context, ILogger<WebApplication> logger) =>
{
    using var ms = new MemoryStream();
    await context.Request.Body.CopyToAsync(ms);

    var _ = HelloRequest.Parser.ParseFrom(ms.ToArray());
    logger.LogInformation("Hello World");

    var response = new HelloResponse()
    {
        Text = "Ну привет"
    };

    var bytes = response.ToByteArray();
    
    return Results.File(bytes, "application/x-protobuf");
});

app.Run();