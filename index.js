var startClient = require('./lib/client');
var startServer = require('./lib/server');

function range(from, to){
  var ret = [];
  
  if(to<from) throw new Error("Second parameter must be larger than first parameter");
  
  for(var i=from; i<=to; i++){
    ret.push(i);
  }
  return ret;
}

module.exports = {
  startServer: startServer,
  startClient: startClient,
  range: range
};