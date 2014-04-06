function App(name, address, port){
  this.name = name;
  this.address = address;
  this.port = port;
}

App.prototype.targetUrl = function(){
  return "http://" + this.address + ":" + this.port;
};

module.exports = App;