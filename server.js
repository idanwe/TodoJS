var Hapi = require('hapi');
var Routes = require('./routes');

exports.createServer = function (settings) {
  var server = Hapi.createServer('localhost', 2222);

  server.addRoutes(Routes.composeRoutes(settings));

  return server;
};