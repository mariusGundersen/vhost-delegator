var sub = require('../index');
var http = require('http');

var server = http.createServer(function(req, res){
  res.end("hello");
});

sub.startClient('blabla.localhost', {port: 8281}, server, function(error){
  console.log("error", error);
  server.close();
});