"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require('request');
const logger_service_1 = require("../../common/logger.service");
var rabbitMQClient = require('../../rabbitMQClient');
class CommunicationService {
    constructor() {
        this.keys = ["ComponentService.*"];
        this.queueName = "ComponentService";
        this.logger = new logger_service_1.Logger();
        // this.rabbitMQClient = new rabbitMQClient(this.queueName, this.keys);
    }
}
exports.CommunicationService = CommunicationService;
//# sourceMappingURL=communication.service.js.map