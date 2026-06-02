using System.Numerics;
using Realmix.Protos;

namespace Realmix.Core;

public static class CommandTypeExtensions
{
    public static Vector3 ToVector3(this CommandType commandType)
    {
        var direction = commandType switch
        {
            CommandType.Forward => new Vector3(0, 0, 1),
            CommandType.Backward => new Vector3(0, 0, -1),
            CommandType.Left => new Vector3(1, 0, 0),
            CommandType.Right => new Vector3(-1, 0, 0),
            _ => Vector3.Zero
        };
        
        return direction;
    }

    public static float ToAngle(this CommandType commandType)
    {
        return commandType switch
        {
            CommandType.RotateLeft => -1,
            CommandType.RotateRight => 1,
            _ => 0
        };
    }
}