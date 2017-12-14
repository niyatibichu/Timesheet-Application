/* jshint node: true */
"use strict";

var express = require("express");
var app = express();
var fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
var router = express.Router();
var bodyParser = require('body-parser');
var obj = [];
var db, collection;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect('mongodb://niyatibichu:admin2017@ds137256.mlab.com:37256/users-timelog', function (err, database) {
    if (err) { return console.log(err); }
    db = database.db("users-timelog");
    // var query = { "name": "Niyati Bichu"};
    collection = db.collection("users");
    app.listen(3000, () => {
        console.log('TimeLog App listening on 3000...');
    });
});


app.use(express.static(__dirname + '/'));

app.get("/", function (req, res) {  //for index.html
    res.sendFile(__dirname + '/index.html');
});

app.get("/show", function (req, res) {
    collection.find().toArray(function (err, docs) {

        docs.forEach(function (doc) {
            // console.log(doc.name + " is a " + doc.name + "company");
        });
        res.send(docs);

    });

});

app.post("/add", function (req, res) {
    let entry1 = req.body;
    collection.insertOne(entry1);
    collection.find().toArray(function (err, docs) {
        res.send(docs);
    });

});

app.post("/update", function (req, res) {
    let entry2 = req.body;
    //var entry = req.body;
    var name_to_update = JSON.stringify(entry2.name);
    console.log("Data received from updating user" + name_to_update);
    var query1 = { "name": entry2.old };
    collection.updateOne(query1, {
        $set: {
            "dt": entry2.dt,
            "from": entry2.from,
            "to": entry2.to,
            "comments": entry2.comments
        }
    }, function (err, results) {
        console.log(results.result);
    });


    collection.find().toArray(function (err, docs) {
        res.send(docs);
    });

});

app.post("/remove", function (req, res) {
    let entry = req.body;

    var name_to_delete = JSON.stringify(entry.name);

    collection.deleteOne(entry);

});
