"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enum_1 = require("../models/enum");
const logger_service_1 = require("../../common/logger.service");
const device_repository_1 = require("../repository/device-repository");
const iot_component_1 = require("../models/iot-component");
const event_1 = require("../../common/event");
const key_value_1 = require("../models/key-value");
const response_payload_1 = require("../models/response-payload");
const message_1 = require("../models/message");
const json_validator_service_1 = require("../../common/json.validator.service");
class ConfigurationService {
    constructor() {
        this.moduleName = 'ComponentService/Configuration';
        this.broadcastTopic = 'ComponentService.broadcast';
        this.configurationTopicName = 'ComponentService/DeviceConfiguration_Changed';
        this.executeCommandTopicName = 'ComponentService/ExecuteCommand';
    }
    /**
    * @summary handle the messages with sub topic 'Configuration'
    * @param {Message} message - the message that resieved from MQ with sub topic name 'Configuration'
    * @return {Promise<Result>} Result enum wrapped in a promise.
    */
    async processMessageRequest(message) {
        try {
            var command = message.topicName.replace(this.moduleName + "/", "");
            let result = enum_1.Result.Failed;
            switch (command) {
                case enum_1.Commands.GetDevices:
                    result = await this.getIoTDevices(message);
                    break;
                case enum_1.Commands.GetDevice:
                    result = await this.getIoTDevice(message);
                    break;
                case enum_1.Commands.SetConfig:
                    result = await this.setConfig(message);
                    break;
                case enum_1.Commands.GetConfig:
                    result = await this.getConfig(message);
                    break;
                case enum_1.Commands.ExecuteCommand:
                    result = await this.executeCommand(message);
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
    * @summary get list of IOT devices base on the device type and branch ID
    * @param {Message} message - the message that resieved from MQ with sub topic name 'Configuration'
    * @return {Promise<Result>} Result enum wrapped in a promise.
    */
    async getIoTDevices(message) {
        try {
            let deviceRepo = new device_repository_1.DeviceRepository();
            let component = new iot_component_1.IoTComponent();
            let data = await deviceRepo.getAll(component);
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
    /**
    * @summary get a one device of IOT devices by device ID
    * @param {Message} message - the message that resieved from MQ with sub topic name 'Configuration'
    * @return {Promise<Result>} Result enum wrapped in a promise.
    */
    async getIoTDevice(message) {
        try {
            let params = new Array();
            if (message.payload.deviceID && message.payload.deviceID > 0) {
                params.push(new key_value_1.KeyValue('ID', message.payload.deviceID));
            }
            if (message.payload.branchID && message.payload.branchID > 0) {
                params.push(new key_value_1.KeyValue('QueueBranch_ID', message.payload.branchID));
            }
            if (message.payload.typeName) {
                params.push(new key_value_1.KeyValue('TypeName', message.payload.typeName));
            }
            let deviceRepo = new device_repository_1.DeviceRepository();
            let data = await deviceRepo.get(new iot_component_1.IoTComponent(), params);
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
    /**
    * @summary set IOT device config by device ID
    * @param {Message} message - the message that resieved from MQ with sub topic name 'Configuration'
    * @return {Promise<Result>} Result enum wrapped in a promise.
    */
    async setConfig(message) {
        try {
            let params = new Array();
            if (message.payload.deviceID && message.payload.deviceID > 0) {
                params.push(new key_value_1.KeyValue('ID', message.payload.deviceID));
            }
            if (message.payload.typeName) {
                params.push(new key_value_1.KeyValue('TypeName', message.payload.typeName));
            }
            if (message.payload.data) {
                params.push(new key_value_1.KeyValue('Configuration', message.payload.data));
            }
            let validator = new json_validator_service_1.JsonValidator();
            let isValid = await validator.validate(JSON.parse(message.payload.data), message.payload.typeName, enum_1.PropertyType.Configuration);
            let result = enum_1.Result.Failed;
            if (isValid) {
                let deviceRepo = new device_repository_1.DeviceRepository();
                result = await deviceRepo.updateConfig(params);
                if (result == enum_1.Result.Success) {
                    this.broadcastMessage(this.configurationTopicName, message);
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
    * @summary get IOT device config by device ID
    * @param {Message} message - the message that resieved from MQ with sub topic name 'Configuration'
    * @return {Promise<Result>} Result enum wrapped in a promise.
    */
    async getConfig(message) {
        try {
            let params = new Array();
            if (message.payload.deviceID && message.payload.deviceID > 0) {
                params.push(new key_value_1.KeyValue('ID', message.payload.deviceID));
            }
            if (message.payload.typeName) {
                params.push(new key_value_1.KeyValue('TypeName', message.payload.typeName));
            }
            let deviceRepo = new device_repository_1.DeviceRepository();
            let data = await deviceRepo.getConfig(params);
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
    /**
    * @summary broadcast a message to the IOT component
    * @param {Message} message - the message that resieved from client
    * @return {Promise<Result>} Result enum wrapped in a promise.
    */
    async executeCommand(message) {
        try {
            let result = await this.broadcastMessage(this.executeCommandTopicName, message);
            let payload = new response_payload_1.ResponsePayload();
            if (result) {
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
    /**
   * @summary broadcast a message on the IOT component
   * @param {Message} topic - the message topic to broadcast on
   * @param {Message} message - the message that resieved from client
   * @return {Promise<boolean>} boolean wrapped in a promise.
   */
    async broadcastMessage(topic, message) {
        try {
            let broadcastMessage = new message_1.Message(this.moduleName);
            broadcastMessage.payload = message.payload;
            broadcastMessage.topicName = topic;
            let events = new event_1.EventsService();
            let result = events.broadcastMessage.emit('event', this.broadcastTopic, broadcastMessage);
            return result;
        }
        catch (error) {
            logger_service_1.Logger.error(error);
            return false;
        }
    }
}
exports.ConfigurationService = ConfigurationService;
//# sourceMappingURL=configuration.service.js.map