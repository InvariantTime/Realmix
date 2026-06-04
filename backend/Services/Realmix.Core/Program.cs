using Realmix.Core;
using Realmix.Core.Gaming;
using Realmix.Protocol;

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
builder.Services.AddSingleton<GameProtocolHandler>();
builder.Services.AddScoped<WebSocketMiddleware>(scope =>
{
    var handler = scope.GetRequiredService<GameProtocolHandler>();
    return new WebSocketMiddleware(handler);
});

var app = builder.Build();

app.UseCors("frontend");

app.UseWebSockets();

app.Map("/ws", (HttpContext context, WebSocketMiddleware middleware) =>
{
    return middleware.InvokeAsync(context, _ => Task.CompletedTask);
});

app.Run();