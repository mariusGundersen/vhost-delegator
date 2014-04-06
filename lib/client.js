var EventEmitter = require('events').EventEmitter;
var http = require('http');

function startClient(name, options, server){
  var connection;
  
  var eventEmitter = new EventEmitter();
  
  startApp(name, function(port){
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
        req.end();//for some strange reason the client does not stop when this happens...
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
  }

  function stopApp(name, done){
    connection.end();
  }
  
  return eventEmitter;
}

module.exports = startClient;