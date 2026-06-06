import { ArcRotateCamera, Color3, Engine, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import { GameWorld } from "../world/GameWorld";
import { MeshCube } from "./MeshCube";


export class Renderer {//TODO: render world
    private readonly cubes: Map<String, MeshCube> = new Map<String, MeshCube>;
    private readonly engine: Engine;
    private readonly scene: Scene;

    private constructor(engine: Engine, scene: Scene) {
        this.engine = engine;
        this.scene = scene;
    }

    public update(world: GameWorld) {

        const entities = world.getEntities();
        const contain = new Set<String>();

        for (var entity of entities) {
            contain.add(entity.id);
            var cube = this.cubes.get(entity.id);

            if (cube === undefined) {

                cube = this.createCube(entity.id);
            }

            cube.mesh.position.x = entity.position.x;
            cube.mesh.position.y = entity.position.y;
            cube.mesh.position.z = entity.position.z;


            cube.mesh.rotation.y = entity.rotation;
        }

        for (var exist of this.cubes) {
            if (contain.has(exist[0]) === false) {
                exist[1].material.dispose();
                exist[1].mesh.dispose();
                this.cubes.delete(exist[0]);
            }
                
        }
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

    private createCube(id: String) {
    
            const material = new StandardMaterial(`${id}_material`, this.scene);
    
            const mesh = MeshBuilder.CreateBox(
                id.toString(),
                {
                    size: 1
                },
                this.scene
            );
            mesh.material = material;
            
            const arrow = MeshBuilder.CreateCylinder(`${id}_arrow`, {
                height: 0.8,
                diameter: 0.03
            },
            this.scene);
            arrow.parent = mesh;
    
            arrow.position.z = 0.8;
            arrow.rotation.x = Math.PI / 2;
    
            const arrowMaterial = new StandardMaterial(`${id}_arrow_material`, this.scene);
            arrowMaterial.emissiveColor = new Color3(0.2, 1, 0.2);
            arrow.material = arrowMaterial;
    
            const cube = {mesh: mesh, material: material};
            this.cubes.set(id, cube);
    
            return cube;
        }
}