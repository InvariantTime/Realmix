using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Threading.Channels;
using Google.Protobuf;
using Realmix.Core.Gaming;
using Realmix.Protos;

namespace Realmix.Core;

public class ClientBridge
{
    private readonly ConcurrentDictionary<GameCubeId, ClientConnection> _connections = new();
    private readonly Channel<GameCommand> _commands = Channel.CreateUnbounded<GameCommand>();
    
    public IEnumerable<GameCommand> PullCommands()
    {
        while (_commands.Reader.TryRead(out var command) == true)
            yield return command;
    }

    public async Task SendStateAsync(GameSnapshot snapshot)
    {
        var cubes = snapshot.Cubes.Select(x => new CubeData
        {
            Id = x.Id.ToString(),
            Position = new Vector3 { X = x.Position.X, Y = x.Position.Y, Z = x.Position.Z },
            Rotation = x.Rotation,
            Color = new Vector3 { X = x.Color.X, Y = x.Color.Y, Z = x.Color.Z }
        });
        
        var data = new WorldSnapshot();
        data.Players.Add(cubes);

        var bytes = data.ToByteArray();
        
        foreach (var connection in _connections.Values)
            await connection.SendAsync(bytes);
    }

    public async Task<ClientConnection> CreateConnectionAsync(WebSocket socket)
    {
        var id = GameCubeId.Create();
        
        var disposable = new Disposable(id, this);
        var connection = new ClientConnection(socket, _commands, id, disposable);
        
        var result = _connections.TryAdd(id, connection);

        if (result == true)
            await _commands.Writer.WriteAsync(GameCommand.CreateJoinPlayerCommand(id));

        return connection;
    }
    
    private class Disposable : IDisposable
    {
        private readonly ClientBridge _clientBridge;
        private readonly GameCubeId _id;

        public Disposable(GameCubeId id, ClientBridge bridge)
        {
            _clientBridge = bridge;
            _id = id;
        }
        
        public void Dispose()
        {
            var result = _clientBridge._connections.TryRemove(_id, out _);

            if (result == true)
                _clientBridge._commands.Writer.TryWrite(GameCommand.CreateLeavePlayerCommand(_id));
        }
    }
}