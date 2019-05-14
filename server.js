const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.get('/',function(req,res){
  res.sendfile(path.join(__dirname, './client/public', 'index.html'));

});

app.post('/add', function(req,res) {
  res.send(req.body.stock)
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("stocks");
    var myobj = { symbol: req.body.stock};
    dbo.collection("symbol").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
})

app.get('/display', function(req, res) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("stocks");
    dbo.collection("symbol").find({}).toArray(function(err, result) {
      if (err) throw err;
      res.send(result);
      db.close();
    });
  }); 
})

app.post('/del', function(req, res) {
  console.log(req.body.stock)
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("stocks");
    var myquery = { symbol: req.body.stock };
    dbo.collection("symbol").deleteOne(myquery, function(err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      db.close();
    });
  }); 
})


// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("stocks");
//   var myquery = { symbol: /^C/ };
//   dbo.collection("symbol").deleteMany(myquery, function(err, obj) {
//     if (err) throw err;
//     console.log(obj.result.n + " document(s) deleted");
//     db.close();
//   });
// }); 


app.listen(port, () => console.log(`Listening on port ${port}`));