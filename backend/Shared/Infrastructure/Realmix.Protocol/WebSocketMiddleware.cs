using Microsoft.AspNetCore.Http;

namespace Realmix.Protocol;

public class WebSocketMiddleware : IMiddleware
{
    private readonly IProtocolHandler _handler;

    public WebSocketMiddleware(IProtocolHandler handler)
    {
        _handler = handler;
    }
    
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        if (context.WebSockets.IsWebSocketRequest == false)
        {
            await next.Invoke(context);
            return;
        }
        
        var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        var id = Guid.NewGuid().ToString();
        
        await using var connection = new SocketConnection(webSocket, id);
        await connection.RunAsync(_handler);
    }
}