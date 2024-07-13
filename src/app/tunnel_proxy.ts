import { IRequest } from "../models/requests.model";
import { IConfigTunnelProxy, IRequestHTTP } from "../models/tunnel_proxy.model";
import { io, Socket } from "socket.io-client";
import http from "http";
import https from "https";
import "colors";

/**
 * Tunnel proxy
 */
export default class TunnelProxy {

    /**
     * Url ApiServer **api_reverse_proxy**
     */
    private backend_url: string;

    /**
     * Url host proxy
     */
    private hostproxy_url: string;

    /**
     * Show logs
     */
    private show_logs: boolean;

    /**
     * Array of requests
     */
    private requests: IRequestHTTP[] = [];

    /**
     * Connection to server
     */
    private socket: Socket | null;

    /**
     * Builder tunnel proxy
     */
    constructor(config: IConfigTunnelProxy) {
        this.backend_url = config.backend_url;
        this.hostproxy_url = config.hostproxy_url;
        this.show_logs = config.show_logs ?? true;
        this.socket = null;
    }

    /**
     * Start device
     */
    public inicialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                // check other process
                if(this.socket) {

                    // check is connected
                    if(this.socket.connected) {
                        throw new Error("The tunnel was already initialized");
                    }
                    throw new Error("The tunnel is initializing");
                }

                let connectedSomeTime = false;
                
                // create socket connection
                this.socket = io(this.backend_url, {
                    reconnection: true
                });

                // Disconnect connection Event 
                this.socket.on("disconnect", (reason) => {
                    this.log("Disconnect".red, reason);
                    this.socket = null;
                });

                // Error to connect Event
                this.socket.on("connect_error", (err) => {
                    if(!connectedSomeTime) {
                        // close to prevent attemps to reconnect
                        this.socket?.disconnect();
                        // reject promise and exit 
                        return reject(err);
                    }

                    this.log("Connect Error... retrying...");
                });

                // Connect Event
                this.socket.on("connect", () => {
                    this.log("Connect");
                });
            }
            catch(err) {
                reject(err);
            }
        });

    }

    /**
     * Stop the device
     */
    public async destroy(): Promise<void> {

    }

    public CreateRequestHTTP(id_request: number, request: IRequest): IRequestHTTP {
        // request url
        const url = new URL(request.path, this.hostproxy_url);
        const listenner: {
            eventType: string,
            callback: (...args: any[]) => void
        }[] = [];

        const requestHTTP: IRequestHTTP = {

            // ID request
            id_request: id_request,

            // Add listen
            on(eventType: string, callback: (...args: any[]) => void): void {
                // add listenner
                listenner.push({ eventType, callback })
            },

            // write body
            write(chunk): void {
                fetching.write(chunk);
            },

            // end and emit request
            end(): void {
                fetching.end();
            },

            // abort request
            abort(err?: Error): void {

            }
        };

        // Add request of array
        this.requests.push(requestHTTP);

        // Init headers
        const headers = new Headers(request.headers);
        const headersRequest: {[key: string]: string} = { }
        
        headers.set("host", url.host || request.headers.get("host") || "");
        headers.forEach((value, keyname) => {
            headersRequest[keyname] = value;
        });

        // protocol to request
        const protocol = url.protocol == "https" ? https : http;
        const controller = new AbortController();
        const fetching = protocol.request({
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: request.method.toUpperCase(),
            headers: headersRequest,
            signal: controller.signal,
            timeout: 0
        });

        // fetching.on("socket", (socket) => {
        //     this.log("Event emmited:", "socket");
        // });

        // fetching.on("timeout", () => {
        //     this.log("Event emmited:", "timeout");
        // });
        
        // fetching.on("drain", () => {
        //     this.log("Event emmited:", "drain");
        // });

        // fetching.on("connect", (incomming, socket, head) => {
        //     this.log("Event emmited:", "connect");
        // });

        // fetching.on("continue", () => {
        //     this.log("Event emmited:", "continue");
        // });

        // fetching.on("information", (info) => {
        //     this.log("Event emmited:", "information");
        // });

        fetching.on("upgrade", (response, socket, head) => {
            this.log("Event emmited:", "upgrade");
        });

        fetching.on("close", () => {
            this.log("Event emmited:", "close");
        });

        fetching.on("error", (err) => {
            this.log("Event emmited:", "error");
        });

        fetching.on("finish", () => {
            this.log("Event emmited:", "finish");
        });

        fetching.on("response", (response) => {
            this.log("Event emmited:", "response");

            response.on("error", (err) => {
                this.log("response event: error")
            });

            response.on("end", () => {
                    this.log("response event: end")
            });

            response.on("data", (chunk) => {
                this.log("response event: data")
            });

            response.on("close", () => {
                this.log("response event: close")
            });
        });

        return requestHTTP;
    }

    /**
     * Emit log in the console
     * @param values Values of log
     */
    private log(...values: any[]) {
        // emit log if is enabled show it
        if(this.show_logs) {
            console.log(...values);
        }
    }

}