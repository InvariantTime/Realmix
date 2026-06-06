import { Renderer } from "../rendering/Renderer";
import { GameWorld } from "../world/GameWorld";
import { IGameLoop } from "./IGameLoop";


export class GameApplication {
    private readonly loop: IGameLoop;
    private readonly world: GameWorld;

    constructor(loop: IGameLoop, world: GameWorld) {
        this.loop = loop;
        this.world = world;
    }

    public start(canvas: HTMLCanvasElement) {//TODO: remove canvas from start method arg
        
        const renderer = Renderer.build(canvas);

        const update = (dt: number) => {

            renderer.update(this.world);
            renderer.render();
        }

        this.loop.run({}, update);
    }

    public stop() {
        this.loop.stop();
    }

    public dispose() {
        this.stop();
    }
}