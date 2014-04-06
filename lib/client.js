var EventEmitter = require('events').EventEmitter;
var http = require('http');

function startClient(name, options, server, onerror){
  var connection;
  
  var eventEmitter = new EventEmitter();
  
  startApp(name, function(port){
    console.log("app started", name, port);
    if(server && server.listen){
      server.listen(port);
    }
    eventEmitter.emit("started", port);
  });
  
  server.on('close', function(){
    stopApp(name, function(err, success){
      eventEmitter.emit("stopped");
    });
  });
  

  function startApp(name, done){
    var req = http.request({
      hostname: 'localhost',
      port: options.port || '8080',
      path: '/'+name,
      method: 'POST'  
    }, function(res){
      
      if(res.statusCode != 200){
        eventEmitter.emit('error', {code: 'START_REJECTED', message: 'server responded with ' + res.statusCode });
        connection.end();
        return
      }
      
      res.on('data', function(chunk){
        var json = chunk.toString();
        done(JSON.parse(json).port);
      });
    });
    req.on('error', function(error){
      eventEmitter.emit('error', error);
    });
    req.write(name);
    connection = req;
    console.log("startApp");
  }

  function stopApp(name, done){
    connection.end();
  }
  
  return eventEmitter;
}

module.exports = startClient;