var Hapi = require('hapi'),
    db;

exports.composeRoutes = function (settings) {
  db = settings.db;
  var methods = [
    {
      method: 'POST',
      path: '/signup',
      config: {
        validate: {
          payload: {
            name: Hapi.types.String().required()
            // password: Hapi.types.String().min(8).description('8 characters or longer')
          }
        },

        handler: function(req) {
          console.log("###################---------------#################");
          console.log("ADDDDDINNGNNGNGNNGNG    UUUUSSSSEEEEERRRRR");
          var user = request.payload;
          debugger
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

          // Bcrypt.hash newUser.password, options.bcryptRounds, (err, hashedPassword) ->
          //   newUser.password = hashedPassword
          //   options.db.collection 'users', (err, collection) ->
          //     collection.insert newUser, (err, insertedUser)->
          //       if (err?.code is dupKeyError)
          //         req.reply Hapi.error.passThrough 409, '{"reason":"user already exist"}', 'application/json'
          //         return
          //       req.reply('ok')
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
  console.log("###################---------------#################");
  console.log("ADDDDDINNGNNGNGNNGNG    UUUUSSSSEEEEERRRRR");
  var user = request.payload;
  debugger
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

    debugger;
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
