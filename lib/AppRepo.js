var App = require('./App');

function AppRepo(ports){
  this.availablePorts = ports;
  this.apps = [];
}

AppRepo.prototype.getApp = function(name){
  return this.apps.filter(function(app){return app.name === name;})[0];
};

AppRepo.prototype.getAppFromHost = function(host){
  return this.apps.filter(function(app){return app.matchesHost(host);})[0];
};

AppRepo.prototype.hasApp = function(name){
  return this.getApp(name) != null;
};

AppRepo.prototype.isPortFree = function(port){
  return this.availablePorts.indexOf(port) >= 0;
};

AppRepo.prototype.addApp = function(name, hosts, address){
  
  if(this.hasApp(name)){
    throw new Error("App already exists! "+name);
  }
  
  if(this.availablePorts.length == 0){
    return null;
  }
  
  var port = this.availablePorts.shift();
  
  var app = new App(name, hosts, address, port);
  this.apps.push(app);
  return app;
};

AppRepo.prototype.removeApp = function(name){
  var app = this.getApp(name);
  if(app == null) return;
  
  this.apps.splice(this.apps.indexOf(app), 1);
  
  this.availablePorts.push(app.port);
};


module.exports = AppRepo;