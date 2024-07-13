import TunnelProxy from "./app/tunnel_proxy";
import dotenv from "dotenv";

/***************************************
 * Settings initial
 ***************************************/

// config environments
const configOutput = dotenv.config();

// check error
if(configOutput.error) {
    throw configOutput.error;
}

// check environment
if(!process.env.BACKEND_URL) {
    console.log("'BACKEND_URL' environment is'nt defined".red);
    process.exit(-1);
}

// Extract args
const [
    _executableArg,
    _fileEntryArg,
    portOrHostName,
    nameProxyArg
] = process.argv;

// default value of nameProxy
let nameProxy = nameProxyArg;

// check if the hostname or port is provided
if(!portOrHostName) {
    console.log("");
    console.log("The arguments", "<Port | Hostname>".cyan, "and", "<ProxyName>".cyan, "are required");
    console.log("Example:\n");
    console.log("tproxy".cyan, "8082", "backend_proxy\n");
    process.exit(-1);
}

// check if the proxyname is provided
if(!nameProxy) {
    console.log("");
    console.log("The arguments", "<ProxyName>".cyan, "are required");
    console.log("Example:\n");
    console.log("tproxy".cyan, "8082", "backend_proxy\n");
    process.exit(-1);
}

// RegExp Number
const regexpPORT = /^\d+$/;

// check is valid port or hostname
if(!regexpPORT.test(portOrHostName)) {
    try {
        const url = new URL(portOrHostName);

        // Get only origin fragment of URL
        nameProxy = url.origin;
    }
    catch(err) {
        console.log("The Port or hostname".red, portOrHostName.yellow, "is'nt valid".red);
        process.exit(-1);
    }
}


/***************************************
 * Start application
 ***************************************/

// create a instance of aplication
const tunnel = new TunnelProxy({
    backend_url: process.env.BACKEND_URL,
    hostproxy_url: "http://localhost:7000"
});

// Start application
tunnel.inicialize()
    .then(() => {
        console.log("Application inicialized");
    })
    .catch((err) => {
        console.error(err instanceof Error ? err.message : "Unknow Error");
    });