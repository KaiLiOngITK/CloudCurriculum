var express = require('express');
const pool = require('./db');
const amqplib = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://guest:guest@rabbitmq:5673/';

var app = express();
var http = require('http');
var channel, connection;

const port = process.env.PORT || 8082;

// Where we will keep the orders data
// const orders = [];

app.use(express.json());

pool.query("CREATE TABLE IF NOT EXISTS orders (id SERIAL, userId VARCHAR(50), productIds VARCHAR(50))");

const exchange_name = 'order-shipment';
const exchange_type = 'fanout';

// connectQueue(); // call connectQueue function

async function connectQueue() {
    connection = await amqplib.connect(amqpUrl);
    channel = await connection.createChannel();
    try {
        console.log('Publishing');
        //     // https://amqp-node.github.io/amqplib/channel_api.html#channel_assertExchange
        //     await channel.assertExchange(exchange_name, exchange_type, {
        //         durable: false
        //     });

    } catch (error) {
        console.log(error);
    }
}

// const sendMessageToQueue = async (message) => {
//     const queue_name = '';
//     await channel.publish(
//         exchange_name,
//         queue_name,
//         Buffer.from(message)
//     );
// };

app.get('/orders', function (req, res) {

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

    const productExists = checkProductExist (productIds, res);
    // console.log(productExists);

    const userExists = checkUserExist (userId, res);
    // console.log(userExists);

    const orderExists = checkOrderExist (id, res);
    // console.log(orderExists);

    pool.query("INSERT INTO orders (id, userId, productIds) VALUES ($1, $2, $3) RETURNING *", [id, userId, productIds], (error, result) => {
        if (error) {
            console.error("Bad Request", error);
            res.status(400).json({ error: "Bad Request" });
        } else {
            const createdOrder = result.rows[0];
            res.status(200).json(createdOrder);
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
            if (orders.length == 0) {
                res.status(404).json({ 'Message': 'Order not found' });
            } else {
                res.status(200).json(orders);
            }
        }
    });
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
});

function checkProductExist(productIds, response) {

    productURL = `http://${process.env.PRODUCT_SERVICE_HOST}:${process.env.PRODUCT_SERVICE_PORT}/products/${productIds}`;
    console.log(productURL);

    var req = http.get(productURL, function (res){
        console.log('STATUS: ' + res.statusCode);
        if(res.statusCode != 200){
            return response.status(res.statusCode).json({'message': 'Invalid productId'});
        }
    });
};

function checkUserExist(userId, response) {

    userURL = `http://${process.env.USER_SERVICE_HOST}:${process.env.USER_SERVICE_PORT}/users/${userId}`;
    console.log(userURL);

    var req = http.get(userURL, function (res){
        console.log('STATUS: ' + res.statusCode);
        if(res.statusCode != 200){
            return response.status(res.statusCode).json({'message': 'Invalid userId'});
        }
    });
};

function checkOrderExist(id, response) {

    pool.query("SELECT * FROM orders where id = $1", [id], (error, result) => {
        if (error) {
            console.error("Error executing query", error);
            return response.status(500).json({ error: "Internal server error" });
        } else {
            const orders = result.rows;
            if (orders.length != 0) {
                return response.status(404).json({ 'Message': 'Existing order found' });
            }
        }
    });
};

var server = app.listen(port, function () {
    console.log('Node server is running..');
});