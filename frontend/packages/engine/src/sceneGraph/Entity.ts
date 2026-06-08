import { Vector3 } from "../math";
import { EntityComponent } from "./EntityComponent";

export class Entity {
    private components: EntityComponent[] = [];

    public readonly id: string;

    public position: Vector3;

    public rotation: number;

    public constructor(id: string, position: Vector3 = Vector3.Zero, rotation: number = 0) {
        this.id = id;
        this.position = position;
        this.rotation = rotation;
    }

    public addComponent(component: EntityComponent) {
        this.components = [...this.components, component];
    }

    public removeComponent(component: EntityComponent) {
        this.components = this.components.filter(x => x !== component);
    }

    public getAllComponents() : Iterable<EntityComponent> {
        return this.components;
    }

    public getComponent<T extends EntityComponent>(componentClass: new (...args: any[]) => T): T | null {
    const found = this.components.find(c => c instanceof componentClass);
    return (found as T) || null;
  }
}