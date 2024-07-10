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

    private CreateRequestHTTP(id_request: number, request: IRequest): IRequestHTTP {
        // request url
        const url = new URL(request.path, this.hostproxy_url);

        const requestHTTP: IRequestHTTP = {

            // ID request
            id_request: id_request,

            // Add listen
            on(eventType: string, callback: (...args: any[]) => void): void {
                
            },

            write(chunk): void {
                
            },

            end(): void {
                
            },

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
        }, (incomming) => {

        });

        fetching.on("connect", (incomming, socket, head) => {

        });

        fetching.on("close", () => {

        });

        fetching.on("continue", () => {

        });

        fetching.on("drain", () => {

        });

        fetching.on("error", (err) => {

        });

        fetching.on("finish", () => {

        });

        fetching.on("information", (info) => {

        });
    
        fetching.on("pipe", (src) => {

        });

        fetching.on("response", (response) => {

        });

        fetching.on("socket", (socket) => {

        });

        fetching.on("timeout", () => {

        });

        fetching.on("unpipe", (src) => {

        });

        fetching.on("upgrade", (response, socket, head) => {

        });

        return requestHTTP;
    }

}