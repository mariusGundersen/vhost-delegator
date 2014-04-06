var sub = require('../index');


var server = sub.startServer({
  controller: {
    port: 8281
  }
}).on('app-started', function(app){
  console.log("app started", app);
}).on('app-stopped', function(app){
  console.log('app stopped', app);
});