"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guid_1 = require("./iotComponent/models/guid");
const enum_1 = require("./iotComponent/models/enum");
const logger_service_1 = require("./common/logger.service");
var amqp = require('amqplib/callback_api');
const EventEmitter = require('events');
class EmitterClass extends EventEmitter {
}
var QS_EXCHANGE = 'QS_EXCHANGE';
var channels = [];
let RabbitMQconnection = "amqp://guest:guest@localhost";
class rabbitMQClient {
    constructor(queueName, Topics) {
        this.id = new guid_1.Guid().Guid().substring(3, 10);
        this.SubscribTopics = Topics;
        this.RPC_Queue = queueName;
        this.RPC_Queue_Reply = queueName + "_Reply_" + this.id;
        this.RPC_Queue_Listener = queueName + "_BroadcastListener_" + this.id;
        this.connection;
        this.channel;
        this.MessageRecieveEmitter = new EmitterClass();
        //Generate Channel Key
        this.keysString = "";
        if (Topics && Topics.length > 0) {
            this.keysString = Topics.join(",");
        }
    }
    //Create a consumer for the replies on this client
    async RecieveReplies() {
        let that = this;
        that.channel = channels.find(function (x) {
            return x.key == that.RPC_Queue + "_" + that.keysString;
        }).value;
        that.channel.assertQueue(that.RPC_Queue_Reply, {
            durable: false, autoDelete: true, exclusive: true, arguments: {
                "x-message-ttl": 2000
            }
        }, async function (err, q) {
            that.channel.consume(that.RPC_Queue_Reply, function (msg) {
                that.MessageRecieveEmitter.emit('event', msg.properties.correlationId, msg.content.toString());
            }, { noAck: true });
        });
    }
    //Handle the channels and creation
    async setConnection() {
        let that = this;
        return new Promise(function (resolve) {
            try {
                let channelItem = channels.find(function (x) {
                    return x.key == (that.RPC_Queue + "_" + that.keysString);
                });
                if (!channelItem) {
                    amqp.connect(RabbitMQconnection, function (err, conn) {
                        if (!conn) {
                            console.log("Connot connect to Rabbit MQ make sure it is installed and enabled");
                            resolve(enum_1.Result.Failed);
                        }
                        conn.createChannel(function (err, ch) {
                            ch.assertExchange(QS_EXCHANGE, 'topic', { durable: false });
                            ch.assertQueue(that.RPC_Queue, { durable: false });
                            ch.assertQueue(that.RPC_Queue_Listener, { durable: false, autoDelete: true });
                            if (that.SubscribTopics && that.SubscribTopics.length > 0) {
                                for (let i = 0; i < that.SubscribTopics.length; i++) {
                                    ch.bindQueue(that.RPC_Queue_Listener, QS_EXCHANGE, that.SubscribTopics[i]);
                                }
                            }
                            ch.prefetch(1);
                            console.log('initialized');
                            that.connection = conn;
                            that.channel = ch;
                            channels.push({
                                key: (that.RPC_Queue + "_" + that.keysString),
                                value: ch
                            });
                            that.RecieveReplies();
                            resolve(enum_1.Result.Success);
                        });
                    });
                }
                else {
                    that.channel = channelItem.value;
                    resolve(enum_1.Result.Success);
                }
            }
            catch (error) {
                logger_service_1.Logger.error(error);
                resolve(enum_1.Result.Failed);
            }
        });
    }
    //Recieve the messages from topics and process it using the function
    async receive(ProcessMessageFunction) {
        let that = this;
        await this.setConnection();
        return new Promise(function (resolve) {
            try {
                that.channel.consume(that.RPC_Queue, async function sendReply(msg) {
                    try {
                        let payloadBytes = msg.content;
                        let payload = JSON.parse(payloadBytes.toString());
                        console.log("Recieve request and send the reply");
                        await ProcessMessageFunction(payload);
                        that.channel.sendToQueue(msg.properties.replyTo, new Buffer(JSON.stringify(payload)), { correlationId: msg.properties.correlationId });
                        that.channel.ack(msg);
                        resolve(enum_1.Result.Success);
                    }
                    catch (error) {
                        that.channel.sendToQueue(msg.properties.replyTo, new Buffer(JSON.stringify("")), { correlationId: msg.properties.correlationId });
                        that.channel.ack(msg);
                        logger_service_1.Logger.error(error);
                        resolve(enum_1.Result.Failed);
                    }
                });
                that.channel.consume(that.RPC_Queue_Listener, async function sendReply(msg) {
                    try {
                        let payloadBytes = msg.content;
                        let payload = JSON.parse(payloadBytes.toString());
                        console.log("Recieve request and send the reply");
                        await ProcessMessageFunction(payload);
                        that.channel.sendToQueue(msg.properties.replyTo, new Buffer(JSON.stringify(payload)), { correlationId: msg.properties.correlationId });
                        that.channel.ack(msg);
                        resolve(enum_1.Result.Success);
                    }
                    catch (error) {
                        that.channel.sendToQueue(msg.properties.replyTo, new Buffer(JSON.stringify("")), { correlationId: msg.properties.correlationId });
                        that.channel.ack(msg);
                        logger_service_1.Logger.error(error);
                        resolve(enum_1.Result.Failed);
                    }
                });
            }
            catch (error) {
                logger_service_1.Logger.error(error);
                resolve(enum_1.Result.Failed);
            }
        });
    }
    //Send to queue and wait for reply
    async send(QueueName, Message, Reply) {
        try {
            let that = this;
            await this.setConnection();
            return new Promise(function (resolve) {
                try {
                    //Get the needed channel
                    that.channel = channels.find(function (x) {
                        return x.key == that.RPC_Queue + "_" + that.keysString;
                    }).value;
                    //Function to handle the comming events
                    let random_correlationId = new guid_1.Guid().Guid();
                    var handleReply = function (correlationId, msg) {
                        if (correlationId == random_correlationId) {
                            Reply.push(msg);
                            that.MessageRecieveEmitter.removeListener('event', handleReply);
                            resolve(enum_1.Result.Success);
                        }
                    };
                    //Add handler to the recieve event
                    that.MessageRecieveEmitter.on('event', handleReply);
                    //Send the message to queue
                    console.log("Send Request");
                    that.channel.sendToQueue(QueueName, new Buffer(Message.toString()), { correlationId: random_correlationId, replyTo: that.RPC_Queue_Reply });
                    //Fallback handling (Remove the handler and resolve the promise after 2 seconds)
                    var TimeoutHandler = function () {
                        that.MessageRecieveEmitter.removeListener('event', handleReply);
                        resolve(enum_1.Result.Failed);
                    };
                    setTimeout(TimeoutHandler, 2000);
                }
                catch (error) {
                    logger_service_1.Logger.error(error);
                    resolve(enum_1.Result.Failed);
                }
            });
        }
        catch (error) {
            logger_service_1.Logger.error(error);
            resolve(enum_1.Result.Failed);
        }
    }
    async sendBroadcast(Topic, Message) {
        try {
            let that = this;
            await this.setConnection();
            return new Promise(function (resolve) {
                try {
                    that.channel.publish(QS_EXCHANGE, Topic, new Buffer(Message));
                    resolve(enum_1.Result.Success);
                }
                catch (error) {
                    logger_service_1.Logger.error(error);
                    resolve(enum_1.Result.Failed);
                }
            });
        }
        catch (error) {
            logger_service_1.Logger.error(error);
            resolve(enum_1.Result.Failed);
        }
    }
    async close() {
        try {
            let that = this;
            return new Promise(function (resolve) {
                try {
                    that.connection.close();
                    resolve(enum_1.Result.Success);
                }
                catch (error) {
                    logger_service_1.Logger.error(error);
                    resolve(enum_1.Result.Failed);
                }
            });
        }
        catch (error) {
            logger_service_1.Logger.error(error);
            resolve(enum_1.Result.Failed);
        }
    }
}
module.exports = rabbitMQClient;
//# sourceMappingURL=rabbitMQClient.js.map