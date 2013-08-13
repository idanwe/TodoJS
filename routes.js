var Hapi = require('hapi'),
    EndPoints = require('./endpoints');

exports.generateRoutes = function (settings) {
  EndPoints.options = settings
  var methods = [
    {
      method: 'POST',
      path: '/signup',
      config: EndPoints.postSignup
    },
    {
      method: 'GET',
      path: '/signin',
      config: EndPoints.getSignin
    },
    {
      method: 'GET',
      path: '/logout',
      config: EndPoints.getLogout
    },
    {
      method: 'GET',
      path: '/users',
      config: EndPoints.getUsers
    },
    {
      method: 'GET',
      path: '/tasks',
      config: EndPoints.getTasks
    },
    {
      method: 'POST',
      path: '/tasks',
      config: EndPoints.postTasks
    },
    {
      method: 'PATCH',
      path: '/tasks/{task_id}',
      config: EndPoints.patchTask
    },
    {
      method: 'DELETE',
      path: '/tasks/{task_id}',
      config: EndPoints.deleteTask
    },
    {
      method: 'GET',
      path: '/{path*}',
      handler: {
        directory: { path: './app', listing: false, index: true }
      }
    }
  ];

  return methods;
}
