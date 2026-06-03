using System.Net.WebSockets;
using System.Threading.Channels;
using Realmix.Core.Gaming;
using Realmix.Protos;

namespace Realmix.Core;

public class ClientConnection : IDisposable
{
    private readonly WebSocket _socket;
    private readonly IDisposable _disposable;
    private readonly Channel<GameCommand> _commands;
    
    public GameCubeId Id { get; }

    public ClientConnection(WebSocket socket, Channel<GameCommand> commands, GameCubeId id, IDisposable disposable)
    {
        Id = id;
        
        _socket = socket;
        _commands = commands;
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

            var request = ClientCommand.Parser.ParseFrom(buffer, 0, result.Count);

            var control = request.CommandType switch
            {
                CommandType.Forward => GameCubeControlState.ToForward(),
                CommandType.Backward => GameCubeControlState.ToBackward(),
                CommandType.Left => GameCubeControlState.ToLeft(),
                CommandType.Right => GameCubeControlState.ToRight(),
                CommandType.RotateLeft => GameCubeControlState.RotateLeft(),
                CommandType.RotateRight => GameCubeControlState.RotateRight(),
                _ => default
            };
            
            await _commands.Writer.WriteAsync(GameCommand.CreateInputCommand(Id, control), ct);
        }
    }

    public async Task SendAsync(byte[] bytes)
    {
        if (_socket.State != WebSocketState.Open)
            return;
        
        await _socket.SendAsync(bytes, WebSocketMessageType.Binary, true, CancellationToken.None);
    }
    
    public void Dispose()
    {
        _disposable.Dispose();
        _socket.Dispose();
    }
}