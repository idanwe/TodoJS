var Hapi = require('hapi'),
    Bcrypt = require('bcrypt'),
    dupKeyError = 11000,
    bcryptRounds = 12;

exports.post = {
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

exports.signin = {
  handler: signin,
  auth: { mode: 'try' }
}

exports.logout = {
  handler: logout,
  auth: true
}

exports.get = {
  handler: getUsers
}

function addUser(request) {
  var newUser = request.payload;
  newUser.tasks = [];
  Bcrypt.hash(newUser.password, bcryptRounds, function(err, hashedPassword) {
    newUser.password = hashedPassword;
    exports.options.db.collection('users', function(err, collection) {
      collection.insert(newUser, { safe: true }, function(err, result) {
        if (err) {
          if (err.code === dupKeyError) {
            request.reply(Hapi.error.passThrough(409, '{"reason":"user already exist"}', 'application/json'));
            return;
          }
        } else {
          request.reply('ok');
        }
      });
    });
  });
}

function signin(request) {
  if (request.auth.isAuthenticated) {
    return request.reply('ok');
  }

  var username = request.query.username,
      password = request.query.password;

  console.log('signin username: ', username);
  exports.options.db.collection('users', function(err, collection) {
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

function getUsers(request) {
  exports.options.db.collection('users').find().toArray(function(err, users) {
    console.log(users);
    request.reply(users);
  });
}
