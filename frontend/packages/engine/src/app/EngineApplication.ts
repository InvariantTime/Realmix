import { ArcRotateCamera, Color3, Engine, HemisphericLight, Material, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core"

export interface IVisualProvider {
    readonly canvas: HTMLCanvasElement
}

export class EngineApplication {
    private engine?: Engine;
    private scene?: Scene;
    private keys: Set<string> = new Set<string>();
    
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

        b.position.y = 0.5;


        const light = new HemisphericLight(
            "light",
            new Vector3(0, 1, 0),
            scene
        );

        light.intensity = 0.4;

        this.engine.runRenderLoop(() => {

            const speed = 0.06;
            const rotationSpeed = 0.04;

            if (this.keys.has("KeyW") === true) {
                const direction = b.getDirection(Vector3.Forward());
                b.position.addInPlace(direction.scale(speed));
            }
            else if (this.keys.has("KeyS") === true) {
                const direction = b.getDirection(Vector3.Forward());
                b.position.addInPlace(direction.scale(-speed));
            }

            if (this.keys.has("KeyA") === true) {
                const left = b.getDirection(Vector3.Left());
                b.position.addInPlace(left.scale(speed));
            }
            else if (this.keys.has("KeyD") === true) {
                const left = b.getDirection(Vector3.Left());
                b.position.addInPlace(left.scale(-speed));
            }

            if (this.keys.has("KeyQ") == true) {
                b.rotation.y -= rotationSpeed;
            }

            if (this.keys.has("KeyE") == true) {
                b.rotation.y += rotationSpeed;
            }

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