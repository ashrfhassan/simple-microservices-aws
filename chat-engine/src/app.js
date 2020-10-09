const amqp = require('amqplib/callback_api');
const io = require('socket.io')(process.env.SOCKET_IO_PORT, {transports: ['websocket']});

let amqpqueue = 'save_messages';
let amqpChannel;
io.on('connect', function(client) {
    console.log("client is connected with id: " + client.id);
    client.on('sendMessage', function (msg) {
        amqpChannel.sendToQueue(amqpqueue, Buffer.from(JSON.stringify(msg)));
        io.emit('receiveMessage', msg)
    })
})

amqp.connect(`${process.env.RABBITMQ_URI}`, function (error0, connection) {

    if (error0) {
        throw error0;
    }

    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        channel.assertQueue(amqpqueue, {
            durable: false
        });

        channel.prefetch(1);

        amqpChannel = channel;
    });
});