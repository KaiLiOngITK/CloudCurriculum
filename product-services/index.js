var express = require('express');

var app = express();
const port = process.env.PORT || 8081;

app.use(express.json());

// Where we will keep the products data
let products = [];

app.get('/', function (req, res) {
    res.render('index', { locals: { title: 'Product Catalog Service' } });
});

app.post('/products', function (req, res) {

    if (!req.body.id ||
        !req.body.name ||
        !req.body.description) {
        res.status(400).res.json({ message: "Bad Request" });
    } else {
        var product = req.body;
        products.push(product);
        res.status(201).json(product);
    }
});

app.get('/products', function (req, res) {
    res.json(products);
});

app.get('/products/:id', function (req, res) {
    const id = +req.params.id;
    const product = products.find((product) => product.id === id);

    if (product) {
        res.json(product);
    } else {
        // Sending 404 when user not found
        res.status(404).json({ error: 'Product not found' });
    }
});

app.delete('/products/:id', function (req, res) {
    // Reading id from the URL
    const id = +req.params.id;

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
    const id = +req.params.id;
    const item = products.find(item => item.id === id);
    var product = req.body;

    if (item) {
        item.id = product.id;
        item.name = product.name;
        item.email = product.email;
    }
    res.json(products);

});

var server = app.listen(port, function () {
    console.log('Node server is running..');
});