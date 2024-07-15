# tunnel_proxy_http
Proxy service that allows establishing a connection to a server, to create a reverse proxy that allows creating a solution to establish hidden or private http connections on the public network.

## Install dependencies
Before running the project itself, first of all it is necessary to install the dependencies for its correct functioning.

>     npm install

## Configuring environments
Before executing, a crucial step is also necessary which is to configure the environments.

The current application requires that the environment variables be configured throught the **.env** file in the root of the project. It is necessary to configure it manually. This only applies to **.ts** (Development Mode) and **.js** (Production Mode) files, since when packaging the application in executables files (.exe, etc...) they will be inserted at the executable code level, so that the file be easily transportable, without having to depend on the **.env** file. The content of said **.env** file is similar to:

```py
# DEVELOPMENT MODE
NODE_ENV="development"

#PROXY CONNECTION
BACKEND_URL="https://localhost:7000"
```

Another thing to keep in mind is that this project depends on its api, which will redirect the connections to the current client (tunnel). The project can be found at:

[https://github.com/stexcore/api_reverse_proxy](https://github.com/stexcore/api_reverse_proxy)

After you have hosted your project on a domain (you can also run it on a local machine for testing), you mush place the hosted url of the API in the **BACKEND_URL** environment variable in the **.env** file.

## Run project
To run the application in development mode, it is as simple as running a command line.

>     npm run dev

Additionally, it is necessary to specify two arguments that allow you to specify the local port or the hostname of a site that should relay the HTTP request. Examples:

>     npm run dev 8082 page

>     npm run dev https://www.google.com google

>     npm run dev http://localhost:2000 api-server

## Build Project and Compile
To generate the minified project assets, run the command:

>     npm run build

After that, two interesting things happen that I would like to mention. After generating the javascript in the file **/dist** folder, some practical and protables executables are generated in the **/exec** folder, which you can use depending on the operating system of your preference. Since generate executables for Windows, Linux and Macos.

To run the generated executables files, you will need to open your preferred command line, locate the executable files and run them, adding the two arguments **necessary** to run them.

The common steps to follow would be to execute the following commands:

>     npm run build
>     cd exec

**Examples For windows:**

>     ./tunnel_proxy_http-win.exe 8082 page

>     ./tunnel_proxy_http-win.exe https://www.google.com google

>     ./tunnel_proxy_http-win.exe http://localhost:2000 api-server

**Examples For linux:**

>     ./tunnel_proxy_http-linux.exe 8082 page

>     ./tunnel_proxy_http-linux.exe https://www.google.com google

>     ./tunnel_proxy_http-linux.exe http://localhost:2000 api-server

**Examples For MacOS:**

>     ./tunnel_proxy_http-macos.exe 8082 page

>     ./tunnel_proxy_http-macos.exe https://www.google.com google

>     ./tunnel_proxy_http-macos.exe http://localhost:2000 api-server

## Behavior during execution:
Well once it starts, and there are no problems connections to the server should display a message similar to this:

```
=======================================================
               Application inicialized
=======================================================

 origin url:

   http://localhost:7000/

 proxyed public url:

   http://localhost:7000/proxy/page

=======================================================
```

!!Congratulations!! you have created a reverse proxy connection. As you make HTTP request, 
they will be displayed in the console, with their respective statusCode and accessed route.

Althrough HTTP transmissions are performed without problems, you may notice that it is not convenient to use in most cases. since the url being **http://domain/proxy/nameProxy** does not behave as really the root of the domain, causing serious problems with the requester, it can mainly affect making a request for ad HTML file.

Althrought to make API requests (JSON, XML, etc...) there is usually no such problem, since they do not usually make additional requests, as an HTML file would do, for example.

Another problem, which exists in the project, in that only HTTP requests are allowed. That is to say that any other connection protocol (for example websocket, sdfp, etc...), although in theory, are similar, the logic has not currently been implemented.

However, to solve these inconveniences, it has been decided to redo the project, implementing the connection vía TCP, this will help correct these problems, in addition to allowing all types of connections that can be handled via TCP. You can go visit them and stay up to date with the progress of the projects:

**Server proxy reversed (TCP)**
[https://github.com/stexcore/tcp_reverse_proxy](https://github.com/stexcore/tcp_reverse_proxy)

**TCP Client**
[https://github.com/stexcore/tcp_client](https://github.com/stexcore/tcp_client)

⚙️ Made with effort and dedication, **team stexcore** ❤️
