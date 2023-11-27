const Websocket = require("ws");

const wss = new Websocket.Server({ port: 8082 });


wss.on("connection", (ws) => {
    console.log("new client connection")

    ws.on("close", () => {
        console.log("client disconnected")
    })
})