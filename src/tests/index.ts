import TunnelProxy from "../app/tunnel_proxy";

// create a instance of aplication
const tunnel = new TunnelProxy({
    backend_url: "http://localhost:7000",
    hostproxy_url: "http://localhost:7000",
    proxy_name: "example/pause"
});

// create request to example
const request = tunnel.CreateRequestHTTP(1, {
    headers: new Headers({}),
    method: "GET",
    path: "/example/headers/abort"
});

request.on("http_init", () => {
    console.log("Event emmited:", "socket");
});

request.on("http_finish", () => {
    console.log("Event emmited:", "finish");
});

request.on("http_upgrade", () => {
    console.log("Event emmited:", "upgrade");
});

request.on("http_response", (headers, statusCode) => {
    console.log("Event emmited:", "response");
});

request.on("http_data", (chunk) => {
    console.log("Event emmited: data")
});

request.on("http_end", () => {
    console.log("Event emmited: end")
});

request.on("http_close", () => {
    console.log("Event emmited:", "close");
});

request.on("http_error", (err) => {
    console.log("Event emmited:", "error");
});

// buffer of body
// const buffer = new Uint32Array(Buffer.from("Hola mundo", "utf8"));

// write and end, for to emit request
// request.write(buffer);
request.end();