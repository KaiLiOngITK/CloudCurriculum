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

app.post('/users', function (req, res) {
    
    

    if(!req.body.id ||
        !req.body.name ||
        !req.body.email){
            res.status(400);
            res.json({message: "Bad Request"});
        }else{
            var user = req.body;
            users.push({
                id: req.body.id,
                name: req.body.name,
                email: req.body.email
            });
            res.json({message: "New user created.", location: "/users/" + req.body.id})
            res.status(201);
            console.log(user);
        }
});

app.get('/users', function (req, res){
    res.json(users);
});

var server = app.listen(port, function () {
    console.log('Node server is running..');
});