import { IRequest } from "../models/requests.model";
import { IConfigTunnelProxy, IRequestHTTP } from "../models/tunnel_proxy.model";
import http from "http";
import https from "https";

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
     * Array of requests
     */
    private requests: IRequestHTTP[] = [];

    /**
     * Builder tunnel proxy
     */
    constructor(config: IConfigTunnelProxy) {
        this.backend_url = config.backend_url;
        this.hostproxy_url = config.hostproxy_url;
    }

    /**
     * Start device
     */
    public async inicialize(): Promise<void> {

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
            signal: controller.signal
        });

        fetching.on("connect", (incomming, socket, head) => {
            console.log("Event emmited:", "connect");
        });

        fetching.on("close", () => {
            console.log("Event emmited:", "close");
        });

        fetching.on("continue", () => {
            console.log("Event emmited:", "continue");
        });

        fetching.on("drain", () => {
            console.log("Event emmited:", "drain");
        });

        fetching.on("error", (err) => {
            console.log("Event emmited:", "error");
        });

        fetching.on("finish", () => {
            console.log("Event emmited:", "finish");
        });

        fetching.on("information", (info) => {
            console.log("Event emmited:", "information");
        });
    
        fetching.on("pipe", (src) => {
            console.log("Event emmited:", "pipe");
        });

        fetching.on("response", (response) => {
            console.log("Event emmited:", "response");

            response.on("resume", () => {
                console.log("response event: resume")
            });

            // response.on("readable", () => {
            //     console.log("response event: readable")
            // });

            response.on("pause", () => {
                console.log("response event: pause")
            });

            response.on("error", (err) => {
                console.log("response event: error")
            });

            response.on("end", () => {
                    console.log("response event: end")
            });

            response.on("data", (chunk) => {
                console.log("response event: data")
            });

            response.on("close", () => {
                console.log("response event: close")
            });
        });

        fetching.on("socket", (socket) => {
            console.log("Event emmited:", "socket");
        });

        fetching.on("timeout", () => {
            console.log("Event emmited:", "timeout");
        });

        fetching.on("unpipe", (src) => {
            console.log("Event emmited:", "unpipe");
        });

        fetching.on("upgrade", (response, socket, head) => {
            console.log("Event emmited:", "upgrade");
        });

        return requestHTTP;
    }

}