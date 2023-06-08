const express = require('express');
const es6Renderer = require('express-es6-template-engine');
const pool = require('./db');
// const { Pool, Client } = require('pg');
// const pool = new Pool({
//     user: 'postgres',
//     password: 'password',
//     host: 'user-services-database-postgres',
//     database: 'postgres',
//     port: 5432
// });

var app = express();

const port = process.env.PORT || 8080;

app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');

app.use(express.json());

// GET /users - Retrieve all products
app.get('/users', function (req, res) {
    // const users = pool.query("SELECT * FROM users")
    // res.send(users.rows);
    pool.query("SELECT * FROM users ORDER BY id ASC", (error, result) => {
        if (error) {
            console.error("Error executing query", error);
            res.status(500).json({ error: "Internal server error" });
        } else {
            const users = result.rows;
            res.status(200).json(users);
        }
    });
    // res.json(users);
});

// POST /users - Create a new user
app.post('/users', function (req, res) {

    const { id, name, email } = req.body;
    var user = req.body;
    // users.push(user);

    pool.query("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *", [name, email], (error, result) => {
        if (error) {
            console.error("Bad Request", error);
            res.status(400).json({ error: "Bad Request" });
        } else {
            const createdUser = result.rows[0];
            res.status(201).json(createdUser);
        }
    })
    // res.status(201).json(user);
});

// GET /users/:id - Retrieve user by ID
app.get('/users/:id', function (req, res) {
    const id = +req.params.id;
    // const user = users.find((user) => user.id === id);

    pool.query("SELECT * FROM users where id = $1", [id], (error, result) => {
        if (error) {
            console.error("Error executing query", error);
            res.status(500).json({ error: "Internal server error" });
        } else {
            const users = result.rows;
            res.status(200).json(users);
        }
    });
    // if (user) {
    //     res.json(user);
    // } else {
    //     // Sending 404 when user not found
    //     res.status(404).json({ error: 'User not found' });
    // }
});

app.delete('/users/:id', function (req, res) {
    // Reading id from the URL
    const id = +req.params.id;

    pool.query("DELETE FROM users WHERE id = $1", [id], (error, result) => {
        if (error) {
            console.error("Error executing query", error);
            res.status(500).json({ error: "Internal server error" });
        } else {
            const users = result.rows;
            res.status(200).json(users);
        }
    });
    // // Remove item from the users array
    // users = users.filter(i => {
    //     if (i.id !== id) {
    //         return true;
    //     }
    //     return false;
    // });

    // res.status(200).json(users);
});

app.put('/users/:id', function (req, res, next) {
    const id = +req.params.id;
    // const item = users.find(item => item.id === id);
    // var user = req.body;
    const { name, email } = req.body;

    pool.query("UPDATE users SET name = $1, email = $2 WHERE id = $3", [name, email, id], (error, result) => {
        if (error) {
            console.error("Error executing query", error);
            res.status(500).json({ error: "Internal server error" });
        } else {
            const users = result.rows;
            res.status(200).json(users);
        }
    });
    // if (item) {
    //     item.id = user.id;
    //     item.name = user.name;
    //     item.email = user.email;
    // }
    // res.json(users);
    // res.status(200).send('User is edited. \n');

});

var server = app.listen(port, function () {
    console.log('Node server is running..');
});