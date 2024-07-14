import { writeFileSync } from "fs";
import path from "path";
import dotenv from "dotenv";

// config environments
const configOutput = dotenv.config();

// check error
if(configOutput.error) {
    throw configOutput.error;
}

writeFileSync(path.join(__dirname, "../entry.js"), `
    const __dataInitial = ${JSON.stringify({...(configOutput.parsed || {}), NODE_ENV: "production"})};

    for(const key in __dataInitial) {
        process.env[key] = process.env[key] || __dataInitial[key];
    }

    // start ejecutable
    require("./index.js");
`);

console.log("Generated successfuly entry file");