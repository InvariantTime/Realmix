using System.Net.WebSockets;

namespace Realmix.Protocol;

public class SocketConnection
{
    private readonly WebSocket _socket;
    private readonly CancellationToken _ct;
    private readonly string _id;

    public SocketConnection(WebSocket socket, string id, CancellationToken ct)
    {
        _socket = socket;
        _id = id;
        _ct = ct;
    }

    public Task SendAsync(byte[] data)//TODO: buffers and options
    {
        return _socket.SendAsync(data, WebSocketMessageType.Binary, true, CancellationToken.None);//TODO: it's not thread-safe code
    }

    public async Task<byte[]> ReceiveAsync() //TODO: options
    {
        var buffer = new ArraySegment<byte>(new byte[1024]);
        await _socket.ReceiveAsync(buffer, _ct);

        return buffer.ToArray();
    }

    public async Task CloseAsync()
    {
        try
        {
            await _socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
        }
        finally
        {
            
        }
    }
}