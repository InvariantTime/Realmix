import { HelloRequest, HelloResponse } from "./gen/test"

export async function sayHello() {
    const data = HelloRequest.encode({}).finish();

    const request = {
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/protobuf"
        }
    };

    const result = await fetch("http://localhost:5000/hello", request);

    if (result.ok) {
        const buff = await result.arrayBuffer();
        const response = HelloResponse.decode(new Uint8Array(buff));

        alert(response.text);
    }
}