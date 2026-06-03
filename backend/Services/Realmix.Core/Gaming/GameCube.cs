using System.Numerics;

namespace Realmix.Core.Gaming;

public class GameCube
{
    private const float MoveSpeed = 0.06f;
    private const float RotationSpeed = 0.03f;
    
    public GameCubeId Id { get; }
    
    public Vector3 Color { get; }
    
    public Vector3 Position { get; private set; }
    
    public float Rotation { get; private set; }

    public GameCube(GameCubeId id)
    {
        Id = id;
        Color = new Vector3(
            Random.Shared.NextSingle(), 
            Random.Shared.NextSingle(), 
            Random.Shared.NextSingle());

        Position = new Vector3(0, 0.5f, 0);
    }

    public void SetPosition(Vector3 position)
    {
        Position = position;
    }

    public void Update(GameCubeControlState state)
    {
        if (state.Forward.HasMove(state.Left) == true)
        {
            var vector = state.Forward.ToVector3(state.Left);
            var dir = GetDirection(vector);
            Position += dir * MoveSpeed;
        }

        if (state.Rotation != Directions.None)
        {
            Rotation -= state.Rotation.ToFloat() * RotationSpeed;
        }
    }

    private Vector3 GetDirection(Vector3 vector)
    {
        var quaternion = Quaternion.CreateFromAxisAngle(Vector3.UnitY, Rotation);
        return Vector3.Transform(vector, quaternion);
    }
}

public readonly struct GameCubeControlState
{
    public Directions Forward { get; init; }
    
    public Directions Left { get; init; }
    
    public Directions Rotation { get; init; }

    public GameCubeControlState(Directions forward, Directions left, Directions rotation)
    {
        Forward = forward;
        Left = left;
        Rotation = rotation;
    }
    
    public static GameCubeControlState operator +(GameCubeControlState state1, GameCubeControlState state2)
    {
        var forward = state1.Forward.Sum(state2.Forward);
        var left = state1.Left.Sum(state2.Left);
        var rotation = state1.Rotation.Sum(state2.Rotation);
        
        return new GameCubeControlState
        {
            Forward = forward,
            Left = left,
            Rotation = rotation,
        };
    }
    
    public static GameCubeControlState ToForward() => new(Directions.Forward, Directions.None, Directions.None);
    
    public static GameCubeControlState ToBackward() => new(Directions.Backward, Directions.None, Directions.None);
    
    public static GameCubeControlState ToLeft() => new(Directions.None, Directions.Forward, Directions.None);
    
    public static GameCubeControlState ToRight() => new(Directions.Forward, Directions.Backward, Directions.None);
    
    public static GameCubeControlState RotateLeft() => new(Directions.None, Directions.None, Directions.Forward);
    
    public static GameCubeControlState RotateRight() => new(Directions.None, Directions.None, Directions.Backward);
}

public enum Directions
{
    None = 0,
    Forward = 1,
    Backward = 2
}

public static class DirectionsExtensions
{
    public static float ToFloat(this Directions direction)
    {
        return direction switch
        {
            Directions.Forward => 1,
            Directions.Backward => -1,
            _ => 0
        };
    }

    public static Directions Sum(this Directions left, Directions right)
    {
        if (left == Directions.None && right == Directions.None)
            return  Directions.None;

        if (left == Directions.Forward && right == Directions.Backward)
            return Directions.None;
        
        return left == Directions.None ? right : left;
    }

    public static bool HasMove(this Directions one, Directions two)
    {
        return one != Directions.None || two != Directions.None;
    }

    public static Vector3 ToVector3(this Directions forward, Directions left)
    {
        float x = left.ToFloat();
        float z = forward.ToFloat();
        
        return Vector3.Normalize(new Vector3(x, 0, z));
    }
}