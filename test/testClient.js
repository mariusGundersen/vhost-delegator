var sub = require('../index');
var http = require('http');

var server = http.createServer(function(req, res){
  res.end("hello");
});

sub.startClient('blabla.localhost', {port: 8281}, server)
.on('started', function(port){
  console.log("app started", port);
}).on('stopped', function(){
  console.log('app stopped');
}).on('error', function(error){
  console.error(error);
});