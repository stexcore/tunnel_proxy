export interface IHandshakeWebsocket {
    headers: Headers,
    path: string,
}


export type ITypeEventRequestWebsocket =
    | "websocket_open"
    | "websocket_close"
    | "websocket_error"
    | "websocket_message"
    | "websocket_request"