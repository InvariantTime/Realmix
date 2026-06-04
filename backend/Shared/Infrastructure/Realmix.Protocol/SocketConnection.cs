using System.Buffers;
using System.Net.WebSockets;

namespace Realmix.Protocol;

public class SocketConnection : IAsyncDisposable
{
    private readonly WebSocket _socket;
    
    public string Id { get; }

    public SocketConnection(WebSocket socket, string id)
    {
        _socket = socket;
        Id = id;
    }

    public async Task RunAsync(IProtocolHandler handler)//TODO: not thread safe
    {
        var buffer = ArrayPool<byte>.Shared.Rent(4096);

        await handler.OnConnectedAsync(this);

        try
        {
            using var stream = new MemoryStream();
            
            while (_socket.State == WebSocketState.Open)
            {
                WebSocketReceiveResult? result;

                do
                {
                    result = await _socket.ReceiveAsync(buffer, CancellationToken.None);
                    stream.Write(buffer, 0, result.Count);
                } 
                while (result?.EndOfMessage == false);

                await handler.OnMessageAsync(stream.ToArray(), this);
                stream.Seek(0, SeekOrigin.Begin);
            }
        }
        finally
        {
            ArrayPool<byte>.Shared.Return(buffer);
            await handler.OnDisconnectedAsync(this);
        }
    }

    public Task SendAsync(byte[] data)//TODO: buffers and options
    {
        return _socket.SendAsync(data, WebSocketMessageType.Binary, true, CancellationToken.None);//TODO: it's not thread-safe code
    }

    public ValueTask DisposeAsync()
    {
        _socket.Dispose();
        return ValueTask.CompletedTask;
    }
}