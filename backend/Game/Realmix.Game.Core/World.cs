namespace Realmix.Game.Core;

public class World
{
    private readonly Dictionary<EntityId, Entity> _entities = new();

    public IReadOnlyCollection<Entity> Entities => _entities.Values;
    
    public bool AddEntity(Entity entity)
    {
        return _entities.TryAdd(entity.Id, entity);
    }

    public bool RemoveEntity(EntityId id)
    {
        return _entities.Remove(id);
    }
}