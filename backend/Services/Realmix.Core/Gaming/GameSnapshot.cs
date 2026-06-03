using Microsoft.VisualBasic;

namespace Realmix.Core.Gaming;

public readonly struct GameSnapshot
{
    public required IEnumerable<GameCube> Cubes { get; init; }
}