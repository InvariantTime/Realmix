import { Vector3 } from "@babylonjs/core";

export class GameEntity {

    public constructor(
        public readonly id: string,
        public position: Vector3,
        public rotation: number) {
    }
}