using System.Collections.Concurrent;
using Google.Protobuf;
using Realmix.Core.Gaming;
using Realmix.Protocol;
using Realmix.Protos;

namespace Realmix.Core;

public class GameProtocolHandler : IProtocolHandler
{
    private readonly ConcurrentDictionary<string, ConnectionInfo> _connections = new();
    private readonly ConcurrentQueue<GameCommand> _commands = new();
    
    public Task OnConnectedAsync(SocketConnection connection)
    {
        var cube = GameCubeId.Create();
        _connections.TryAdd(connection.Id, new ConnectionInfo(connection, cube));
        _commands.Enqueue(GameCommand.CreateJoinPlayerCommand(cube));
        
        return Task.CompletedTask;
    }

    public Task OnDisconnectedAsync(SocketConnection connection)
    {
        bool result = _connections.TryRemove(connection.Id, out var info);

        if (result == false)
            return Task.CompletedTask;
        
        _commands.Enqueue(GameCommand.CreateLeavePlayerCommand(info.Cube));
        
        return Task.CompletedTask;
    }

    public Task OnMessageAsync(byte[] message, SocketConnection connection)
    {
        var result = _connections.TryGetValue(connection.Id, out var info);

        if (result == false)
            return Task.CompletedTask;
        
        var data = ClientCommand.Parser.ParseFrom(message);

        var state = data.CommandType switch
        {
            CommandType.Forward => GameCubeControlState.ToForward(),
            CommandType.Backward => GameCubeControlState.ToBackward(),
            CommandType.Left => GameCubeControlState.ToLeft(),
            CommandType.Right => GameCubeControlState.ToRight(),
            CommandType.RotateLeft => GameCubeControlState.RotateLeft(),
            CommandType.RotateRight => GameCubeControlState.RotateRight(),
            _ => default
        };
        
        _commands.Enqueue(GameCommand.CreateInputCommand(info.Cube, state));

        return Task.CompletedTask;
    }

    public async Task SendSnapshotAsync(GameSnapshot snapshot)
    {
        var players = snapshot.Cubes.Select(x => new CubeData
        {
            Id = x.Id.ToString(),
            Color = new Vector3 { X = x.Color.X, Y = x.Color.Y, Z = x.Color.Z },
            Position =  new Vector3 { X = x.Position.X, Y = x.Position.Y, Z = x.Position.Z },
            Rotation = x.Rotation
        });

        var world = new WorldSnapshot();
        world.Players.AddRange(players);

        var bytes = world.ToByteArray();

        foreach (var connection in _connections.Values)
        {
            await connection.Connection.SendAsync(bytes);
        }
    }

    public GameCommand[] PullCommands()
    {
        var commands = _commands.ToArray();
        _commands.Clear();
        
        return commands;
    }

    private readonly record struct ConnectionInfo(SocketConnection Connection, GameCubeId Cube);
}