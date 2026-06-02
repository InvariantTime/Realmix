import { ArcRotateCamera, Color3, Engine, HemisphericLight, Material, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core"
import { GameCube } from "./GameCube";
import { updateWorld } from "./Updates";
import { createWebSocket, reciveData } from "@realmix/protocol";

export interface IVisualProvider {
    readonly canvas: HTMLCanvasElement
}

export class EngineApplication {
    private engine?: Engine;
    private scene?: Scene;
    private keys: Set<string> = new Set<string>();
    private cube: GameCube = new GameCube();
    
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

        const ground = MeshBuilder.CreateGround("ground", {
            width: 20,
            height: 20
        });

        const groundMaterial = new StandardMaterial("ground_material", scene);
        groundMaterial.diffuseColor = new Color3(1, 0.2, 0.2);

        ground.material = groundMaterial;

        const b = MeshBuilder.CreateBox(
            "box",
            {
                size: 1
            },
            scene
        );
        
        const arrow = MeshBuilder.CreateCylinder("arrow", {
            height: 0.8,
            diameter: 0.03
        },
        scene);
        arrow.parent = b;

        arrow.position.z = 0.8;
        arrow.rotation.x = Math.PI / 2;

        const arrowMaterial = new StandardMaterial("arrow_material", scene);
        arrowMaterial.emissiveColor = new Color3(0.2, 1, 0.2);
        arrow.material = arrowMaterial;

        this.cube.position.y = 0.5;


        const light = new HemisphericLight(
            "light",
            new Vector3(0, 1, 0),
            scene
        );

        light.intensity = 0.4;

        var ws = createWebSocket();

        ws.onmessage = (e) => {
            const data = reciveData(e);
            this.cube.position = new Vector3(data.x, data.y, data.z);
            this.cube.rotation = data.rotation;
        }

        this.engine.runRenderLoop(() => {

            const context = {
                inputs: this.keys,
                cube: this.cube,
                ws: ws
            };

            updateWorld(context);

            b.position = this.cube.position;
            b.rotation.y = this.cube.rotation;

            scene.render();
        });

        window.addEventListener("resize", () => {
            this.engine?.resize();
        });

        window.addEventListener("keydown", (e) => {
            this.keys.add(e.code);
        });

        window.addEventListener("keyup", (e) => {
            this.keys.delete(e.code);
        });

        this.scene = scene;
    }

    public dispose() {
        this.scene?.dispose();
        this.engine?.dispose();
    }
}