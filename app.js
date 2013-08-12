var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;
var mongoClient = new MongoClient(new Server('localhost', 27017)),
    db;

mongoClient.open(function (err, client) {
  db = client.db('tododb');
  db.collection('users', { strict: true }, function(err, collection) {
    if (err) {
      console.log("The 'users' collection doesn't exist. Creating it with sample data...");
    };
  });

  server = require("./server").createServer({ db: db });
  server.start(function () {
    console.log('server running on ' + server.info.uri);
  });
});
