export interface IRequest {
    headers: Headers,
    method: string,
    path: string,
}

export type ITypeEventRequestHTTP =
    | "http_request"
    | "http_init"
    | "http_data"
    | "http_finish"
    | "http_response"
    | "http_upgrade"
    | "http_close"
    | "http_error"
    | "http_end"