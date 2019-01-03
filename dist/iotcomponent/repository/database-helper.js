"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_service_1 = require("../../common/logger.service");
const database_configuration_1 = require("../models/database-configuration");
const mssql = require("mssql");
class DatabaseHelper {
    /**
   * @summary extract the attribute names of an entity
   * @param {any} entity - entity
   * @returns {string} - attribute as CSV .
   */
    static async getEntityAttributes(entity) {
        try {
            let attributes = Object.getOwnPropertyNames(entity);
            attributes = attributes.filter((value) => { return !value.startsWith("_"); });
            attributes = attributes.map((value) => { return `[${value}]`; });
            let attributesStr = attributes.join(",");
            return attributesStr;
        }
        catch (error) {
            logger_service_1.Logger.error(error);
        }
    }
    static async prepareCondition(params, dbParameters, condition) {
        try {
            condition.value = 'where ';
            params.forEach(element => {
                condition.value += `${element.key} = @${element.key} and `;
                dbParameters.push(new database_configuration_1.DBParameters(element.key, element.value, this.getDBType(element.key)));
            });
            condition.value = condition.value.substring(0, condition.value.lastIndexOf('and'));
        }
        catch (error) {
            logger_service_1.Logger.error(error);
        }
    }
    static getDBType(key) {
        try {
            switch (key) {
                case 'QueueBranch_ID':
                case 'RelatedObject_ID':
                case 'OrgID':
                    return mssql.BigInt;
                case 'TypeName':
                case 'Name_L1':
                case 'Name_L2':
                case 'Name_L3':
                case 'Name_L4':
                case 'ReportedData':
                case 'Configuration':
                case 'ClassName':
                case 'Identity':
                case 'Address':
                case 'Description':
                case 'CaptionKey':
                case 'ConfigurationSchema':
                case 'ReportedDataSchema':
                    return mssql.NVarChar;
            }
        }
        catch (error) {
            logger_service_1.Logger.error(error);
        }
    }
}
DatabaseHelper.table_Prefex = "t_";
DatabaseHelper.jsonKey = "JSON_F52E2B61-18A1-11d1-B105-00805F49916B";
exports.DatabaseHelper = DatabaseHelper;
//# sourceMappingURL=database-helper.js.map