using Realmix.Core;
using Realmix.Core.Gaming;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(op =>
{
    op.AddPolicy("frontend", policyBuilder =>
    {
        policyBuilder.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddHostedService<GameLoop>();
builder.Services.AddSingleton<Game>();
builder.Services.AddSingleton<ClientBridge>();

var app = builder.Build();

app.UseCors("frontend");

app.UseWebSockets();

app.Map("/ws", async (
    HttpContext context,
    ClientBridge bridge,
    CancellationToken ct) =>
{
    if (context.WebSockets.IsWebSocketRequest == false)
    {
        context.Response.StatusCode = 400;
        return;
    }

    var socket = await context.WebSockets.AcceptWebSocketAsync();
    var connection = await bridge.CreateConnectionAsync(socket);
    
    await connection.RunAsync(ct);
    connection.Dispose();
});

app.Run();