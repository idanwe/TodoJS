var Hapi = require('hapi'),
    Bcrypt = require('bcrypt'),
    Routes = require('./routes');

exports.createServer = function(settings) {
  var server = Hapi.createServer(2222);

  server.auth('session', {
    scheme: 'cookie',
    password: 'secret',
    cookie: 'signin',
    redirectTo: '/signin',
    isSecure: false
  });

  server.addRoutes(Routes.composeRoutes(settings));

  return server;
};
