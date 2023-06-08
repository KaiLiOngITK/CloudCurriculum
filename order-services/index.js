var express = require('express');
const pool = require('./db');

var app = express();
const port = process.env.PORT || 8082;

// Where we will keep the orders data
let orders = [];

app.use(express.json());

app.get('/orders', function (req, res) {
    pool.query("SELECT * FROM orders ORDER BY id ASC", (error, result) => {
        if (error) {
            console.error("Error executing query", error);
            res.status(500).json({ error: "Internal server error" });
        } else {
            const orders = result.rows;
            res.status(200).json(orders);
        }
    });
    // if (!req.body.id ||
    //     !req.body.name ||
    //     !req.body.description) {
    //     res.status(400).res.json({ message: "Bad Request" });
    // } else {
    //     var order = req.body;
    //     orders.push(order);
    //     res.status(201).json(order);
    // }
});

app.post('/orders', function (req, res) {
    // res.json(orders);
    const { id, userId, productIds } = req.body;
    var order = req.body;

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

// app.get('/orders/:id', function (req, res) {
//     const id = +req.params.id;
//     const order = orders.find((order) => order.id === id);

//     if (order) {
//         res.json(order);
//     } else {
//         // Sending 404 when user not found
//         res.status(404).json({ error: 'Order not found' });
//     }
// });

// app.put('/orders/:id', function (req, res, next) {
//     const id = +req.params.id;
//     const item = orders.find(item => item.id === id);
//     var order = req.body;

//     if (item) {
//         item.id = order.id;
//         item.name = order.name;
//         item.email = order.email;
//     }
//     res.json(orders);    
// });

var server = app.listen(port, function () {
    console.log('Node server is running..');
});