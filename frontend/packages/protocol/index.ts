import {CommandType, ClientCommand, CubeData, WorldSnapshot } from "./gen/game"

export async function sendCommand(ws: WebSocket, command: CommandType) {
    
    const data = ClientCommand.encode({commandType: command}).finish();
    await ws.send(data);
}

export function getSnapshot(e: MessageEvent) {
    const response = WorldSnapshot.decode(new Uint8Array(e.data));
    return response;
}

export function createWebSocket() {

    const ws = new WebSocket("ws://localhost:5000/ws");
    ws.binaryType = "arraybuffer";

    return ws;
}