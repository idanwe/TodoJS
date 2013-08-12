var Hapi = require('hapi'),
    Bcrypt = require('bcrypt'),
    ObjectID = require('mongodb').ObjectID,
    _ = require('underscore'),
    db,
    dupKeyError = 11000,
    bcryptRounds = 12;

exports.composeRoutes = function (settings) {
  db = settings.db;
  var methods = [
    {
      method: 'POST',
      path: '/signup',
      config: {
        handler: addUser,
        payload: 'parse',
        validate: {
          payload: {
            username: Hapi.types.String().required().rename('_id', { deleteOrig: true }),
            email: Hapi.types.String().email().required(),
            password: Hapi.types.String().required().min(8).description('8 characters or longer')
          }
        }
      }
    },
    {
      method: 'GET',
      path: '/signin',
      config: {
        handler: signin,
        auth: { mode: 'try' }
      }
    },
    {
      method: 'GET',
      path: '/logout',
      config: {
        handler: logout,
        auth: true
      }
    },
    {
      method: 'GET',
      path: '/tasks',
      config: {
        handler: getTasks,
        auth: true
      }
    },
    {
      method: 'POST',
      path: '/tasks',
      config: {
        handler: addTask,
        auth: true,
        payload: 'parse',
        validate: {
          payload: {
            text: Hapi.types.String().required().max(100),
            done: Hapi.types.Boolean().required()
          }
        }
      }
    },
    {
      method: 'PATCH',
      path: '/tasks/{task_id}',
      config: {
        handler: updateTask,
        auth: true,
        payload: 'parse',
        validate: {
          payload: {
            text: Hapi.types.String().max(100).optional(),
            done: Hapi.types.Boolean().optional()
          }
        }
      }
    },
    {
      method: 'DELETE',
      path: '/tasks/{task_id}',
      config: {
        handler: deleteTask,
        auth: true,
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
      path: '/{path*}',
      handler: {
        directory: { path: './app', listing: false, index: true }
      }
    }
  ];

  function addUser(request) {
    var newUser = request.payload;
    newUser.tasks = [];
    Bcrypt.hash(newUser.password, bcryptRounds, function(err, hashedPassword) {
      newUser.password = hashedPassword;
      db.collection('users', function(err, collection) {
        collection.insert(newUser, { safe: true }, function(err, result) {
          if (err) {
            if (err.code === dupKeyError) {
              request.reply(Hapi.error.passThrough(409, '{"reason":"user already exist"}', 'application/json'));
              return;
            };
            console.log('error at insert user to collection');
            console.log(err);
            request.reply('failed to add user');
          } else {
            request.reply('ok');
          };
        });
      });
    });
  }

  function signin(request) {
    if (request.auth.isAuthenticated) {
      return request.reply('ok');
    }
    console.log('------------------------------------------------');
    console.log('request: ', request);
    console.log('------------------------------------------------');

    var username = request.query.username,
        password = request.query.password;

    console.log('signin username: ', username);
    db.collection('users', function(err, collection) {
      collection.findOne({ _id: username }, { password: 1 }, function(err, user) {
        console.log('user ', user);
        if (!user) {
          return request.reply(Hapi.error.badRequest('Invalid username or password'));
        }
        Bcrypt.compare(password, user.password, function(err, isValid) {
          console.log('err ', err);
          if (err) {
            return request.reply(Hapi.error.badRequest('Invalid username or password'));
          }
          request.auth.session.set(user);
          return request.reply('ok');
        });
      });
    });
  }

  function logout(request) {
    request.auth.session.clear();
    return request.reply('ok');
  }

  function getTasks(request) {
    var userCred = request.auth.credentials;
    db.collection('users', function(err, collection) {
      collection.findOne({ _id: userCred._id }, function(err, user) {
        request.reply(user.tasks);
      });
    });
  }

  function addTask(request) {
    var userCred = request.auth.credentials;
    db.collection('users', function(err, collection) {
      var task = request.payload;
      task.task_id = new ObjectID();
      collection.update(
        { _id: userCred._id },
        {
          $push: { tasks: task }
        },
        function(err, user) {
          if (err) {
            return request.reply(Hapi.error.internal())
          }
          return request.reply(task);
        }
      );
    });
  }

  function updateTask(request) {
    var userCred = request.auth.credentials,
        task_id = request.params.task_id;

    db.collection('users', function(err, collection) {
      collection.findOne({ _id: userCred._id }, function(err, user) {
        var task = _.find(user.tasks, function(task) { return task.task_id == task_id; });
        var updatedData = request.query
        for (prop in updatedData) {
          task[prop] = JSON.parse(updatedData[prop]);
        }

        collection.update({ _id: userCred._id}, user, function(err, data) {
          if (err) {
            return request.reply(Hapi.error.internal());
          }
          return request.reply('ok');
        });
      });
    });
  }

  function deleteTask(request) {
    var userCred = request.auth.credentials,
        task_id = request.params.task_id;

    db.collection('users', function(err, collection) {
      collection.findOne({ _id: userCred._id }, function(err, user) {
        var tasks = user.tasks
        var task = _.find(tasks, function(task) { return task.task_id == task_id; });
        var index = tasks.indexOf(task);
        tasks.splice(index, 1);

        collection.update({ _id: userCred._id}, user, function(err, data) {
          if (err) {
            return request.reply(Hapi.error.internal());
          }
          return request.reply('ok');
        });
      });
    });
  }

  function getUsers(request) {
    db.collection('users').find().toArray(function(err, users) {
      console.log(users);
      request.reply(users);
    });
  }


  return(methods);
}
