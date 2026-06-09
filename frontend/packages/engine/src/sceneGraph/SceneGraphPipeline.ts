import { Entity } from "./Entity";
import { EntityComponentBase } from "./EntityComponentBase";
import { Scene } from "./Scene";

export class SceneGraphPipeline {

    public constructor(public readonly scene: Scene) {
    }

    public initialize(component: EntityComponentBase, entity: Entity) {

    }

    public initializeEntity(entity: Entity) {
        
    }

    public uninitialize(component: EntityComponentBase) {

    }

    public uninitializeEntity(entity: Entity) {

    }
}