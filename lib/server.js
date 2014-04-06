function startServer(options){
  options = options || {};
  
  var http = require('http');
  var httpProxy = require('http-proxy');

  var router = require('urlrouter');
  var appRepo = require('./appRepo');
  
  http.createServer(router(function(server){
    server.post('/:name', function(req, res){
      var app = appRepo.addApp(req.params.name);
      console.log("app started", app.name, app.port);
      res.end(JSON.stringify(app));
    });
    
    server.delete('/:name', function(req, res){
      appRepo.removeApp(req.params.name);
      console.log("app stopped", req.params.name);
      res.end();
    });
  })).listen(options.port || 8080);
  
  
  var proxy = httpProxy.createProxyServer({});
  
  http.createServer(function(req, res){
    delegate(req, res);
  }).listen(options.target || 80);
  
  function delegate(req, res){
    var app = appRepo.getApp(findTargetVhost(req));
    if(app){
      var targetUrl = app.targetUrl();
      proxy.web(req, res, { target: targetUrl });
    }else{
      res.writeHead(404);
      res.end();
    }
  }

  function findTargetVhost(req){
    console.log("vhost", req.headers.host);
    return req.headers.host.split(':')[0];
  }
}

module.exports = startServer;