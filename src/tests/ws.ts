import TunnelProxy from "../app/tunnel_proxy";

// create a instance of aplication
const tunnel = new TunnelProxy({
    backend_hostname: "localhost",
    backend_port: 7000,
    backend_secure_protocol: false,
    hostproxy_url: "http://localhost:7000",
    proxy_name: "example/pause"
});

// create websocket connection to example
const connection = tunnel.CreateWebsocketConnection(1, {
    headers: new Headers({}),
    path: "/example/"
});

connection.on("websocket_open", () => {
    console.log("EVENT:", "websocket_open");
});

connection.on("websocket_close", () => {
    console.log("EVENT:", "websocket_close");
});

connection.on("websocket_message", (message, isBinary) => {
    console.log("EVENT:", "websocket_message");
});

connection.on("websocket_error", (err) => {
    console.log("EVENT:", "websocket_error");
});