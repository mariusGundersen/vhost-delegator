var sub = require('../index');
var http = require('http');

var server = http.createServer(function(req, res){
  res.end("hello");
});

sub.startClient('blabla.localhost', {port: 8181}, server, function(){
  console.log("error", arguments);
});