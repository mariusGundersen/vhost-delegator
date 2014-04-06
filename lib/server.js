function startServer(options){
  options = cleanOptions(options);
  
  var http = require('http');
  var httpProxy = require('http-proxy');

  var appRepo = require('./appRepo');
  
  startController(http, appRepo, options.controller);
 
  startDelegator(http, httpProxy, appRepo, options.delegator);
  
  
}

function startDelegator(http, httpProxy, appRepo, options){
  
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

function startController(http, appRepo, options){
  var delegator = http.createServer(function(req, res){
    
    var app;
    
    req.on('data', function(data){
      app = appRepo.addApp(data.toString());
      console.log("app started", app.name, app.port);
      res.write(JSON.stringify(app));
    });
    
    req.on('close', function(){
      if(app){
        appRepo.removeApp(app.name);
        console.log("app stopped", app.name);
        res.end();
      }
    });
    
  });

  delegator.timeout = 0;
  delegator.listen(options.port); 
  
}

function findTargetVhost(req){
  console.log("vhost", req.headers.host);
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
    clientPortRange: [5060, 5061]
  },
  delegator: {
    port: 80
  }
}

module.exports = startServer;