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

    if (!req.body.id ||
        !req.body.name ||
        !req.body.email) {
        res.status(400);
        res.json({ message: "Bad Request" });
    } else {
        var user = req.body;
        users.push({
            id: req.body.id,
            name: req.body.name,
            email: req.body.email
        });
        // res.json({message: "New user created.", location: "/users/" + req.body.id})
        // res.sendFile(__dirname + '/user-list.html');
        res.status(201);
        console.log(user);
        // res.send('New user has been added into database');
    }
});

app.get('/users', function (req, res) {
    // res.sendFile(__dirname + '/user-list.html');
    res.json(users);
});

app.get('/users/:id', function (req, res) {
    const id = req.params.id;

    // Searching users for the id
    for (let user of users) {
        if (user.id === id) {
            res.json(user);
            return;
        }
    }

    // Sending 404 when user not found
    res.status(404).send('User not found');
});

app.delete('/users/:id', function (req, res) {
    // Reading id from the URL
    const id = req.params.id;

    // Remove item from the users array
    users = user.filter(i => {
        if (i.id !== id) {
            return true;
        }
        return false;
    });

    res.send('User is deleted');
});

app.post('/users/:id', function (req, res) {
    // Reading id from the URL
    const id = req.params.id;
    const newUser = req.user;

    // Remove item from the users array
    for (let i = 0; i < users.length; i++) {
        let user = users[i]
        if (user.id == id) {
            users[i] = newUser;
        }
    }

    res.send('User is edited');
});

var server = app.listen(port, function () {
    console.log('Node server is running..');
});