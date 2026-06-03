namespace Realmix.Core.Gaming;

public readonly record struct GameCubeId(Guid Value)
{
    public static GameCubeId Create() => new(Guid.NewGuid());

    override public string ToString() => Value.ToString();
}