"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enum_1 = require("../models/enum");
const logger_service_1 = require("../../common/logger.service");
const device_repository_1 = require("../repository/device-repository");
const event_1 = require("../../common/event");
const response_payload_1 = require("../models/response-payload");
const message_1 = require("../models/message");
const key_value_1 = require("../models/key-value");
const json_validator_service_1 = require("../../common/json.validator.service");
class ReportsService {
    constructor() {
        this.moduleName = "ComponentService/Report";
        this.broadcastTopic = "ComponentService.broadcast";
        this.reportTopicName = 'ComponentService/DeviceReport_Changed';
    }
    /**
    * @summary handle the messages with sub topic 'Report'
    * @param {Message} message - the message that resieved from MQ with sub topic name 'Report'
    * @return {Promise<number>} Result enum wrapped in a promise.
    */
    async processMessageRequest(message) {
        try {
            var command = message.topicName.replace(this.moduleName + "/", "");
            let result = enum_1.Result.Failed;
            switch (command) {
                case enum_1.Commands.SetReport:
                    result = await this.setReport(message);
                    break;
                case enum_1.Commands.GetReport:
                    result = await this.getReport(message);
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
    * @summary set IOT device report by device ID
    * @param {Message} message - the message that resieved from MQ with sub topic name 'Report'
    * @return {Promise<number>} Result enum wrapped in a promise.
    */
    async setReport(message) {
        try {
            let params = new Array();
            if (message.payload.deviceID && message.payload.deviceID > 0) {
                params.push(new key_value_1.KeyValue('ID', message.payload.deviceID));
            }
            if (message.payload.typeName) {
                params.push(new key_value_1.KeyValue('TypeName', message.payload.typeName));
            }
            if (message.payload.data) {
                params.push(new key_value_1.KeyValue('ReportedData', message.payload.data));
            }
            let validator = new json_validator_service_1.JsonValidator();
            let isValid = await validator.validate(JSON.parse(message.payload.data), message.payload.typeName, enum_1.PropertyType.ReportedData);
            let result = enum_1.Result.Failed;
            if (isValid) {
                let deviceRepo = new device_repository_1.DeviceRepository();
                result = await deviceRepo.updateReport(params);
                if (result == enum_1.Result.Success) {
                    let broadcastMessage = new message_1.Message(this.moduleName);
                    broadcastMessage.payload = message.payload;
                    broadcastMessage.topicName = this.reportTopicName;
                    let events = new event_1.EventsService();
                    events.broadcastMessage.emit('event', this.broadcastTopic, broadcastMessage);
                }
            }
            let payload = new response_payload_1.ResponsePayload();
            payload.result = result;
            message.payload = payload;
            return result;
        }
        catch (error) {
            logger_service_1.Logger.error(error);
            return enum_1.Result.Failed;
        }
    }
    /**
    * @summary get IOT device report by device ID
    * @param {Message} message - the message that resieved from MQ with sub topic name 'Report'
    * @return {Promise<number>} Result enum wrapped in a promise.
    */
    async getReport(message) {
        try {
            let params = new Array();
            if (message.payload.deviceID && message.payload.deviceID > 0) {
                params.push(new key_value_1.KeyValue('ID', message.payload.deviceID));
            }
            if (message.payload.typeName) {
                params.push(new key_value_1.KeyValue('TypeName', message.payload.typeName));
            }
            let deviceRepo = new device_repository_1.DeviceRepository();
            let data = await deviceRepo.getReport(params);
            let payload = new response_payload_1.ResponsePayload();
            if (data) {
                payload.data = data;
                payload.result = enum_1.Result.Success;
            }
            else {
                payload.result = enum_1.Result.Failed;
            }
            message.payload = payload;
            return message.payload.result;
        }
        catch (error) {
            logger_service_1.Logger.error(error);
            return enum_1.Result.Failed;
        }
    }
}
exports.ReportsService = ReportsService;
//# sourceMappingURL=reports.service.js.map