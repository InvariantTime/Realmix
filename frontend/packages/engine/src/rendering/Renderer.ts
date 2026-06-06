import { ArcRotateCamera, Color3, Engine, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import { GameWorld } from "../world/GameWorld";
import { MeshCube } from "./MeshCube";


export class Renderer {//TODO: render world
    private readonly cubes = Map<string, MeshCube>;
    private readonly engine: Engine;
    private readonly scene: Scene;

    private constructor(engine: Engine, scene: Scene) {
        this.engine = engine;
        this.scene = scene;
    }

    public update(world: GameWorld) {

    }

    public render() {

        this.scene.render();
    }

    public static build(canvas: HTMLCanvasElement) {
        const engine = new Engine(canvas);
        const scene = new Scene(engine);

        const ground = MeshBuilder.CreateGround("ground", {
            width: 20,
            height: 20
        });

        const groundMaterial = new StandardMaterial("ground_material", scene);
        groundMaterial.diffuseColor = new Color3(1, 0.2, 0.2);
        ground.material = groundMaterial;

        const camera = new ArcRotateCamera(
            "camera",
            Math.PI / 2,
            Math.PI / 3,
            10,
            Vector3.Zero(),
            scene
        );

        const light = new HemisphericLight(
            "light",
            new Vector3(0, 1, 0),
            scene
        );

        light.intensity = 0.4;

        window.addEventListener("resize", () => {
            engine.resize();
        });

        camera.attachControl(canvas, true);

        return new Renderer(engine, scene);
    }
}