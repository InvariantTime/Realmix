import { Entity } from "./Entity";

export class Scene {
    private readonly _entities: Map<String, Entity> = new Map<String, Entity>();

    public get entities(): Iterable<Entity> {
        return this._entities.values();
    }

    public addEntity(entity: Entity) {
        this._entities.set(entity.id, entity);
    }

    public removeEntity(id: string) {
        return this._entities.delete(id);
    }
}