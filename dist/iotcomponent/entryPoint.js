"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enum_1 = require("./models/enum");
const logger_service_1 = require("../common/logger.service");
const reports_service_1 = require("./actions/reports.service");
const configuration_service_1 = require("./actions/configuration.service");
const registration_service_1 = require("./actions/registration.service");
const event_1 = require("../common/event");
const message_1 = require("./models/message");
const guid_1 = require("./models/guid");
var rabbitMQClient = require("../rabbitMQClient");
class EntryPoint {
    constructor() {
        this.keys = ["ComponentService.*"];
        this.queueName = "ComponentService";
        this.topicPrefix = "CVMServer/";
        this.sourceID = '';
        this.rabbitMQClient = new rabbitMQClient(this.queueName, this.keys);
    }
    /**
    * @async
    * @summary intialaize rabbit MQ client start listining to the ComponentService queue
    */
    async start() {
        let that = this;
        this.rabbitMQClient.receive(async (request, replay) => { await this.processRequest(request, replay); });
        let events = new event_1.EventsService();
        events.broadcastMessage.on('event', this.broadcastMessage);
    }
    /**
    * @async
    * @summary call back method to handle the resieved messages
    * @returns {Promise<Result>} Result enum wrapped in a promise.
    */
    async processRequest(request, reply) {
        try {
            let result = enum_1.Result.Failed;
            let topic = request.topicName.split("/")[1];
            switch (topic) {
                case "Registration":
                    let registration = new registration_service_1.RegistrationService();
                    result = await registration.registerDevice(request);
                    reply = request;
                    break;
                case 'Configuration':
                    let configuration = new configuration_service_1.ConfigurationService();
                    result = await configuration.processMessageRequest(request);
                    reply = request;
                    break;
                case 'Report':
                    let reports = new reports_service_1.ReportsService();
                    result = await reports.processMessageRequest(request);
                    reply = request;
                    break;
                case "Data":
                    result = await this.loadEntities(request);
                    reply = request;
                    break;
            }
            return result;
        }
        catch (error) {
            logger_service_1.Logger.error(error);
            return enum_1.Result.Failed;
        }
    }
    /**
    * @async
    * @summary call back method to handle the broadcasts messages
    * @returns {Promise<Result>} Result enum wrapped in a promise.
    */
    async broadcastMessage(broadcastTopic, request) {
        try {
            let result = await this.rabbitMQClient.sendBroadcast(broadcastTopic, JSON.stringify(request));
            return result;
        }
        catch (error) {
            logger_service_1.Logger.error(error);
            return enum_1.Result.Failed;
        }
    }
    ;
    /**
    * @async
    * @summary sends a message to module using rabbit MQ Client
    * @returns {Promise<Result>} Result enum wrapped in a promise.
    */
    async sendToModule(payload, topic, moduleName, reply) {
        try {
            let message = new message_1.Message(this.getSourceId());
            message.topicName = topic;
            message.payload = payload;
            let reqMessage = JSON.stringify(message);
            let result = await this.rabbitMQClient.send(moduleName, reqMessage, reply);
            return result;
        }
        catch (error) {
            logger_service_1.Logger.error(error);
        }
    }
    /**
    * @async
    * @summary return a list of objects of a specific entitiy , full object or object only contains {ID , Name}
    * @param {string} entitieName - the entitie name you want to retrieve
    * @param {Message} message - the message that resieved from MQ with sub topic name 'Configuration'
    * @return {Promise<number>} Result enum wrapped in a promise.
    */
    async loadEntities(message) {
        try {
            let topicName = this.getModuleName(message.payload.target);
            // let result = await communicationService.getData(message.payload, moduleName, data);
            let data = new Array();
            let result = await this.sendToModule(message.payload, topicName, 'CVMServer', data);
            if (result == enum_1.Result.Success) {
                let response = JSON.parse(data[0]);
                if (response && response.payload) {
                    message.payload = response.payload;
                    result = enum_1.Result.Success;
                }
                else {
                    result = enum_1.Result.Failed;
                }
            }
            else {
                result = enum_1.Result.Failed;
            }
            return result;
        }
        catch (error) {
            logger_service_1.Logger.error(error);
            return enum_1.Result.Failed;
        }
    }
    /**
    * @summary return the module name as string
    * @param {string} target - the target name that contains module name
    * @return {Promise<string>} module name.
    */
    getModuleName(target) {
        try {
            var targetArr = target.split('.');
            var moduleName = this.topicPrefix + targetArr[0];
            return moduleName;
        }
        catch (error) {
            logger_service_1.Logger.error(error);
            return undefined;
        }
    }
    /**
    * @summary return a new guid if sourse is not defined
    * @return {string} guid.
    */
    getSourceId() {
        if (this.sourceID == undefined) {
            this.sourceID = new guid_1.Guid().Guid();
        }
        return this.sourceID;
    }
}
exports.EntryPoint = EntryPoint;
//# sourceMappingURL=entryPoint.js.map