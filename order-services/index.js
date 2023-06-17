var express = require('express');
const pool = require('./db');
const amqplib = require('amqplib');
const amqpUrl = 'amqp://guest:guest@rabbitmq:5672';

var app = express();
var http = require('http');
const port = 8082;

app.use(express.json());

pool.query("CREATE TABLE IF NOT EXISTS orders (id SERIAL, userId VARCHAR(50), productIds VARCHAR(50))");

let valid = []; // validProduct, validUser, validOrder

const sendMessage = async (message) => {

    try {
        const connection = await amqplib.connect(amqpUrl);
        console.log('===================================> Connected');
        const channel = await connection.createChannel();

        const queue = "order-shipment";
        const routingKey = "order-shipment";

        await channel.assertQueue(queue, { durable: false });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        // channel.publish(queue, routingKey, Buffer.from(JSON.stringify(message)));

        console.log(` [x] Sent message: ${JSON.stringify(message)}`);

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

    var dbDone = "false";
    valid[0] = 'true';
    valid[1] = 'true';
    valid[2] = 'true';
    valid[3] = 'false';

    const { id, userId, productIds } = req.body;
    const order = req.body;

    checkValidity(id, userId, productIds, res, req);
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

app.delete('/orders', function (req, res) {

    pool.query("DELETE FROM orders", (error, result) => {
        if (error) {
            console.error("Error executing query", error);
            res.status(500).json({ error: "Internal server error" });
        } else {
            const orders = result.rows;
            res.status(200).json(orders);
        }
    });

    pool.query("CREATE TABLE IF NOT EXISTS orders (id SERIAL, userId VARCHAR(50), productIds VARCHAR(50))");
});

function checkValidity(id, userId, productIds, response, request) {

    productURL = `http://${process.env.PRODUCT_SERVICE_HOST}:${process.env.PRODUCT_SERVICE_PORT}/products/${productIds}`;
    console.log(productURL);

    var req = http.get(productURL, function (res) {
        console.log('STATUS: ' + res.statusCode);
        if (res.statusCode != 200) {
            valid[0] = "false";
            return response.status(res.statusCode).json({ 'message': 'Invalid productId' });
        } else {
            userURL = `http://${process.env.USER_SERVICE_HOST}:${process.env.USER_SERVICE_PORT}/users/${userId}`;
            console.log(userURL);

            var req = http.get(userURL, function (res) {
                console.log('STATUS: ' + res.statusCode);

                if (res.statusCode != 200) {
                    valid[1] = "false";
                    return response.status(res.statusCode).json({ 'message': 'Invalid userId' });
                } else {
                    pool.query("SELECT * FROM orders where id = $1", [id], (error, result) => {
                        if (error) {
                            valid[2] = "false";
                            console.error("Error executing query", error);
                            return response.status(500).json({ error: "Internal server error" }), valid;
                        } else {
                            const orders = result.rows;
                            if (orders.length != 0) {
                                valid[2] = "false";
                                return response.status(404).json({ 'Message': 'Existing order found' });
                            } else {
                                postToDatabase(id, userId, productIds, response, request);
                            }
                        }
                    });
                }
            });
        }
    });
}

function postToDatabase(id, userId, productIds, res, req) {
    if (valid[0] == "true" && valid[1] == "true" && valid[2] == "true") {
        pool.query("INSERT INTO orders (id, userId, productIds) VALUES ($1, $2, $3) RETURNING *", [id, userId, productIds], (error, result) => {
            if (error) {
                console.error("Bad Request", error);
                res.status(400).json({ error: "Bad Request" });
            } else {
                const createdOrder = result.rows[0];
                res.status(200).json(createdOrder);
            }
        });
        sendMessage(req.body);
    }
};

var server = app.listen(port, function () {
    console.log('Node server is running..');
});