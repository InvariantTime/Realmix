import { Quaternion, Vector3 } from "@babylonjs/core";

export const moveSpeed: number = 0.06;
export const rotationSpeed = 0.04;

export class GameCube {
    public position: Vector3 = Vector3.Zero();
    public rotation: number = 0;

    public getDirection(vector: Vector3): Vector3 {

        const quaternion = Quaternion.RotationAxis(new Vector3(0, 1, 0), this.rotation);
        return vector.applyRotationQuaternion(quaternion);
    }
}

enum DirectionParts {
    None = 0,
    Plus = 1,
    Minus = -1
}

const asNumber = (part: DirectionParts) => {

    if (part === DirectionParts.Plus)
        return 1;

    if (part === DirectionParts.Minus)
        return -1;

    return 0;
}