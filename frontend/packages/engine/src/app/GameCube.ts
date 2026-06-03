import { Color3, Mesh, Quaternion, StandardMaterial, Vector3 } from "@babylonjs/core";

export const moveSpeed: number = 0.06;
export const rotationSpeed = 0.04;

export class GameCube {
    private readonly mesh: Mesh;
    private readonly material: StandardMaterial;

    public readonly id: string;

    constructor(mesh: Mesh, material: StandardMaterial, id: string) {
        this.mesh = mesh;
        this.material = material;
        this.id = id;
    }

    public setPosition(vector: Vector3) {
        this.mesh.position = vector;
    }

    public setRotation(rotation: number) {
        this.mesh.rotation.y = rotation;
    }

    public setColor(color: Color3) {
        this.material.diffuseColor = color;
    }

    public dispose() {
        this.mesh.dispose();
        this.material.dispose();
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