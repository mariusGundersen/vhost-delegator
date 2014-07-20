var EventEmitter = require('events').EventEmitter;
var http = require('http');

function startClient(name, hosts, options, server){
  options = cleanOptions(options);
  var connection;
  
  var eventEmitter = new EventEmitter();
  
  startApp(name, hosts, function(port){
    if(server && server.listen){
      server.listen(port);
    }
    eventEmitter.emit("started", port);
  });
  
  function startApp(name, hosts, done){
    var req = http.request({
      hostname: options.host,
      port: options.port,
      path: '/'+name,
      method: 'POST',
      auth: options.username + ":" + options.password
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
    
    req.on('close', function(){
      if(server && server.close){
        server.close();
      }
      eventEmitter.emit("stopped");
    });
    
    req.write(JSON.stringify({
      name: name,
      hosts: hosts
    }));
    connection = req;
  }
  
  eventEmitter.stop = function(){
    connection.end();
  };
  
  return eventEmitter;
}



function cleanOptions(options){
  var merge = require('node.extend');
  return merge(true, startClient.defaultOptions, options);
}

startClient.defaultOptions = {
  host: 'localhost',
  port: 8080,
  username: "admin",
  password: "admin"
};

module.exports = startClient;