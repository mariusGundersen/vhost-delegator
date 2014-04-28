var sub = require('../index');


var server = sub.startServer({
  controller: {
    port: 8281,
    appPorts: sub.range(5060, 5070)
  }
}).on('app-started', function(app){
  console.log("app started", app);
}).on('app-stopped', function(app){
  console.log('app stopped', app);
}).on('error', function(error){
  console.error(error);
});