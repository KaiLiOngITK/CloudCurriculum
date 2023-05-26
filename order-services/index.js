var express = require('express');
var bodyParser = require("body-parser");
var cors = require('cors');

var app = express();
const port = 5000;

// Where we will keep the orders data
let orders = [];

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/orders', function (req, res) {
    var order = req.body;

    console.log(order);
    orders.push(order);
    // var name = req.body.firstName + ' ' + req.body.lastName;
    
    res.send('Order has been added to the database!');
});

var server = app.listen(port, function () {
    console.log('Node server is running..');
});