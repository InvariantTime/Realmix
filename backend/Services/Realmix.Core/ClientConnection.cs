using System.Net.WebSockets;
using Google.Protobuf;
using Realmix.Protos;

namespace Realmix.Core;

public class ClientConnection : IDisposable
{
    private readonly WebSocket _socket;
    private readonly IDisposable _disposable;
    private readonly List<ClientCommand> _commands;

    public ClientConnection(WebSocket socket, IDisposable disposable)
    {
        _socket = socket;
        _commands = new();
        _disposable = disposable;
    }

    public async Task RunAsync(CancellationToken ct)
    {
        var buffer = new byte[1024];
        
        while (_socket.State == WebSocketState.Open && ct.IsCancellationRequested == false)
        {
            var result = await _socket.ReceiveAsync(buffer, ct);
            
            if (result.MessageType == WebSocketMessageType.Close)
                break;

            var command = ClientCommand.Parser.ParseFrom(buffer, 0, result.Count);
            _commands.Add(command);
        }
    }

    public async Task SendAsync(CubeData data)
    {
        if (_socket.State != WebSocketState.Open)
            return;

        var bytes = data.ToByteArray();
        await _socket.SendAsync(bytes, WebSocketMessageType.Binary, true, CancellationToken.None);
    }

    public ClientCommand[] PullCommands()
    {
        var array = _commands.ToArray();
        _commands.Clear();
        
        return array;
    }

    public void Dispose()
    {
        _disposable.Dispose();
        _socket.Dispose();
    }
}