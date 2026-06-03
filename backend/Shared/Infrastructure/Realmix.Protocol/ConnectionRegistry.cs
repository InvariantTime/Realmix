using System.Collections.Concurrent;

namespace Realmix.Protocol;

public class ConnectionRegistry
{
    private readonly ConcurrentDictionary<string, SocketConnection> _connections;

    public ConnectionRegistry()
    {
        _connections = new ConcurrentDictionary<string, SocketConnection>();
    }

    public void Registry(SocketConnection connection)
    {
        
    }

    public void Unregistry(SocketConnection connection)
    {
        
    }
}