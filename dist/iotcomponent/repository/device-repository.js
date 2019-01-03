"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enum_1 = require("../models/enum");
const logger_service_1 = require("../../common/logger.service");
const database_service_1 = require("./database.service");
const database_configuration_1 = require("../models/database-configuration");
const key_value_1 = require("../models/key-value");
const mssql = require("mssql");
const database_helper_1 = require("./database-helper");
class DeviceRepository {
    constructor() { }
    /**
    * @summary inserts new IoTComponent
    * @param {IoTComponent} entity - the new IoT Device
    * @returns {Promise<Result>} - Result enum wrapped in a promise.
    */
    async create(entity) {
        try {
            let paramsArray = new Array();
            paramsArray.push(new database_configuration_1.DBParameters('OrgID', entity.orgID.toString(), mssql.BigInt));
            paramsArray.push(new database_configuration_1.DBParameters('TypeName', entity.typeName, mssql.NVarChar));
            paramsArray.push(new database_configuration_1.DBParameters('Name_L1', entity.name_L1, mssql.NVarChar));
            paramsArray.push(new database_configuration_1.DBParameters('Name_L2', entity.name_L2, mssql.NVarChar));
            paramsArray.push(new database_configuration_1.DBParameters('Name_L3', entity.name_L3, mssql.NVarChar));
            paramsArray.push(new database_configuration_1.DBParameters('Name_L4', entity.name_L4, mssql.NVarChar));
            paramsArray.push(new database_configuration_1.DBParameters('QueueBranch_ID', entity.queueBranch_ID.toString(), mssql.BigInt));
            paramsArray.push(new database_configuration_1.DBParameters('ClassName', entity.className, mssql.NVarChar));
            paramsArray.push(new database_configuration_1.DBParameters('RelatedObject_ID', entity.relatedObject_ID.toString(), mssql.BigInt));
            paramsArray.push(new database_configuration_1.DBParameters('Identity', entity.identity, mssql.NVarChar));
            paramsArray.push(new database_configuration_1.DBParameters('Address', entity.address, mssql.NVarChar));
            paramsArray.push(new database_configuration_1.DBParameters('Description', entity.description, mssql.NVarChar));
            let databaseService = new database_service_1.DatabaseService();
            let config = new database_configuration_1.DatabaseConfiguration();
            await databaseService.open(config);
            let result = await databaseService.executeProcedure(enum_1.DBProcedures.IoTComponentInsert, paramsArray);
            if (result == enum_1.Result.Failed) {
                return enum_1.Result.Failed;
            }
            else {
                return enum_1.Result.Success;
            }
        }
        catch (error) {
            logger_service_1.Logger.error(error);
        }
    }
    /**
    * @summary get a list of IoT component devices
    * @param {IoTComponent} entity - entity
    * @param {Array<KeyValue>} params - the paramters for the sql query
    * @returns {Promise<any>} - list of IoT component devices as JSON string.
    */
    async getAll(entity) {
        try {
            let tableName = database_helper_1.DatabaseHelper.table_Prefex + entity.constructor.name;
            let attributesStr = await database_helper_1.DatabaseHelper.getEntityAttributes(entity);
            let sqlCommand = `select ${attributesStr} from ${tableName} FOR JSON AUTO`;
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
            return null;
        }
    }
    /**
    * @summary get an IoT device
    * @param {IoTComponent} entity - entity
    * @param {Array<KeyValue>} params - the paramters for the sql query
    * @returns {Promise<any>} - IoT component device as JSON string.
    */
    async get(entity, params) {
        try {
            let paramsArray = new Array();
            let sqlCondition = new key_value_1.KeyValue('sqlCondition', '');
            await database_helper_1.DatabaseHelper.prepareCondition(params, paramsArray, sqlCondition);
            let tableName = database_helper_1.DatabaseHelper.table_Prefex + entity.constructor.name;
            let attributesStr = await database_helper_1.DatabaseHelper.getEntityAttributes(entity);
            let sqlCommand = `select ${attributesStr} from ${tableName} ${sqlCondition.value} FOR JSON AUTO`;
            let databaseService = new database_service_1.DatabaseService();
            let config = new database_configuration_1.DatabaseConfiguration();
            await databaseService.open(config);
            let device = await databaseService.get(sqlCommand, paramsArray);
            if (device && device[0]) {
                return device[0][database_helper_1.DatabaseHelper.jsonKey];
            }
            else {
                return null;
            }
        }
        catch (error) {
            logger_service_1.Logger.error(error);
            return null;
        }
    }
    /**
    * @summary get an IoT device Configuuration
    * @param {IoTComponent} entity - entity
    * @param {Array<KeyValue>} params - the paramters for the sql query
    * @returns {Promise<any>} - IoT component device configuration as JSON string.
    */
    async getConfig(params) {
        try {
            let paramsArray = new Array();
            let sqlCondition = new key_value_1.KeyValue('sqlCondition', '');
            await database_helper_1.DatabaseHelper.prepareCondition(params, paramsArray, sqlCondition);
            let sqlCommand = `select configuration from T_IoTComponent ${sqlCondition.value} FOR JSON AUTO`;
            let databaseService = new database_service_1.DatabaseService();
            let config = new database_configuration_1.DatabaseConfiguration();
            await databaseService.open(config);
            let deviceConfig = await databaseService.get(sqlCommand, paramsArray);
            if (deviceConfig && deviceConfig[0]) {
                return deviceConfig[0][database_helper_1.DatabaseHelper.jsonKey];
            }
            else {
                return null;
            }
        }
        catch (error) {
            logger_service_1.Logger.error(error);
            return null;
        }
    }
    /**
    * @summary get an IoT device Report
    * @param {IoTComponent} entity - entity
    * @param {Array<KeyValue>} params - the paramters for the sql query
    * @returns {Promise<any>} - IoT component device Report as JSON string.
    */
    async getReport(params) {
        try {
            let paramsArray = new Array();
            let sqlCondition = new key_value_1.KeyValue('sqlCondition', '');
            await database_helper_1.DatabaseHelper.prepareCondition(params, paramsArray, sqlCondition);
            let sqlCommand = `select reported from T_IoTComponent ${sqlCondition.value} FOR JSON AUTO`;
            let databaseService = new database_service_1.DatabaseService();
            let config = new database_configuration_1.DatabaseConfiguration();
            await databaseService.open(config);
            let deviceReport = await databaseService.get(sqlCommand, paramsArray);
            if (deviceReport && deviceReport[0]) {
                return deviceReport[0][database_helper_1.DatabaseHelper.jsonKey];
            }
            else {
                return null;
            }
        }
        catch (error) {
            logger_service_1.Logger.error(error);
            return null;
        }
    }
    /**
    * @summary update an IoT device Configuration
    * @param {Array<KeyValue>} params - the paramters for the sql query
    * @returns {Promise<Result>} - Result enum wrapped in a promise.
    */
    async updateConfig(params) {
        try {
            let paramsArray = new Array();
            paramsArray.push(new database_configuration_1.DBParameters('ID', params.find(e => e.key === 'ID').value, mssql.BigInt));
            paramsArray.push(new database_configuration_1.DBParameters('TypeName', params.find(e => e.key === 'TypeName').value, mssql.NVarChar));
            paramsArray.push(new database_configuration_1.DBParameters('Configuration', params.find(e => e.key === 'Configuration').value, mssql.NVarChar));
            let databaseService = new database_service_1.DatabaseService();
            let configDB = new database_configuration_1.DatabaseConfiguration();
            await databaseService.open(configDB);
            let result = await databaseService.executeProcedure(enum_1.DBProcedures.IoTComponentUpdateConfiguration, paramsArray);
            if (result == enum_1.Result.Failed) {
                return enum_1.Result.Failed;
            }
            else {
                return enum_1.Result.Success;
            }
        }
        catch (error) {
            logger_service_1.Logger.error(error);
            return enum_1.Result.Failed;
        }
    }
    /**
    * @summary update an IoT device Report
    * @param {Array<KeyValue>} params - the paramters for the sql query
    * @returns {Promise<Result>} - Result enum wrapped in a promise.
    */
    async updateReport(params) {
        try {
            let paramsArray = new Array();
            paramsArray.push(new database_configuration_1.DBParameters('ID', params.find(e => e.key === 'ID').value, mssql.BigInt));
            paramsArray.push(new database_configuration_1.DBParameters('TypeName', params.find(e => e.key === 'TypeName').value, mssql.NVarChar));
            paramsArray.push(new database_configuration_1.DBParameters('ReportedData', params.find(e => e.key === 'ReportedData').value, mssql.NVarChar));
            let databaseService = new database_service_1.DatabaseService();
            let config = new database_configuration_1.DatabaseConfiguration();
            await databaseService.open(config);
            let result = await databaseService.executeProcedure(enum_1.DBProcedures.IoTComponentUpdateReported, paramsArray);
            if (result == enum_1.Result.Failed) {
                return enum_1.Result.Failed;
            }
            else {
                return enum_1.Result.Success;
            }
        }
        catch (error) {
            logger_service_1.Logger.error(error);
            return enum_1.Result.Failed;
        }
    }
    /**
    * @summary delete an IoT device
    * @param {IoTComponent} entity - entity
    * @param {Array<KeyValue>} params - the paramters for the sql query
    * @returns {Promise<Result>} - Result enum wrapped in a promise.
    */
    async delete(entity, params) {
        try {
            let paramsArray = new Array();
            paramsArray.push(new database_configuration_1.DBParameters('ID', params.find(e => e.key === 'ID').value, mssql.BigInt));
            let tableName = database_helper_1.DatabaseHelper.table_Prefex + entity.constructor.name;
            let sqlCommand = `delete from ${tableName} where ID IN (@ID)`;
            let databaseService = new database_service_1.DatabaseService();
            let config = new database_configuration_1.DatabaseConfiguration();
            await databaseService.open(config);
            let result = await databaseService.get(sqlCommand, paramsArray);
            if (result) {
                return enum_1.Result.Failed;
            }
            else {
                return enum_1.Result.Success;
            }
        }
        catch (error) {
            logger_service_1.Logger.error(error);
            return enum_1.Result.Failed;
        }
    }
    update(entity, params) {
        throw new Error("Method not implemented.");
    }
}
exports.DeviceRepository = DeviceRepository;
//# sourceMappingURL=device-repository.js.map