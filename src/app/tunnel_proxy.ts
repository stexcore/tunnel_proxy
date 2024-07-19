import { ErrorNotAvariableProxyName, ErrorUnknow } from "../classes/errors.class";
import { IConfigTunnelProxy, IRequestHTTP } from "../models/tunnel_proxy.model";
import { io, Socket } from "socket.io-client";
import { IRequest } from "../models/requests.model";
import errorsContants from "../constants/errors.contants";
import http, { IncomingMessage } from "http";
import https from "https";
import "colors";

/**
 * Tunnel proxy
 */
export default class TunnelProxy {

    /**
     * Hostname url of ApiServer **api_reverse_proxy**
     */
    private readonly backend_hostname: string;

    /**
     * Port hostname of Apiserver **api_reverse_proxy**
     */
    private readonly backend_port: number;

    /**
     * Secure protocol of apiserver **api_serverse_proxy**
     * example: https, wss, etc... (secure), http, ws, etc... (insecure)
     */
    private readonly backend_secure_protocol: boolean;

    /**
     * Url host proxy
     */
    private readonly hostproxy_url: string;

    /**
     * Proxy name
     */
    private readonly proxy_name: string;

    /**
     * Show logs
     */
    private readonly show_logs: boolean;

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
        this.backend_hostname = config.backend_hostname;
        this.backend_port = config.backend_port;
        this.backend_secure_protocol = config.backend_secure_protocol;
        this.hostproxy_url = config.hostproxy_url;
        this.proxy_name = config.proxy_name;
        this.show_logs = config.show_logs ?? true;
        this.socket = null;
    }

    /**
     * Start device
     */
    public inicialize(): Promise<{ origin: string, destination: string }> {
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

                const urlBackend = (
                    // protocol
                    (this.backend_secure_protocol ? "https" : "http") + "://" +
                    // subdomain
                    encodeURIComponent(this.proxy_name) + "-proxy." +
                    // hostname
                    this.backend_hostname + 
                    // port
                    (this.backend_port == 8082 ? "" : (":" + this.backend_port))
                );
                
                // create socket connection
                this.socket = io(urlBackend, {
                    reconnection: true
                });

                // Disconnect connection Event 
                this.socket.on("disconnect", (reason) => {
                    if(this.socket) {
                        this.log("Lost connection, trying to restore it".red);

                        const request = [...this.requests];

                        request.forEach((requestItem) => {
                            requestItem.abort(new Error("Lost connection tunnel"));
                        });
                    }
                });

                // Error to connect Event
                this.socket.on("connect_error", (err: Error & { data?: any }) => {

                    if(!connectedSomeTime) {
                        // close to prevent attemps to reconnect
                        this.socket?.disconnect();

                        // check the type of error ad generate class error element
                        switch(err.data) {

                            case errorsContants.NO_AVARIABLE_PROXYNAME:
                                err = new ErrorNotAvariableProxyName(err.message);
                                break;

                            case errorsContants.UNKNOWN_ERROR:
                                err = new ErrorUnknow(err.message);
                                break;

                            default:
                                // none actions
                                err = new Error("The server refused the connection".red);
                        } 

                        // reject promise and exit
                        return reject(err);
                    }

                    this.log("Connect Error... retrying...".yellow);
                });

                // Connect Event
                this.socket.on("connect", () => {
                    if(!connectedSomeTime) {
                        const origin = new URL(this.hostproxy_url);
                        const destination = new URL(urlBackend);

                        connectedSomeTime = true;

                        return resolve({
                            origin: origin.href,
                            destination: destination.href
                        });
                    }

                    this.log("The connection to the server has been recovered".green);
                });

                const abortRequest = (id_request: number) => {
                    if(this.socket) {
                        this.socket.emit("http_abort", id_request, "Does not exist the request '" + id_request + "'");
                    }
                }

                // request HTTP
                this.socket.on("http_request", (id_request: number, request: IRequest) => {

                    request.headers = new Headers(request.headers);

                    request.headers.delete('purpose');
                    request.headers.delete('sec-ch-ua');
                    request.headers.delete('sec-ch-ua-mobile');
                    request.headers.delete('sec-ch-ua-platform');
                    request.headers.delete('sec-fetch-dest');
                    request.headers.delete('sec-fetch-mode');
                    request.headers.delete('sec-fetch-site');
                    request.headers.delete('sec-fetch-user');
                    request.headers.delete('sec-purpose');
                    request.headers.delete('upgrade-insecure-requests');

                    let statusCodeRequest: number | undefined;

                    // check if error of server
                    if(this.requests.some(requestHTTPItem => requestHTTPItem.id_request === id_request)) {
                        return console.warn(
                            "WARNING: The server issued an HTTP request with an identifier similar".yellow,
                            "to another HTTP request in progress".yellow
                        );
                    }

                    // create request HTTP
                    const requestHTTP = this.CreateRequestHTTP(id_request, request);

                    requestHTTP.on("http_init", () => {
                        this.emitEvent("http_init", id_request);
                    });

                    requestHTTP.on("http_finish", () => {
                        this.emitEvent("http_finish", id_request);
                    });

                    requestHTTP.on("http_upgrade", () => {
                        this.emitEvent("http_upgrade", id_request);
                    });

                    requestHTTP.on("http_response", (headers: Headers, statusCode: number) => {

                        console.log("statusCode:", typeof statusCode, statusCode);
                        
                        if(statusCode >= 300 && statusCode < 400) {
                            const urlRedirect = headers.get("Location");
                            
                            if(urlRedirect) {
                                try {
                                    const url = new URL(urlRedirect);
                                    const urlRequested = new URL(this.hostproxy_url);

                                    if(url.origin === urlRequested.origin) {
                                        console.log("NEW URL:",
                                            new URL(
                                                url.pathname + url.search,
                                                urlBackend
                                            ).href
                                        );

                                        headers.set(
                                            "Location",
                                            new URL(
                                                url.pathname + url.search,
                                                urlBackend
                                            ).href
                                        );
                                    }
                                }
                                catch(err) {
                                    console.log(err);
                                }
                            }
                        }

                        const headersData: {[key: string]: string} = {};

                        headers.forEach((value, keyname) => {
                            headersData[keyname] = value;
                        });
                        statusCodeRequest = statusCode;
                        
                        this.emitEvent("http_response", id_request, headersData, statusCode);
                    });

                    requestHTTP.on("http_data", (chunk) => {
                        this.emitEvent("http_data", id_request, chunk);
                    });

                    requestHTTP.on("http_end", () => {
                        this.emitEvent("http_end", id_request);
                    });

                    requestHTTP.on("http_close", () => {
                        this.emitEvent("http_close", id_request);

                        const dateTime = new Date();
                        let colorStatus: "cyan" | "green" | "yellow" | "red" | "gray" | "blue" | "magenta";
                        let colorMethod: typeof colorStatus;

                        const colorsMethod: {[key: string]: typeof colorStatus} = {
                            GET: "green",
                            POST: "yellow",
                            PUT: "blue",
                            PATCH: "magenta",
                            DELETE: "red",
                            HEAD: "green",
                            OPTIONS: "magenta",
                        } as const

                        colorStatus = "gray";
                        if(statusCodeRequest) {
                            if(statusCodeRequest >= 100 && statusCodeRequest < 200)
                                colorStatus = "cyan";
                            if(statusCodeRequest >= 200 && statusCodeRequest < 300)
                                colorStatus = "green";
                            if(statusCodeRequest >= 300 && statusCodeRequest < 400)
                                colorStatus = "yellow";
                            if(statusCodeRequest >= 400 && statusCodeRequest < 600)
                                colorStatus = "red";
                        }

                        colorMethod = colorsMethod[request.method.toUpperCase()] || "gray" as const
                        
                        this.log(
                            // time request
                            (
                                (dateTime.getHours()+1).toString().padStart(2, "0") + ":" +
                                (dateTime.getMinutes()).toString().padStart(2, "0") + ":" +
                                (dateTime.getSeconds()).toString().padStart(2, "0")
                            ).gray,
                            // method request
                            (
                                "[" + request.method.toUpperCase().trim() + "]"
                            )[colorMethod],
                            // status code
                            (
                                statusCodeRequest?.toString() || "---"
                            ).padStart(3, " ")[colorStatus],
                            // path request
                            (
                                request.path.cyan
                            )
                        )
                    });

                    requestHTTP.on("http_error", (err) => {
                        this.emitEvent("http_error", id_request, err?.message || "Unknow Error");
                    });
                });

                // data of request HTTP
                this.socket.on("http_data", (id_request: number, chunk: Uint8Array) => {
                    const request = this.GetRequestHTTP(id_request);

                    if(request) {
                        request.write(chunk);
                    }
                    else abortRequest(id_request);
                });

                // end write data of request HTTP
                this.socket.on("http_end", (id_request: number) => {
                    const request = this.GetRequestHTTP(id_request);

                    if(request) {
                        request.end();
                    }
                    else abortRequest(id_request);
                });

                // abort request HTTP
                this.socket.on("http_abort", (id_request: number, errorMsg: string) => {
                    const request = this.GetRequestHTTP(id_request);

                    if(request) {
                        request.abort(new Error(errorMsg));
                    }
                    else abortRequest(id_request);
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
        if(this.socket) {
            try {
                const socket = this.socket;
                this.socket = null;
                socket.disconnect();
            }
            catch(err) {
                console.error(err);
            }
        }
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

            emit(eventType: string, ...args: any[]): void {
                listenner.forEach(listennerItem => {
                    try {
                        if(listennerItem.eventType === eventType) {
                            listennerItem.callback(...args);
                        }
                    }
                    catch(err) {
                        console.error(err);
                    }
                });
            },

            // end and emit request
            end(): void {
                fetching.end();
            },

            // abort request
            abort(err?: Error): void {
                controller.abort(err);
            }
        };

        // Append listen to close socket tcp
        requestHTTP.on("http_close", () => {
            // remove of memory
            this.requests = this.requests.filter(requestItem => requestItem.id_request !== id_request);
        });

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
        let incomming: IncomingMessage | undefined;

        fetching.on("socket", (socket) => {
            // this.log("Event emmited:", "socket");
            requestHTTP.emit("http_init");
        });

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
            // this.log("Event emmited:", "upgrade");
            requestHTTP.emit("http_upgrade");
        });

        fetching.on("close", () => {
            if(!incomming) {
                // this.log("Event emmited:", "close");
                requestHTTP.emit("http_close");
            }
        });

        fetching.on("error", (err) => {
            // this.log("Event emmited:", "error");
            requestHTTP.emit("http_error", err);
        });

        fetching.on("finish", () => {
            // this.log("Event emmited:", "finish");
            requestHTTP.emit("http_finish");
        });

        fetching.on("response", (response) => {
            const headers = new Headers(response.headers as {[key: string]: string});
            incomming = response;

            requestHTTP.emit("http_response", headers, response.statusCode!);
            // this.log("Event emmited:", "response");

            response.on("error", (err) => {
                // this.log("response event: error")
                requestHTTP.emit("http_error", err);
            });

            response.on("end", () => {
                // this.log("response event: end");
                requestHTTP.emit("http_end");
            });

            response.on("data", (chunk) => {
                // this.log("response event: data")
                requestHTTP.emit("http_data", chunk);
            });

            response.on("close", () => {
                // this.log("response event: close")
                requestHTTP.emit("http_close");
            });
        });

        return requestHTTP;
    }

    public GetRequestHTTP(id_request: number): IRequestHTTP | null {
        const request = this.requests.find(requestItem => requestItem.id_request === id_request);
        return request ?? null;
    }

    /**
     * Emit event socket to server
     * @param eventType Type event
     * @param args Arguments
     */
    private emitEvent(eventType: string, ...args: any[]) {
        if(this.socket) {
            this.socket.emit(eventType, ...args);
        }
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