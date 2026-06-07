import { Renderer } from "../rendering/Renderer";
import { Scene } from "../sceneGraph";
import { IGameLoop } from "./IGameLoop";


export class GameApplication {
    private readonly loop: IGameLoop;
    private readonly scene: Scene;

    constructor(loop: IGameLoop, scene: Scene) {
        this.loop = loop;
        this.scene = scene;
    }

    public start(canvas: HTMLCanvasElement) {//TODO: remove canvas from start method arg
        
        const renderer = Renderer.build(canvas);

        const update = (dt: number) => {

            renderer.update(this.scene);
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