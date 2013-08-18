var Hapi = require('hapi'),
    Bcrypt = require('bcrypt'),
    Routes = require('./routes'),
    port = process.env.PORT || 2222;

exports.createServer = function(settings) {
  conosle.log('server running on port: ', port);
  var server = Hapi.createServer(port);

  server.auth('session', {
    scheme: 'cookie',
    password: 'secret',
    cookie: 'signin',
    redirectTo: '/signin',
    isSecure: false
  });

  server.addRoutes(Routes.generateRoutes(settings));

  return server;
};
