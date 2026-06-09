import { Entity } from "./Entity";
import { SceneGraphPipeline } from "./SceneGraphPipeline";

export class Scene {
    private readonly _entities: Map<String, Entity> = new Map<String, Entity>();
    private readonly _pipeline: SceneGraphPipeline;

    public constructor() {
        this._pipeline = new SceneGraphPipeline(this);
    }

    public get entities(): Iterable<Entity> {
        return this._entities.values();
    }

    public addEntity(entity: Entity) {
        this._entities.set(entity.id, entity);
        this._pipeline.initializeEntity(entity);
    }

    public removeEntity(id: string) {
        const entity = this._entities.get(id);

        if (entity !== undefined) {
            this._entities.delete(entity.id);
            this._pipeline.uninitializeEntity(entity);
        }

        return entity !== undefined;
    }
}