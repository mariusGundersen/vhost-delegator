var App = require('./App');

function AppRepo(ports){
  this.availablePorts = ports;
  this.apps = Object.create(null);
}

AppRepo.prototype.getApp = function(name){
  return this.apps[name]
};

AppRepo.prototype.hasApp = function(name){
  return name in this.apps;
};

AppRepo.prototype.isPortFree = function(port){
  return this.availablePorts.indexOf(port) >= 0;
};

AppRepo.prototype.addApp = function(name, address){
  
  if(this.hasApp(name)){
    throw new Error("App already exists! "+name);
  }
  
  if(this.availablePorts.length == 0){
    return null;
  }
  
  var port = this.availablePorts.shift();
  
  this.apps[name] = new App(name, address, port);
  return this.apps[name];
};

AppRepo.prototype.removeApp = function(name){
  var app = this.apps[name];
  delete this.apps[name];
  this.availablePorts.push(app.port);
};


module.exports = AppRepo;