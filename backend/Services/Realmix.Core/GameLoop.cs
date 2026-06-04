using Realmix.Core.Gaming;

namespace Realmix.Core;

public class GameLoop : BackgroundService
{
    private readonly Game _game;
    private readonly GameProtocolHandler _handler;

    public GameLoop(Game game, GameProtocolHandler handler)
    {
        _game = game;
        _handler = handler;
    }
    
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (stoppingToken.IsCancellationRequested == false)
        {
            await Task.Delay(50, stoppingToken);
            var commands = _handler.PullCommands();
            _game.HandleCommands(commands);
            var snapshot = _game.Update();

            await _handler.SendSnapshotAsync(snapshot);
        }
    }
}