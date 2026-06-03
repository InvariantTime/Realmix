import { ArcRotateCamera, Color3, Engine, HemisphericLight, Material, Mesh, MeshBuilder, PBRMaterial, Scene, StandardMaterial, Vector3 } from "@babylonjs/core"
import { GameCube } from "./GameCube";
import { updateWorld } from "./Updates";
import { createWebSocket, getSnapshot } from "@realmix/protocol";

export interface IVisualProvider {
    readonly canvas: HTMLCanvasElement
}

export class EngineApplication {
    private engine?: Engine;
    private scene?: Scene;
    private keys: Set<string> = new Set<string>();
    private players: Map<string, GameCube>
    private ws: WebSocket;
    
    public constructor(private readonly canvas: HTMLCanvasElement) {
        this.ws = createWebSocket();
        this.players = new Map<string, GameCube>();
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

        const groundMaterial = new PBRMaterial("ground_material", scene);
        groundMaterial.albedoColor = new Color3(1, 0.2, 0.2);
        groundMaterial.roughness = 0.6;
        groundMaterial.metallic = 0.8;
        ground.material = groundMaterial;

        const light = new HemisphericLight(
            "light",
            new Vector3(0, 1, 0),
            scene
        );

        light.intensity = 0.4;

        this.ws.onmessage = (e) => {
            this.handleMessage(e);
        }

        this.engine.runRenderLoop(() => {

            const context = {
                inputs: this.keys,
                ws: this.ws
            };

            updateWorld(context);

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
        this.ws?.close();
    }

    private handleMessage(e: MessageEvent) {
        const snapshot = getSnapshot(e);
        const keys = new Set<string>();

        snapshot.players.forEach(x => {
            keys.add(x.id);
            const color = new Color3(x.color?.x, x.color?.y, x.color?.z);

            var player = this.players.get(x.id);
            
            
            if (player === undefined) {
                player = this.createPlayer(x.id, color, this.scene!);
            }
            
            player.setPosition(new Vector3(x.position?.x, x.position?.y, x.position?.z));
            player.setRotation(x.rotation);
            player.setColor(color);
        });

        this.players.forEach(x => {
            if (keys.has(x.id) === false) {
                this.removePlayer(x.id);
            }
        });
    }

    private createPlayer(id: string, color: Color3, scene: Scene) : GameCube {

        const material = new StandardMaterial(`${id}_material`, scene);
        material.diffuseColor = color;

        const mesh = MeshBuilder.CreateBox(
            id,
            {
                size: 1
            },
            scene
        );
        mesh.material = material;
        
        const arrow = MeshBuilder.CreateCylinder(`${id}_arrow`, {
            height: 0.8,
            diameter: 0.03
        },
        scene);
        arrow.parent = mesh;

        arrow.position.z = 0.8;
        arrow.rotation.x = Math.PI / 2;

        const arrowMaterial = new StandardMaterial(`${id}_arrow_material`, scene);
        arrowMaterial.emissiveColor = new Color3(0.2, 1, 0.2);
        arrow.material = arrowMaterial;

        const cube = new GameCube(mesh, material, id);
        this.players.set(id, cube);

        return cube;
    }

    private removePlayer(id: string) {
        const player = this.players.get(id);

        if (player === undefined)
            return;

        this.players.delete(id);
        player.dispose();
    }
}