import { GameLoopOptions, IGameLoop } from "./IGameLoop";

export class BrowserGameLoop implements IGameLoop { //Very simple game loop based on request
    private isRunning: boolean = false;

    public run(options: GameLoopOptions, callback: (dt: number) => void) {

        this.isRunning = true;

        let prev = performance.now();

        const tick = () => {

            if (this.isRunning === false)
                return;

            const now = performance.now();
            const delta = (now - prev) / 1000;

            callback(delta);

            prev = now;
            requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    public stop() {
        this.isRunning = false;
    }
}