function App(name, port){
  this.name = name;
  this.port = port;
}

App.prototype.targetUrl = function(){
  return "http://localhost:"+this.port
};

module.exports = App;