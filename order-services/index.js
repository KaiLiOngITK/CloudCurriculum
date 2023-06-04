var express = require('express');

var app = express();
const port = process.env.PORT || 8082;

// Where we will keep the orders data
let orders = [];

app.use(express.json());

app.get('/', function (req, res) {
    // res.render('index', { locals: { title: 'Order Service' } });
});

app.post('/orders', function (req, res) {
    
    if (!req.body.id ||
        !req.body.name ||
        !req.body.description) {
        res.status(400).res.json({ message: "Bad Request" });
    } else {
        var order = req.body;
        orders.push(order);
        res.status(201).json(order);
    }
});

app.get('/orders', function (req, res) {
    res.json(orders);
});

app.get('/orders/:id', function (req, res) {
    const id = +req.params.id;
    const order = orders.find((order) => order.id === id);

    if (order) {
        res.json(order);
    } else {
        // Sending 404 when user not found
        res.status(404).json({ error: 'Order not found' });
    }
});

app.put('/orders/:id', function (req, res, next) {
    const id = +req.params.id;
    const item = orders.find(item => item.id === id);
    var order = req.body;

    if (item) {
        item.id = order.id;
        item.name = order.name;
        item.email = order.email;
    }
    res.json(orders);    
});

var server = app.listen(port, function () {
    console.log('Node server is running..');
});