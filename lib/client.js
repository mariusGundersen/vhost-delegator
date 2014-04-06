function startClient(name, options, server, onerror){
  var http = require('http');
  
  startApp(name, function(port){
    console.log("app started", name, port);
    server.listen(port);
  });
  
  server.on('close', function(){
    stopApp(name, function(err, success){
      
    });
  });
  

  function startApp(name, done){
    var req = http.request({
      hostname: 'localhost',
      port: options.port || '8080',
      path: '/'+name,
      method: 'POST'  
    }, function(res){
      var json = "";
      res.on('data', function(chunk){
        json += chunk.toString();
        console.log('data', json);
      });
      res.on('end', function(){
        done(JSON.parse(json).port);
      });
    });
    req.on('error', onerror);
    req.end();
    console.log("startApp");
  }

  function stopApp(name, done){
    var req = http.request({
      hostname: 'localhost',
      port: options.port || '8080',
      path: '/'+name,
      method: 'DELETE'  
    }, function(res){
      res.on('end', function(res){
        done(null, true);
      });
    });
    req.on('error', onerror);
    req.end();
  }
}

module.exports = startClient;