import { Entity } from "./Entity";
import { SceneGraphPipeline } from "./SceneGraphPipeline";

export abstract class EntityComponentBase {
    private _entity?: Entity;
    private _pipeline?: SceneGraphPipeline;

    public get isInitialized() {
        return true;
    }

    protected get entity() {
        return null;
    }

    public initialize(pipeline: SceneGraphPipeline, entity: Entity) {
        pipeline.initialize(this, entity);
        this._pipeline = pipeline;
        this._entity = entity;
    }

    public uninitialize() {

    }

    public destroyObject() {

    }

    public destroyComponent() {

    }
}