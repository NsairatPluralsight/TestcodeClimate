"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_service_1 = require("../../common/logger.service");
const database_configuration_1 = require("../models/database-configuration");
const database_service_1 = require("./database.service");
const key_value_1 = require("../models/key-value");
const database_helper_1 = require("./database-helper");
class IoTTypeRepository {
    create(entity, params) {
        throw new Error("Method not implemented.");
    }
    update(entity, params) {
        throw new Error("Method not implemented.");
    }
    delete(entity, params) {
        throw new Error("Method not implemented.");
    }
    async getAll(entity) {
        try {
            let tableName = database_helper_1.DatabaseHelper.table_Prefex + entity.constructor.name;
            let attributesStr = await database_helper_1.DatabaseHelper.getEntityAttributes(entity);
            let sqlCommand = `select ${attributesStr} from ${tableName}`;
            let databaseService = new database_service_1.DatabaseService();
            let config = new database_configuration_1.DatabaseConfiguration();
            await databaseService.open(config);
            let devices = await databaseService.get(sqlCommand);
            if (devices && devices[0]) {
                return devices[0][database_helper_1.DatabaseHelper.jsonKey];
            }
            else {
                return null;
            }
        }
        catch (error) {
            logger_service_1.Logger.error(error);
        }
    }
    async get(entity, params) {
        try {
            let paramsArray = new Array();
            let sqlCondition = new key_value_1.KeyValue('sqlCondition', '');
            await database_helper_1.DatabaseHelper.prepareCondition(params, paramsArray, sqlCondition);
            let tableName = database_helper_1.DatabaseHelper.table_Prefex + entity.constructor.name;
            let attributesStr = await database_helper_1.DatabaseHelper.getEntityAttributes(entity);
            let sqlCommand = `select ${attributesStr} from ${tableName} ${sqlCondition.value}`;
            let databaseService = new database_service_1.DatabaseService();
            let config = new database_configuration_1.DatabaseConfiguration();
            await databaseService.open(config);
            let device = await databaseService.get(sqlCommand, paramsArray);
            if (device && device[0]) {
                return device[0];
            }
            else {
                return null;
            }
        }
        catch (error) {
            logger_service_1.Logger.error(error);
        }
    }
}
exports.IoTTypeRepository = IoTTypeRepository;
//# sourceMappingURL=type-repository.js.map