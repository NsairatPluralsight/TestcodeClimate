"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mssql = require("mssql");
const logger_service_1 = require("../../common/logger.service");
const enum_1 = require("../models/enum");
class DatabaseService {
    /**
    * @summary opens the connection to databse with retry logic
    * @param {DatabaseConfiguration} config - the databse config which contains its name and credentials
    */
    async open(config) {
        let tries = 3;
        while (tries > 0) {
            try {
                if (this.connection == null) {
                    this.connection = await (new mssql.ConnectionPool(config).connect());
                }
                return;
            }
            catch (error) {
                this.connection.close();
                this.connection = undefined;
                logger_service_1.Logger.error(error);
            }
            finally {
                tries -= 1;
            }
        }
    }
    /**
    * @summary excute sql query, use it for select statments
    * @param {string} command - the sql query
    * @param {Array<DBParameters>} params - optonal, the paramters for the sql query
    * @returns {Promise<mssql.IRecordSet<any>>} - set of records wrapped in a promise.
    */
    async get(command, params) {
        try {
            let request = this.addParameters(params);
            let result = await request.query(command).catch(err => { throw new Error(err.message); });
            if (result) {
                return result.recordset;
            }
        }
        catch (error) {
            logger_service_1.Logger.error(error);
        }
    }
    /**
   * @summary calls an sql procedure, use it for Update and Insert statments
   * @param {string} procedure - the sql procedure name
   * @param {Array<DBParameters>} params - optonal, the paramters for the sql query
   * @return {Promise<Result>} Result enum wrapped in a promise.
   */
    async executeProcedure(procedure, params) {
        try {
            let result = enum_1.Result.Failed;
            let request = this.addParameters(params);
            let dbResult = await request.execute(procedure).catch(err => { throw new Error(err.message); });
            if (dbResult.rowsAffected.length > 0) {
                if (dbResult.rowsAffected[0] > 0) {
                    result = enum_1.Result.Success;
                }
            }
            return result;
        }
        catch (error) {
            logger_service_1.Logger.error(error);
        }
    }
    /**
    * @summary creates new mssql.Request object and appends the paramters to it
    * @param {Array<DBParameters>} params - the paramters for the sql query
    * @return {mssql.Request} - return Mmssql request that contains the sent parameters.
    */
    addParameters(parmeters) {
        try {
            let request = new mssql.Request(this.connection);
            if (parmeters && parmeters.length > 0) {
                parmeters.forEach(element => {
                    request.input(element.key, element.type, element.value);
                });
            }
            return request;
        }
        catch (error) {
            logger_service_1.Logger.error(error);
        }
    }
    /**
    * @summary closes the connection with databse
    */
    close() {
        try {
            if (this.connection != null) {
                return this.connection.close();
            }
        }
        catch (error) {
            logger_service_1.Logger.error(error);
        }
    }
    ;
}
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=database.service.js.map