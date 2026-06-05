namespace Realmix.Game.Core;

public readonly record struct EntityId(Guid Value)
{
    public static readonly EntityId Empty = new(Guid.Empty);
    
    public static EntityId New() => new(Guid.NewGuid());

    public static bool TryParse(string? id, out EntityId entityId)
    {
        entityId = Empty;
        
        if (id == null)
            return false;
        
        if (Guid.TryParse(id, out var guid) == false)
            return  false;
        
        entityId = new EntityId(guid);
        return true;
    }

    override public string ToString() => Value.ToString();
}