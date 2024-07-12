import TunnelProxy from "../app/tunnel_proxy";

// create a instance of aplication
const tunnel = new TunnelProxy({
    backend_url: "http://localhost:7000",
    hostproxy_url: "http://localhost:7000"
});

// create request to example
const request = tunnel.CreateRequestHTTP(1, {
    headers: new Headers({}),
    method: "GET",
    path: "/example/"
});

// buffer of body
// const buffer = new Uint32Array(Buffer.from("Hola mundo", "utf8"));

// write and end, for to emit request
// request.write(buffer);
request.end();