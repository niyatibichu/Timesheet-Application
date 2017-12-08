/* jshint node: true */
"use strict";

var express = require("express");
var app = express();


var router = express.Router();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var fs = require('fs');
var obj = [];

fs.readFile('example.json', (err, data) => {
    if (err) throw err;
    obj = JSON.parse(data);
    //console.log(obj);
})


app.use(express.static(__dirname + '/'));
app.get("/", function (req, res) {  //for index.html

    res.sendFile(__dirname + '/index.html');

});
app.get("/show", function (req, res) {  //for index.html    
    res.json(obj);
});

app.post("/add", function (req, res) {
    let entry = req.body;
    // var entry = req.body;
    //console.log("Data received from adding new user" + JSON.stringify(entry));
    var contents = JSON.parse(fs.readFileSync('example.json', 'utf8'));

    contents.push(entry);
    //console.log("Contents to be written to json file: \n"+ JSON.stringify(contents));
    fs.writeFileSync("example.json", JSON.stringify(contents));
    res.json(obj);

});

app.post("/remove", function (req, res) {
    let entry = req.body;
    var index = -1;
    var name_to_delete = JSON.stringify(entry.name);
    var contents = JSON.parse(fs.readFileSync('example.json', 'utf8'));
    for (var i = 0; i < contents.length; i++) {
        var name_in_json = JSON.stringify(contents[i].name);

        if (name_in_json == name_to_delete) {
            index = i;
        }
    }

    console.log("Index is : " + index);
    if (index > -1) {
        contents.splice(index, 1);
    }

    fs.writeFileSync("example.json", JSON.stringify(contents));
    res.send(obj);

})

app.listen(3000, function () {
    console.log("Example app listening on port 3000");
});