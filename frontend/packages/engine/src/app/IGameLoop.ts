
export interface IGameLoop {
    run: (options: GameLoopOptions, callback: (dt: number) => void) => void,
    stop: () => void
}

export interface GameLoopOptions {
}