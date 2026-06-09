import { Entity } from "./Entity";

export abstract class EntityComponentBase {
    private _entity?: Entity;

    public get isInitialized() {
        return true;
    }

    public initialize() {

    }

    public uninitialize() {

    }

    public destroyObject() {

    }

    public destroyComponent() {
        
    }
}