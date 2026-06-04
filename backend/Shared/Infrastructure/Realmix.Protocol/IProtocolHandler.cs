namespace Realmix.Protocol;

public interface IProtocolHandler
{
    Task OnConnectedAsync(SocketConnection connection);

    Task OnDisconnectedAsync(SocketConnection connection);

    Task OnMessageAsync(byte[] message, SocketConnection connection);
}