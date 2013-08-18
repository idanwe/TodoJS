var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    Bcrypt = require('bcrypt');

var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/',
    bcryptRounds = 12
    db;
    // mongoClient = new MongoClient.connect(new Server(mongoUri));

console.log('----------------------------------------------');
console.log('mongoUri: ', mongoUri);
mongoClient = new MongoClient.connect(mongoUri, function (err, client) {
// mongoClient.open(function (err, client) {
  db = client.db('tododb');
  db.collection('users', { strict: true }, function(err, collection) {
    if (err) {
      console.log("The 'users' collection doesn't exist. Creating it with sample data...");
      populateDB()
    };
  });

  server = require("./server").createServer({ db: db });
  server.start(function () {
    console.log('server running on ' + server.info.uri);
  });
});

var populateDB = function() {
  var user = {
    name: "admin",
    password: "reminder"
  };

  Bcrypt.hash(user.password, bcryptRounds, function(err, hashedPassword) {
    user.password = hashedPassword;
    db.collection('users', function(err, collection) {
      collection.insert(wines, {safe:true}, function(err, result) {});
    });
  });
};