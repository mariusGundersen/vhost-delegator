function startClient(name, options, server, onerror){
  var http = require('http');
  var connection;
  
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
      res.on('data', function(chunk){
        var json = chunk.toString();
        done(JSON.parse(json).port);
      });
    });
    req.on('error', onerror);
    req.write(name);
    connection = req;
    console.log("startApp");
  }

  function stopApp(name, done){
    connection.end();
  }
}

module.exports = startClient;