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
    portOrHostNameArg,
    proxyNameArg
] = process.argv;

// default value of proxyName and hostname
let proxyName = proxyNameArg;
let portOrHostName = portOrHostNameArg;

// check if the hostname or port is provided
if(!portOrHostName) {
    console.log("");
    console.log("The arguments", "<Port | Hostname>".cyan, "and", "<ProxyName>".cyan, "are required");
    console.log("Example:\n");
    console.log("tproxy".cyan, "8082", "backend_proxy\n");
    process.exit(-1);
}

// check if the proxyname is provided
if(!proxyName) {
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
        portOrHostName = url.origin;
    }
    catch(err) {
        console.log("The Port or hostname".red, portOrHostName.yellow, "is'nt valid".red);
        process.exit(-1);
    }
}
else {
    portOrHostName = "http://localhost:" + portOrHostName;
}


/***************************************
 * Start application
 ***************************************/

// create a instance of aplication
const tunnel = new TunnelProxy({
    backend_url: process.env.BACKEND_URL,
    hostproxy_url: "http://localhost:7000",
    proxy_name: proxyName
});

// Start application
tunnel.inicialize()
    .then(({ origin, destination }) => {
        console.log("=======================================================");
        console.log("               Application inicialized");
        console.log("=======================================================");
        console.log("");
        console.log(" origin url:".green);
        console.log("");
        console.log("  ", origin.cyan);
        console.log("");
        console.log(" proxyed public url:".green);
        console.log("");
        console.log("  ", destination.cyan);
        console.log("");
        console.log("=======================================================");
        console.log("");
    })
    .catch((err) => {
        console.error(err instanceof Error ? err.message : "Unknow Error");
    });