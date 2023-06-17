import amqplib, { Channel, Connection, ConsumeMessage } from 'amqplib'
import express, { Request, Response } from 'express'

const app = express()
// const connection: Connection = await amqplib.connect("amqp://guest:guest@rabbitmq:5672")
// const channel: Channel = await connection.createChannel()
const queue = 'order-shipment'

// parse the request body
app.use(express.json())

// port where the service will run
const PORT = 8083
const rabbitmq_URL = 'amqp://guest:guest@rabbitmq:5672'

// rabbitmq to be global variables
let connection: Connection, channel: Channel
// var messageString;

receiver()

// consumer for the queue.
// We use currying to give it the channel required to acknowledge the message
const consumer = (channel: Channel) => (msg: ConsumeMessage | null): void => {
    if (msg) {
        // Display the received message
        console.log(msg.content.toString())
        // Acknowledge the message
        channel.ack(msg)
    }
}

// connect to rabbitmq
async function receiver() {
    try {
        console.log("****-------------------------**** Connecting to rabbitmq")
        connection = await amqplib.connect(rabbitmq_URL)
        channel = await connection.createChannel()
        await channel.assertQueue(queue)
        // await channel.consume(queue, (msg) => {
        //     console.log("****-------------------------**** Waiting message")
        //     if (msg != null) {
        //         console.log(msg.content.toString())
        //         channel.ack(msg)
        //     }else{
        //         console.log("message is null")
        //     }
        // })

        await channel.consume(queue,consumer(channel))

        // setTimeout(() => {
        //     connection.close();
        //     process.exit(0);
        // }, 500);

    } catch (error) {
        console.log(error)
    }
}

app.post('/shippings', (req: Request, res: Response) => {
    const data = req.body

    // send a message to all the services connected to 'shipping' queue, add the date to differentiate between them
    channel.sendToQueue(
        'shipping',
        Buffer.from(
            JSON.stringify({
                ...data,
                date: new Date(),
            }),
        ),
    )
    res.send('Shipment submitted')
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})