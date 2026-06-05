using System.Numerics;

namespace Realmix.Game.Core;

public class Entity
{
    public EntityId Id { get; }
    
    public Vector3 Position { get; private set; }
    
    public float Rotation { get; private set; }
    
    public Entity(EntityId id)
    {
        Id = id;
    }

    public void SetPosition(Vector3 position)
    {
        Position = position;
    }

    public void SetRotation(float rotation)
    {
        Rotation = rotation;
    }
}