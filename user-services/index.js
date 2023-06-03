const express = require('express');
const es6Renderer = require('express-es6-template-engine');
const pool = require('./db');

var app = express();
const port = process.env.PORT || 8080;

app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');

app.use(express.json());

console.log("Passed importing all details");
// For keeping the users data
// let users = [];

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.get('/', async function (req, res) {
    res.render('index', { locals: { title: 'User Management Service' } });
    try{
        const data = await pool.query("SELECT * FROM users")
        res.send(data.rows);
    }catch{
        res.status(400).send('Error Occurs');
    }
});

// GET /users - Retrieve all products
app.get('/users', function (req, res) {
    res.json(users);
});

// POST /users - Create a new user
app.post('/users', async function (req, res) {

    if (!req.body.id ||
        !req.body.name ||
        !req.body.email) {
        res.status(400).res.json({ message: "Bad Request" });
    } else {
        var user = req.body;
        // users.push(user);

        await pool.query("INSERT INTO users (id, name, email) VALUES ($1,$2,$3)", [req.body.id,req.body.name,req.body.email])

        res.status(201).json(user);
    }
});

// GET /users/:id - Retrieve user by ID
app.get('/users/:id', function (req, res) {
    const id = +req.params.id;
    const user = users.find((user) => user.id === id);

    if (user) {
        res.json(user);
    } else {
        // Sending 404 when user not found
        res.status(404).json({ error: 'User not found' });
    }
});

app.delete('/users/:id', function (req, res) {
    // Reading id from the URL
    const id = +req.params.id;

    // Remove item from the users array
    users = users.filter(i => {
        if (i.id !== id) {
            return true;
        }
        return false;
    });

    res.status(200).json(users);
});

app.put('/users/:id', function (req, res, next) {
    const id = +req.params.id;
    const item = users.find(item => item.id === id);
    var user = req.body;

    if (item) {
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