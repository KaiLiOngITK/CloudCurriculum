var express = require('express');
const pool = require('./db');
// const amqplib = require('amqplib');
// const pub = require('./pub');


var app = express();
var http = require('http');
// var channel;

const port = 8082;

app.use(express.json());

pool.query("CREATE TABLE IF NOT EXISTS orders (id SERIAL, userId VARCHAR(50), productIds VARCHAR(50))");

const exchange_name = 'order-shipment';
const exchange_type = 'fanout';

// var amqp = require('amqplib/callback_api');
const amqplib = require('amqplib');
const amqpUrl = 'amqp://guest:guest@rabbitmq:5672';

const sendMessage = async () => {

    try {
        console.log('===================================> Connecting to RabbitMQ....');

        const connection = await amqplib.connect(amqpUrl);
        console.log('===================================> Connected');


        const channel = await connection.createChannel();

        const queue = "my-queue";
        const message = "hello, RabbitMQ!";

        await channel.assertQueue(queue, { durable: false });
        channel.sendToQueue(queue, Buffer.from(message));

        console.log(`Sent message: ${message}`);

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);

        // await channel.publish(exchange, routingKey, Buffer.from(JSON.stringify("Testing ............................msg")));
    } catch (e) {
        console.error('Error in publishing message', e);
        console.log("Retrying in 5 seconds...");
        setTimeout(sendMessage, 5000);
    } 
};

app.get('/orders', async function (req, res) {

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

    const productExists = checkProductExist(productIds, res);
    // console.log(productExists);

    const userExists = checkUserExist(userId, res);
    // console.log(userExists);

    const orderExists = checkOrderExist(id, res);
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

    sendMessage();
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

    var req = http.get(productURL, function (res) {
        console.log('STATUS: ' + res.statusCode);
        if (res.statusCode != 200) {
            return response.status(res.statusCode).json({ 'message': 'Invalid productId' });
        }
    });
};

function checkUserExist(userId, response) {

    userURL = `http://${process.env.USER_SERVICE_HOST}:${process.env.USER_SERVICE_PORT}/users/${userId}`;
    console.log(userURL);

    var req = http.get(userURL, function (res) {
        console.log('STATUS: ' + res.statusCode);
        if (res.statusCode != 200) {
            return response.status(res.statusCode).json({ 'message': 'Invalid userId' });
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