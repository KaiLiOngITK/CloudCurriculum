var express = require('express');
// const pool = require('./db');
const { Pool, Client } = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: 'password',
    host: 'order-services-database-postgres',
    database: 'postgres',
    port: 5433
});

var app = express();

const port = 8082;

// Where we will keep the orders data
// const orders = [];

app.use(express.json());

pool.query("CREATE TABLE IF NOT EXISTS orders (id SERIAL, userId VARCHAR(50), productIds VARCHAR(50))");

// app.get('/', function (req, res) {
//     pool.query("CREATE TABLE IF NOT EXISTS orders (id SERIAL, userId VARCHAR(50), productIds VARCHAR(50))");
// });

app.get('/orders', function (req, res) {
    // res.json(orders);

    pool.query("SELECT * FROM orders", (error, result) => {
        if (error) {
            console.error("Error executing query", error);
            res.status(500).json({ error: "Internal server error" });
        } else {
            const orders = result.rows;
            res.status(200).json(orders);
        }
    });

});

app.post('/orders', function (req, res) {

    const { id, userId, productIds } = req.body;
    const order = req.body;
    // orders.push(order);
    // res.status(201).json(order);

    pool.query("INSERT INTO orders (userId, productIds) VALUES ($1, $2) RETURNING *", [userId, productIds], (error, result) => {
        if (error) {
            console.error("Bad Request", error);
            res.status(400).json({ error: "Bad Request" });
        } else {
            const createdOrder = result.rows[0];
            res.status(201).json(createdOrder);
        }
    })
});

app.get('/orders/:id', function (req, res) {
    const id = +req.params.id;
    pool.query("SELECT * FROM orders where id = $1", [id], (error, result) => {
        if (error) {
            console.error("Error executing query", error);
            res.status(500).json({ error: "Internal server error" });
        } else {
            const orders = result.rows;
            res.status(200).json(orders);
        }
    });
    // const order = orders.find((order) => order.id === id);

    // if (order) {
    //     res.json(order);
    // } else {
    //     // Sending 404 when user not found
    //     res.status(404).json({ error: 'Order not found' });
    // }
});

app.put('/orders/:id', function (req, res, next) {
    const id = +req.params.id;
    // const item = orders.find(item => item.id === id);
    // var order = req.body;
    const { userId, productIds } = req.body;

    pool.query("UPDATE orders SET userId = $1, productIds = $2 WHERE id = $3", [userId, productIds, id], (error, result) => {
        if (error) {
            console.error("Error executing query", error);
            res.status(500).json({ error: "Internal server error" });
        } else {
            const orders = result.rows;
            res.status(200).json(orders);
        }
    });

    // if (item) {
    //     item.id = order.id;
    //     item.name = order.name;
    //     item.email = order.email;
    // }
    // res.json(orders);    
});

var server = app.listen(port, function () {
    console.log('Node server is running..');
});