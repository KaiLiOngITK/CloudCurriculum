var express = require('express');
var bodyParser = require("body-parser");
var cors = require('cors');

var app = express();
const port = 5000;

// Where we will keep the products data
let products = [];

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/product', function (req, res) {
    var product = req.body;

    console.log(product);
    products.push(product);
    // var name = req.body.firstName + ' ' + req.body.lastName;
    
    res.send('Products has been added to the database!');
});

var server = app.listen(port, function () {
    console.log('Node server is running..');
});