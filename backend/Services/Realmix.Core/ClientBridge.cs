using System.Collections.Concurrent;
using System.Net.WebSockets;
using Realmix.Protos;

namespace Realmix.Core;

public class ClientBridge
{
    private int _lastId = 0;
    private readonly ConcurrentDictionary<int, ClientConnection> _connections = new();
    
    public IEnumerable<CommandType> GetCommands()
    {
        var commands = _connections
            .Values.Select(x => x.PullCommands())
            .SelectMany(x => x)
            .Select(x => x.CommandType)
            .ToArray();

        return commands;
    }

    public async Task SendStateAsync(GameCube cube)
    {
        var data = new CubeData
        {
            X = cube.Position.X,
            Y = cube.Position.Y,
            Z = cube.Position.Z,
            Rotation = cube.Rotation
        };
        
        foreach (var connection in _connections.Values)
            await connection.SendAsync(data);
    }

    public ClientConnection CreateConnection(WebSocket socket)
    {
        var disposable = new Disposable(_lastId, _connections);
        var connection = new ClientConnection(socket, disposable);
        
        _connections.TryAdd(_lastId, connection);
        _lastId++;
        
        return connection;
    }
    
    private class Disposable : IDisposable
    {
        private readonly ConcurrentDictionary<int, ClientConnection> _connections;
        private readonly int _id;

        public Disposable(int id, ConcurrentDictionary<int, ClientConnection> connections)
        {
            _connections = connections;
            _id = id;
        }
        
        public void Dispose()
        {
            _connections.TryRemove(_id, out _);
        }
    }
}