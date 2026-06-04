using Microsoft.Extensions.DependencyInjection;

namespace Realmix.Protocol;

public static class ServicesExtensions
{
    public static void AddProtocol(this IServiceCollection services)
    {
        services.AddScoped<WebSocketMiddleware>();
    }
}