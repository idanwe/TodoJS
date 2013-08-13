var Hapi = require('hapi'),
    User = require('./user'),
    ObjectID = require('mongodb').ObjectID,
    _ = require('underscore'),
    options = {};

exports.__defineSetter__('options', function(value) {
  User.options = options = value;
});
exports.__defineGetter__('options', function() {
  return options
});


exports.postSignup = User.post;
exports.getSignin = User.signin;
exports.getLogout = User.logout;
exports.getUsers = User.get;


exports.getTasks = {
  handler: getTasks,
  auth: true
}

exports.postTasks = {
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

exports.patchTask = {
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

exports.deleteTask = {
  handler: deleteTask,
  auth: true
}

function getTasks(request) {
  var userCred = request.auth.credentials;
  exports.options.db.collection('users', function(err, collection) {
    collection.findOne({ _id: userCred._id }, function(err, user) {
      request.reply(user.tasks);
    });
  });
}

function addTask(request) {
  var userCred = request.auth.credentials;
  exports.options.db.collection('users', function(err, collection) {
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

  exports.options.db.collection('users', function(err, collection) {
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

  exports.options.db.collection('users', function(err, collection) {
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
