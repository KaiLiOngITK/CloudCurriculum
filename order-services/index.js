var express = require('express');
const es6Renderer = require('express-es6-template-engine');
const exphbs = require('express-handlebars');
var bodyParser = require("body-parser");
var cors = require('cors');

var app = express();
const port = process.env.PORT || 5000;

app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');

// Where we will keep the orders data
let orders = [];

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.render('index', { locals: { title: 'Order Service' } });
});

app.post('/orders', function (req, res) {
    
    if (!req.body.id ||
        !req.body.userId ||
        !req.body.productIds) {
        res.status(400);
        res.json({ message: "Bad Request" });
    } else {
        var order = req.body;
        orders.push({
            id: req.body.id,
            userId: req.body.userId,
            productIds: req.body.productIds
        });
        
        res.json(orders);
        res.status(201);
        console.log(order);
    }
});

app.get('/orders', function (req, res) {
    res.json(orders);
});

app.get('/orders/:id', function (req, res) {
    const id = req.params.id;

    // Searching orders for the id
    for (let order of orders) {
        if (order.id === id) {
            res.json(order);
            return;
        }
    }

    // Sending 404 when order not found
    res.status(404).send('Status 404: Order not found');
});

app.put('/orders/:id', function (req, res, next) {
    const item = orders.find(item => item.id === req.params.id);
    var order = req.body;

    if(item){
        item.id = order.id;
        item.userId = order.userId;
        item.productIds = order.productIds;
    }
    res.json(orders);    
});

var server = app.listen(port, function () {
    console.log('Node server is running..');
});