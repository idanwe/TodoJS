var Hapi = require('hapi'),
    db;

exports.composeRoutes = function (settings) {
  db = settings.db;
  var methods = [
    {
      method: 'POST',
      path: '/signup',
      config: {
        handler: function(request) {
          var user = request.payload;
          console.log('user: ', user);
          db.collection('users', function(err, collection) {
            collection.insert(user, { safe: true }, function(err, result) {
              if (err) {
                console.log('error at insert user to collection');
                console.log(err);
                request.reply('failed to add user');
              } else {
                request.reply('user added');
              }
            });
          })
        },
        payload: 'parse',
        validate: {
          payload: {
            name: Hapi.types.String().required(),
            password: Hapi.types.String().required().min(8).description('8 characters or longer')
          }
        }
      }
    },
    {
      method: 'GET',
      path: '/users',
      config: {
        handler: getUsers
      }
    },
    {
      method: 'GET',
      path: '/tasks',
      config: {
        handler: getTasks
      }
    },
    {
      method: 'POST',
      path: '/tasks',
      config: {
        handler: addTask,
        payload: 'parse',
        validate: {
          payload: {
            title: Hapi.types.String().required().max(100),
            content: Hapi.types.String().max(500)
          }
        }
      }
    },
    {
      method: 'GET',
      path: '/{path*}',
      handler: {
        directory: { path: './app', listing: false, index: true }
      }
    }
  ];
  return(methods);
}

function addUser (request) {
  var user = request.payload;

  db.collection('users', function(err, collection) {
    collection.insert(user, { safe: true }, function(err, result) {
      if (err) {
        console.log('error at insert user to collection');
        console.log(err);
        request.reply('failed to add user');
      } else {
        request.reply('user added');
      }
    });
  });
}

function getUsers (request) {
  db.collection('users').find().toArray(function (err, users) {
    console.log(users);
    request.reply(users);
  });
}

function getTasks (request) {
  request.reply('tasks');
}

function addTask (request) {
  request.reply('task added');
}
