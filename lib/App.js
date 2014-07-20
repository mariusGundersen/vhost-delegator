function App(name, hosts, address, port){
  this.name = name;
  this.hosts = hosts;
  this.address = address;
  this.port = port;
}

App.prototype.targetUrl = function(){
  return "http://" + this.address + ":" + this.port;
};

App.prototype.matchesHost = function(host){
  return this.hosts.filter(function(potentialHost){return potentialHost === host;}).length > 0;
};

module.exports = App;