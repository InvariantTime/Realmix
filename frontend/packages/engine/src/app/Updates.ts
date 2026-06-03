import { Vector3 } from "@babylonjs/core";
import { GameCube, moveSpeed, rotationSpeed } from "./GameCube"
import { CommandType } from "@realmix/protocol/gen/game";
import { sendCommand } from "@realmix/protocol";

export const updateWorld = ({ inputs, ws }: IUpdateContext) => {

    var commands: CommandType[] = [];

    if (inputs.has("KeyW") === true) {
        commands = [...commands, CommandType.Forward];
    }
    else if (inputs.has("KeyS") === true) {
        commands = [...commands, CommandType.Backward];
    }

    if (inputs.has("KeyA") === true) {
       commands = [...commands, CommandType.Left];
    }
    else if (inputs.has("KeyD") === true) {
        commands = [...commands, CommandType.Right];
    }

    if (inputs.has("KeyQ") == true) {
        commands = [...commands, CommandType.RotateLeft];
    }

    if (inputs.has("KeyE") == true) {
        commands = [...commands, CommandType.RotateRight];
    }

    commands.forEach(c => sendCommand(ws, c));
}


interface IUpdateContext {
    inputs: Set<string>,
    ws: WebSocket
}