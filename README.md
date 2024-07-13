# tunnel_proxy
Proxy service that allows establishing a connection to a server, to create a reverse proxy that allows creating a solution to establish hidden or private http connections on the public network.

# Environments

The current application requires that the environment variables be configured throught the **.env** file in the root of the project. It is necessary to configure it manually. This only applies to **.ts** (Development Mode) and **.js** (Production Mode) files, since when packaging the application in executables files (.exe, etc...) they will be inserted at the executable code level, so that the file be easily transportable, without having to depend on the **.env** file. The content of said **.env** file is similar to:

```py
# DEVELOPMENT MODE
NODE_ENV="development"

#PROXY CONNECTION
BACKEND_URL="https://localhost:7000"
```