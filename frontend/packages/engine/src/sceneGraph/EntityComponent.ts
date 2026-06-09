import { EntityComponentBase } from "./EntityComponentBase";
import { EntityTransform } from "./EntityTransform";

export abstract class EntityComponent extends EntityComponentBase {
    
    public get transform() {
        return null;
    }
}