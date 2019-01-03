"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enum_1 = require("../models/enum");
const logger_service_1 = require("../../common/logger.service");
class DataService {
    constructor() {
        this.ModuleName = "ComponentService/Data";
        this.logger = new logger_service_1.Logger();
    }
    /**
    * @summary handle the messages with sub topic 'Data'
    * @param {Message} message - the message that resieved from MQ with sub topic name 'Data'
    * @return {Promise<number>} Result enum wrapped in a promise.
    */
    async processMessageRequest(message) {
        try {
            let result = enum_1.Result.Failed;
            // result = await this.loadEntities(message);
            return result;
        }
        catch (error) {
            this.logger.error(error);
            return enum_1.Result.Failed;
        }
    }
}
exports.DataService = DataService;
//# sourceMappingURL=data.service.js.map