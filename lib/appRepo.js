var App = require('./App');

var nextPort = 5160;
var recycledPorts = [];

var apps = Object.create(null);


function getApp(name){
  return apps[name]
}


function addApp(name){
  if(name in apps){
    return apps[name];
  }
  
  port = nextPort++;
  apps[name] = new App(name, port);
  
  return apps[name];
}

function removeApp(name){
  delete apps[name];
}


module.exports = {
  addApp: addApp,
  removeApp: removeApp,
  getApp: getApp
};