function App(name, hosts, address, port){
  this.name = name;
  this.hosts = hosts.map(function(hostname){return new RegExp('^' + hostname.replace(/[^*\w]/g, '\\$&').replace(/[*]/g, '(?:.*?)')  + '$', 'i');});
  this.address = address;
  this.port = port;
}

App.prototype.targetUrl = function(){
  return "http://" + this.address + ":" + this.port;
};

App.prototype.matchesHost = function(host){
  return this.hosts.some(function(regexp){return regexp.test(host);});
};

module.exports = App;