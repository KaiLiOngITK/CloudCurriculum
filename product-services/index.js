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

// Where we will keep the products data
let products = [];

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.render('index', { locals: { title: 'Product Catalog Service' } });
});

app.post('/products', function (req, res) {

    if (!req.body.id ||
        !req.body.name ||
        !req.body.description) {
        res.status(400);
        res.json({ message: "Bad Request" });
    } else {
        var product = req.body;
        products.push({
            id: req.body.id,
            name: req.body.name,
            description: req.body.description
        });
        // res.json({message: "New product created.", location: "/product/" + req.body.id})
        res.json(products);
        res.status(201);
        console.log(product);

    // var product = req.body;

    // console.log(product);
    // products.push(product);
    // var name = req.body.firstName + ' ' + req.body.lastName;
    
    // res.send('Products has been added to the database!');
    }
});

app.get('/products', function (req, res) {
    res.json(products);
});

app.get('/products/:id', function (req, res) {
    const id = req.params.id;

    // Searching products for the id
    for (let product of products) {
        if (product.id === id) {
            res.json(product);
            return;
        }
    }

    // Sending 404 when product not found
    res.status(404).send('Status 404: Product not found');
});

app.delete('/products/:id', function (req, res) {
    // Reading id from the URL
    const id = req.params.id;

    // Remove item from the products array
    products = products.filter(i => {
        if (i.id !== id) {
            return true;
        }
        return false;
    });

    res.status(200).send('Status 200: Product is deleted');
});

app.put('/products/:id', function (req, res, next) {
    const item = products.find(item => item.id === req.params.id);
    var product = req.body;

    if(item){
        item.id = product.id;
        item.name = product.name;
        item.email = product.email;
    }
    res.json(products);
    // res.status(200).send('Product is edited. \n');
    
});

var server = app.listen(port, function () {
    console.log('Node server is running..');
});