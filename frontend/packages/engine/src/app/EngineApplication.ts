import { ArcRotateCamera, Engine, MeshBuilder, Scene, Vector3 } from "@babylonjs/core"

export interface IVisualProvider {
    readonly canvas: HTMLCanvasElement
}

export class EngineApplication {
    private engine?: Engine;
    private scene?: Scene;
    
    public constructor(private readonly canvas: HTMLCanvasElement) {
    }

    public start() {
        this.engine = new Engine(this.canvas, true);

        const scene = new Scene(this.engine);

        const camera = new ArcRotateCamera(
            "camera",
            Math.PI / 2,
            Math.PI / 3,
            10,
            Vector3.Zero(),
            scene
        );

        camera.attachControl(this.canvas, true);

        MeshBuilder.CreateBox(
            "box",
            {
                size: 2
            },
            scene
        );

        this.engine.runRenderLoop(() => {
            scene.render();
        });

        window.addEventListener("resize", () => {
            this.engine?.resize();
        });

        this.scene = scene;
    }

    public dispose() {
        this.scene?.dispose();
        this.engine?.dispose();
    }
}