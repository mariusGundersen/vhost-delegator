# vhost-delegator

vhost-delegator is a proxy server which routes requests to other nodejS applications based on domain name.

## Installation

```
npm install vhost-delegator
```

##Server

The vhost-delegator runs as an http server, by default on port 80, which proxies the connections to other nodeJS applications, on the same server, but with different port numbers. 
The server can be started like this:

```
var delegator = require('vhost-delegator');

delegator.startServer({});
```

### Options

The options object passed to the `startServer` method looks like this:

```
{
  //these are the options for the controller, which the clients communicate with
  controller: {
    //port the controller runs on. The clients must be given the same port when they start
    port: 8080,
    //username and password which clients must use to be authorized as apps. 
    username: "admin",
    passowrd: "admin",
    //range of ports which the clients can run on. The maxmum numbr of simultanious clients is determined by the size of this list
    appPorts: [5060, 5061]
  },
  //these are the options for the proxy server
  delegator: {
    //outward port the server runs on
    port: 80
  }
}
```

### Events

Once a delegator server has been started, it emits events about what happens. The following events are emitted

 - **app-started:** Emitted when a client connects. The parameter is the app object, containing the name, port and address to the client app.
 - **app-stopped:** Emitted when a client disconnects. The parameter is app object, containing the name, port and address to the client.
 - **error:** Emitted when an error occures. The parameter is an object with a code, describing the error, and a message with details about the error. The following errors can occure:
   - **NAME_CONFLICT:** A client has attempted to connect as an app that already exists
   - **PORTS_EXHAUSTED:** There are no more ports for clients to use
 
##Client
 
Clients connect to the server, gives the vhost name they want to run as, and in return are given a port number to run under. Only when they are given the port number should they start the 
http server:
 
```
var delegator = require('delegator');
var server = require('http');

var server = http.createServer(function(req, res){
  res.end("hello");
});
 
delegator.startClient("mysite.localhost", {}, server);
 
```

The options object passed to the `startClient` method consists of the following properties, all optional

 - **Port:** The port which the server runs on