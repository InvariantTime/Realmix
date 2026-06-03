using System.Collections.Concurrent;

namespace Realmix.Core.Gaming;

public class Game
{
    private readonly Dictionary<GameCubeId, GameCube> _cubes;
    private readonly Dictionary<GameCubeId, GameCubeControlState> _controls;

    public Game()
    {
        _cubes = new Dictionary<GameCubeId, GameCube>();
        _controls = new Dictionary<GameCubeId, GameCubeControlState>();
    }

    public void HandleCommands(IEnumerable<GameCommand> commands)
    {
        foreach (var command in commands)
        {
            switch (command)
            {
                case GameCommand.JoinPlayerCommand join: HandleJoin(join); break;
                case GameCommand.LeavePlayerCommand leave: HandleLeave(leave); break;
                case GameCommand.InputCommand input:  HandleInput(input); break;
                default: throw new ArgumentOutOfRangeException(nameof(command), command, null);
            }
        }
    }

    public GameSnapshot Update()
    {
        foreach (var cube in _cubes)
        {
            _controls.TryGetValue(cube.Key, out var control);
            cube.Value.Update(control);
        }
        
        _controls.Clear();
        
        return new GameSnapshot
        {
            Cubes = _cubes.Values
        };
    }

    private void HandleJoin(GameCommand.JoinPlayerCommand join)
    {
        _cubes.TryAdd(join.PlayerId, new GameCube(join.PlayerId));
    }

    private void HandleLeave(GameCommand.LeavePlayerCommand leave)
    {
        _cubes.Remove(leave.PlayerId, out _);
    }
    
    private void HandleInput(GameCommand.InputCommand input)
    {
        if (_cubes.ContainsKey(input.PlayerId) == false)
            return;

        if (_controls.ContainsKey(input.PlayerId) == false)
        {
            _controls.Add(input.PlayerId, input.State);
            return;
        }
        
        _controls[input.PlayerId] += input.State;
    }
}