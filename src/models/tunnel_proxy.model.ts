export interface IConfigTunnelProxy {
    /**
     * Backend **api_reverse_proxy**
     */
    backend_url: string,

    /**
     * Url base similar of "http://localhost:9000" or "https://www.google.com"
     */
    hostproxy_url: string

    /**
     * Flag to show console logs
     */
    show_logs?: boolean
}

export interface IRequestHTTP {

    /**
     * ID of request
     */
    readonly id_request: number;

    /**
     * Listen the response of request HTTP
     * @param eventType Event Type of **'request'**
     * @param callback Callback of listen
     */
    on(eventType: "request", callback: (headers: Headers, statusCode: number) => void): void;

    /**
     * Listen the body chunk by response of request HTTP  
     * @param eventType Event Type of **'chunk'**
     * @param callback Callback of listen
     */
    on(eventType: "chunk", callback: (chunk: Uint32Array) => void): void;

    /**
     * Listen the error of request HTTP
     * @param eventType Event type of **'error'**
     * @param callback Callback of listen
     */
    on(eventType: "error", callback: (error: Error) => void): void;

    /**
     * Listen the end of request HTTP
     * @param eventType Event type of **'end'**
     * @param callback Callback of listen
     */
    on(eventType: "end", callback: () => void): void;

    /**
     * Abort the request HTTP
     * @param err Associated error 
     */
    abort(err?: Error): void;

    /**
     * Write a chunk to send to request HTTP
     * @param chunk Chunk to send
     */
    write(chunk: Uint32Array): void;

    /**
     * End to write chunks and emit request to get response
     */
    end(): void;
}