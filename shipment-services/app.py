import pika
import time
import sys, os

def main():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
    channel = connection.channel()

    queue_order = 'order-shipment'

    channel.queue_declare(queue=queue_order)

    def callback(ch, method, properties, body):
        body_str = body.decode("utf-8")
        print(f" [x] Received {body_str}", flush=True)

    channel.basic_consume(queue=queue_order, on_message_callback=callback, auto_ack=True)

    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()



if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)