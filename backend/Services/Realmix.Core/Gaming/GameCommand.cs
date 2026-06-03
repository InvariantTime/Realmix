namespace Realmix.Core.Gaming;

public abstract record GameCommand
{
    public required GameCubeId PlayerId { get; init; }

    public static JoinPlayerCommand CreateJoinPlayerCommand(GameCubeId id)
    {
        return new JoinPlayerCommand
        {
            PlayerId = id,
        };
    }

    public static LeavePlayerCommand CreateLeavePlayerCommand(GameCubeId id)
    {
        return new LeavePlayerCommand
        {
            PlayerId = id,
        };
    }

    public static InputCommand CreateInputCommand(GameCubeId id, GameCubeControlState state)
    {
        return new InputCommand
        {
            PlayerId = id,
            State = state
        };
    }
    
    public record JoinPlayerCommand : GameCommand
    {
    }

    public record LeavePlayerCommand : GameCommand
    {
    }

    public record InputCommand : GameCommand
    {
        public GameCubeControlState State { get; init; }
    }
}