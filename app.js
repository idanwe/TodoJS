var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;
var mongoClient = new MongoClient(new Server('localhost', 27017)),
    db;

mongoClient.open(function (err, client) {
  db = client.db('tododb');
  db.collection('users', { strict: true }, function(err, collection) {
    if (err) {
      console.log("The 'users' collection doesn't exist. Creating it with sample data...");
      populateUserDB();
    };
  });

  server = require("./server").createServer({ db: db });
  server.start(function () {
    console.log('server running on ' + server.info.uri);
  });
});

var populateUserDB = function() {
  console.log('Populating user database...');
  var users = [
    { 'name': 'idanwe', 'password': 'reminder', 'email': 'idanwe@gmail.com' },
    { 'name': 'blah', 'password': 'reminder', 'email': 'blah@gmail.com' }
  ];

  db.collection('users', function(err, collection) {
    collection.insert(users, { safe: true }, function(err, result) {
      if (err) {
        console.log('error at insert users to collection');
        console.log(err);
      }
    });
  });
};