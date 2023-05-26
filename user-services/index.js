var express = require('express');
var bodyParser = require("body-parser");
var cors = require('cors');

var app = express();
const port = 5000;

// Where we will keep the users data
let users = [];

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/user', function (req, res) {
    var user = req.body;

    console.log(user);
    users.push(user);
    // var name = req.body.firstName + ' ' + req.body.lastName;
    
    res.send('User has been added to the database!');
});

var server = app.listen(port, function () {
    console.log('Node server is running..');
});