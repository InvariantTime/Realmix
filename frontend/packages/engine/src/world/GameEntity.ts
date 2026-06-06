import { Vector3 } from "@realmix/protocol/gen/game";


export class GameEntity {

    public constructor(
        public readonly id: String,
        public position: Vector3,
        public rotation: number) {
    }
}