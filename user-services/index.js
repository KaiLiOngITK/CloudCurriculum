const express = require('express');
const es6Renderer = require('express-es6-template-engine');
const exphbs = require('express-handlebars');
const bodyParser = require("body-parser");
const cors = require('cors');

var app = express();
const port = process.env.PORT || 5000;

app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');

// Where we will keep the users data
let users = [];

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.render('index', { locals: { title: 'User Management Service' } });
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
        res.json(users);
        res.status(201);
        console.log(user);

        // res.render(__dirname + '/views/user-list.html', { token: users });
        // res.sendFile(__dirname + '/views/user-list.html');
        // res.send('New user has been added into database');
    }
});

app.get('/users', function (req, res) {
    // res.sendFile(__dirname + '/views/user-list.html');
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
    res.status(404).send('Status 404: User not found');
});

app.delete('/users/:id', function (req, res) {
    // Reading id from the URL
    const id = req.params.id;

    // Remove item from the users array
    users = users.filter(i => {
        if (i.id !== id) {
            return true;
        }
        return false;
    });

    res.status(200).send('Status 200: User is deleted');
});

app.put('/users/:id', function (req, res, next) {
    const item = users.find(item => item.id === req.params.id);
    var user = req.body;

    if(item){
        item.id = user.id;
        item.name = user.name;
        item.email = user.email;
    }
    res.json(users);
    // res.status(200).send('User is edited. \n');
    
});

var server = app.listen(port, function () {
    console.log('Node server is running..');
});