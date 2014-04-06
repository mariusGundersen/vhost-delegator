var EventEmitter = require('events').EventEmitter;
var http = require('http');
var httpProxy = require('http-proxy');
var AppRepo = require('./AppRepo');

function startServer(options){
  options = cleanOptions(options);
  
  var eventEmitter = new EventEmitter();
  
  var appRepo = new AppRepo(options.controller.appPorts);
  
  startController(eventEmitter, appRepo, options.controller);
 
  startDelegator(eventEmitter, appRepo, options.delegator);
  
  return eventEmitter;
}

function startDelegator(eventEmitter, appRepo, options){
  
  var proxy = httpProxy.createProxyServer({});
  
  http.createServer(function(req, res){
    var app = appRepo.getApp(findTargetVhost(req));
    if(app){
      var targetUrl = app.targetUrl();
      proxy.web(req, res, { target: targetUrl });
    }else{
      res.writeHead(404);
      res.end();
    }
  }).listen(options.port);
  
}

function startController(eventEmitter, appRepo, options){
  var delegator = http.createServer(function(req, res){
    
    var app;
    
    req.on('data', function(data){
      var name = data.toString();
      
      if(appRepo.hasApp(name)){
        res.writeHead(409);
        res.end();
        eventEmitter.emit("error", {code: "NAME_CONFLICT", message: "an app with that name already exists: " + name });
      }else{
        app = appRepo.addApp(name, req.connection.remoteAddress);
        
        if(app == null){
          eventEmitter.emit("error", {code: "PORTS_EXHAUSTED", message: "too many apps connected, no more ports to use" });
          res.writeHead(503);
          res.end();
        }
        
        eventEmitter.emit("app-started", app);
        res.write(JSON.stringify(app));
      }
    });
    
    req.on('close', function(){
      if(app){
        appRepo.removeApp(app.name);
        eventEmitter.emit("app-stopped", app);
        res.end();
      }
    });
    
  });

  delegator.timeout = 0;
  delegator.listen(options.port); 
  
}

function findTargetVhost(req){
  return req.headers.host.split(':')[0];
}

function cleanOptions(options){
  var merge = require('node.extend');
  return merge(true, startServer.defaultOptions, options);
}

startServer.defaultOptions = {
  controller: {
    port: 8080,
    username: "admin",
    passowrd: "admin",
    appPorts: [5060, 5061]
  },
  delegator: {
    port: 80
  }
}

module.exports = startServer;