using Realmix.Core.Gaming;

namespace Realmix.Core;

public class GameLoop : BackgroundService
{
    private readonly Game _game;
    private readonly ClientBridge _bridge;

    public GameLoop(Game game, ClientBridge bridge)
    {
        _game = game;
        _bridge = bridge;
    }
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (stoppingToken.IsCancellationRequested == false)
        {
            await Task.Delay(50, stoppingToken);
            var commands = _bridge.PullCommands().ToArray();
            _game.HandleCommands(commands);
            var snapshot = _game.Update();
            
            await _bridge.SendStateAsync(snapshot);
        }
    }
}