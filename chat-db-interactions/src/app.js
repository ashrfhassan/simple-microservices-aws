const Express = require('express');
const app = new Express();
const cors = require('cors')
const BodyParser = require('body-parser');
const jsonParser = BodyParser.json();
const amqp = require('amqplib/callback_api');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const messageSchema = new Schema({
    sender: { type: Number },
    text: { type: String, min: 1 },
});

const Message = mongoose.model('messages', messageSchema);

let amqpqueue = 'save_messages';
let amqpChannel;

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

        amqpChannel.consume(amqpqueue, function (message) {
            let content = JSON.parse(message.content.toString());
            let newMessage = new Message(content);
            newMessage.save(function (err) {
                if (err) {
                    console.log('message not saved');
                }else {
                    console.log('message saved');
                    amqpChannel.ack(message);
                    console.log('message deleted from queue');
                }
            });
        });
    });
});

app.use(cors());

app.get('/messages', jsonParser, async (req, res) => {
    res.send(await Message.find({}));
});

mongoose.connect(`${process.env.MONGODB_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(process.env.PORT, () => console.log(`chat service listening on port ${process.env.PORT}!`));
});
