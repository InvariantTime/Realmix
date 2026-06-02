using System.Numerics;
using Realmix.Protos;

namespace Realmix.Core;

public class Game : BackgroundService
{
    private readonly GameCube _cube;
    private readonly ClientBridge _bridge;

    public Game(ClientBridge bridge)
    {
        _bridge = bridge;
        _cube = new GameCube();
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (stoppingToken.IsCancellationRequested == false)
        {
            await Task.Delay(50, stoppingToken);
            var commands = _bridge.GetCommands();

            foreach (var command in commands)
                ExecuteCommand(command);

            await _bridge.SendStateAsync(_cube);
        }
    }

    private void ExecuteCommand(CommandType command)
    {
        var direction = command.ToVector3();
        var rotation = command.ToAngle();
        
        _cube.MoveTo(direction);
        _cube.Rotate(rotation);
    }
}

public class GameCube
{
    private const float MoveSpeed = 0.06f;
    private const float RotateSpeed = 0.02f;
    
    public Vector3 Position { get; private set; }
    
    public float Rotation { get; private set; }

    public GameCube()
    {
        Position = new Vector3(0, 0.5f, 0);
    }

    public void MoveTo(Vector3 direction)
    {
        var quaternion = Quaternion.CreateFromAxisAngle(Vector3.UnitY, Rotation);
        var rotatedDirection = Vector3.Transform(direction, quaternion);
        Position += rotatedDirection * MoveSpeed;
    }

    public void Rotate(float angle)
    {
        Rotation += RotateSpeed * angle;
    }
}