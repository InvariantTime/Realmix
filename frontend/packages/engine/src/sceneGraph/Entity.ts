import { Vector3 } from "../math";
import { EntityComponent } from "./EntityComponent";

export class Entity {
    private readonly components: Set<EntityComponent> = new Set<EntityComponent>();

    public readonly id: string;

    public position: Vector3;

    public rotation: number;

    public constructor(id: string, position: Vector3 = Vector3.Zero, rotation: number = 0) {
        this.id = id;
        this.position = position;
        this.rotation = rotation;
    }

    public addComponent() {
    }

    public removeComponent() {
    }

    public getAllComponents() {
    }

    public getComponent() {
    }
}