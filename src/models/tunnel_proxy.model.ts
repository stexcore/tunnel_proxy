export interface IConfigTunnelProxy {
    /**
     * Backend hostname **api_reverse_proxy**
     */
    backend_hostname: string,

    /**
     * Backend port **api_reverse_proxy**
     */
    backend_port: number,

    /**
     * backend secure protocol **api_reverse_proxy**
     */
    backend_secure_protocol: boolean,

    /**
     * Url base similar of "http://localhost:9000" or "https://www.google.com"
     */
    hostproxy_url: string,

    /**
     * NameProxy to server
     */
    proxy_name: string,

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
     * Emitted event of http init, is issued when it is ready to send data to the server
     * @param eventType Http Init Event
     * @param callback callback
     */
    on(eventType: "http_init", callback: () => void): void;

    /**
     * Emitted after you call the end method and it has been determined 
     * that the server has received all the chunks
     * @param eventType Http finish event
     * @param callback callback
     */
    on(eventType: "http_finish", callback: () => void): void;

    /**
     * Emitted when the server sends the response header, along with the HTTP status code
     * @param eventType Http response event
     * @param callback Callback
     */    
    on(eventType: "http_response", callback: (headers: Headers, statusCode: number) => void): void;

    /**
     * Emitted after receiving the response headers from the server. Emit the data 
     * chunks of the request body
     * @param eventType Http data event
     * @param callback Callback
     */
    on(eventType: "http_data", callback: (chunk: Uint8Array) => void): void;

    /**
     * Emitted when the transmission of chunks of the HTTP request body ends
     * @param eventType Http end event
     * @param callback Callback
     */
    on(eventType: "http_end", callback: () => void): void;

    /**
     * Emitted when the TCP connection is closed
     * @param eventType HTTP close event
     * @param callback Callback
     */
    on(eventType: "http_close", callback: () => void): void;

    /**
     * Emitted when some Error occurs
     * @param eventType Http error event
     * @param callback Callback
     */
    on(eventType: "http_error", callback: (err: Error) => void): void;
    
    /**
     * Emitted when the upgrade is found in the headers response HTTP
     * @param eventType Http upgrade event
     * @param callback Callback
     */
    on(eventType: "http_upgrade", callback: () => void): void;

    /**
     * Emitted event of http init, is issued when it is ready to send data to the server
     * @param eventType Http Init Event
     */
    emit(eventType: "http_init"): void;

    /**
     * Emitted after you call the end method and it has been determined 
     * that the server has received all the chunks
     * @param eventType Http finish event
     */
    emit(eventType: "http_finish"): void;

    /**
     * Emitted when the server sends the response header, along with the HTTP status code
     * @param eventType Http response event
     * @param headers headers
     * @param statusCode code of response HTTP
     */    
    emit(eventType: "http_response", headers: Headers, statusCode: number): void;

    /**
     * Emitted after receiving the response headers from the server. Emit the data 
     * chunks of the request body
     * @param eventType Http data event
     * @param callback Callback
     */
    emit(eventType: "http_data", chunk: Uint8Array): void;

    /**
     * Emitted when the transmission of chunks of the HTTP request body ends
     * @param eventType Http end event
     */
    emit(eventType: "http_end"): void;

    /**
     * Emitted when the TCP connection is closed
     * @param eventType HTTP close event
     */
    emit(eventType: "http_close"): void;

    /**
     * Emitted when some Error occurs
     * @param eventType Http error event
     * @param err Error
     */
    emit(eventType: "http_error", err: Error): void;
    
    /**
     * Emitted when the upgrade is found in the headers response HTTP
     * @param eventType Http upgrade event
     */
    emit(eventType: "http_upgrade"): void;
    
    /**
     * Abort the request HTTP
     * @param err Associated error 
     */
    abort(err?: Error): void;

    /**
     * Write a chunk to send to request HTTP
     * @param chunk Chunk to send
     */
    write(chunk: Uint8Array): void;

    /**
     * End to write chunks and emit request to get response
     */
    end(): void;
}

export interface IConnectionWebsocket {

    /**
     * ID of connection
     */
    readonly id_connection: number;

    /**
     * Emitted when the connection has been establish
     * @param eventType Event Type
     * @param callback Callback
     */
    on(eventType: "websocket_open", callback: () => void): void;

    /**
     * Emitted when the connection has been disconnect
     * @param eventType Event Type
     * @param callback Callback
     */
    on(eventType: "websocket_close", callback: () => void): void;

    /**
     * Emitted when the connection has occured an error
     * @param eventType Event Type
     * @param callback Callback
     */
    on(eventType: "websocket_error", callback: (err: Error) => void): void;

    /**
     * Emitted when the connection receive a message
     * @param eventType Event Type
     * @param callback Callback
     */
    on(eventType: "websocket_message", callback: (message: Buffer, isBinary: boolean) => void): void;

    /**
     * Emitted when the connection has been establish
     * @param eventType Event Type
     * @param callback Callback
     */
    emit(eventType: "websocket_open"): void;

    /**
     * Emitted when the connection has been disconnect
     * @param eventType Event Type
     * @param callback Callback
     */
    emit(eventType: "websocket_close"): void;

    /**
     * Emitted when the connection has occured an error
     * @param eventType Event Type
     * @param callback Callback
     */
    emit(eventType: "websocket_error", error: Error): void;

    /**
     * Emitted when the connection receive a message
     * @param eventType Event Type
     * @param callback Callback
     */
    emit(eventType: "websocket_message", message: Buffer, isBinary: boolean): void;
    
    /**
     * Close the connection
     * @param err Associated error 
     */
    close(err?: Error): void;

    /**
     * Send message
     * @param chunk Chunk to send
     */
    send(chunk: Uint8Array | string): void;
}