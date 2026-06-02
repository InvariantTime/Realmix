import { Vector3 } from "@babylonjs/core";
import { GameCube, moveSpeed, rotationSpeed } from "./GameCube"

export const updateWorld = ({ inputs, cube }: IUpdateContext) => {


    if (inputs.has("KeyW") === true) {
        const direction = cube.getDirection(Vector3.Forward());
        cube.position.addInPlace(direction.scale(moveSpeed));
    }
    else if (inputs.has("KeyS") === true) {
        const direction = cube.getDirection(Vector3.Forward());
        cube.position.addInPlace(direction.scale(-moveSpeed));
    }

    if (inputs.has("KeyA") === true) {
        const left = cube.getDirection(Vector3.Left());
        cube.position.addInPlace(left.scale(moveSpeed));
    }
    else if (inputs.has("KeyD") === true) {
        const left = cube.getDirection(Vector3.Left());
        cube.position.addInPlace(left.scale(-moveSpeed));
    }

    if (inputs.has("KeyQ") == true) {
        cube.rotation -= rotationSpeed;
    }

    if (inputs.has("KeyE") == true) {
        cube.rotation += rotationSpeed;
    }

}


interface IUpdateContext {
    inputs: Set<string>,
    cube: GameCube
}