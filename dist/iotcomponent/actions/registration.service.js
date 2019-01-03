"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enum_1 = require("../models/enum");
const logger_service_1 = require("../../common/logger.service");
const device_repository_1 = require("../repository/device-repository");
const iot_component_1 = require("../models/iot-component");
const response_payload_1 = require("../models/response-payload");
class RegistrationService {
    constructor() {
        this.ModuleName = "ComponentService/Registration";
    }
    /**
  * @summary handle the messages with sub topic 'Registration'
  * @param {Message} message - the message that resieved from MQ with sub topic name 'Registration'
  * @return {Promise<Result>} Result enum wrapped in a promise.
  */
    async registerDevice(message) {
        try {
            var command = message.topicName.replace(this.ModuleName + "/", "");
            let result = enum_1.Result.Failed;
            result = await this.addDevice(message);
            return result;
        }
        catch (error) {
            logger_service_1.Logger.error(error);
            return enum_1.Result.Failed;
        }
    }
    /**
 * @async
 * @summary Add new IoT device based on the data in message
 * @param {Message} message - the message that resieved from MQ with sub topic name 'Registration'
 * @return {Promise<Result>} Result enum wrapped in a promise.
 */
    async addDevice(message) {
        try {
            let device = JSON.parse(message.payload.data);
            let IoTDevice = new iot_component_1.IoTComponent();
            IoTDevice.orgID = device.orgID;
            IoTDevice.typeName = device.typeName;
            IoTDevice.name_L1 = device.name_L1;
            IoTDevice.name_L2 = device.name_L2;
            IoTDevice.name_L3 = device.name_L3;
            IoTDevice.name_L4 = device.name_L4;
            IoTDevice.queueBranch_ID = device.queueBranch_ID;
            if (device.className) {
                IoTDevice.className = device.className;
                IoTDevice.relatedObject_ID = device.relatedObject_ID;
            }
            IoTDevice.identity = device.identity;
            IoTDevice.address = device.address;
            let deviceRepo = new device_repository_1.DeviceRepository();
            let result = await deviceRepo.create(IoTDevice);
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
}
exports.RegistrationService = RegistrationService;
//# sourceMappingURL=registration.service.js.map