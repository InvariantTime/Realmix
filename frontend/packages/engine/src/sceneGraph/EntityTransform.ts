import { Vector3 } from "../math";
import { EntityComponentBase } from "./EntityComponentBase";

export class EntityTransform extends EntityComponentBase {
    
    public position: Vector3 = Vector3.Zero;

    public rotationY: number = 0;
}