import { Result, DBProcedures } from '../models/enum';
import { Logger } from '../../common/logger.service';
import { DatabaseService } from './database.service';
import { DatabaseConfiguration, DBParameters } from '../models/database-configuration';
import { IoTComponent } from '../models/iot-component';
import { KeyValue } from '../models/key-value';
import { IRepository } from '../models/irepository';
import * as mssql from 'mssql';
import { DatabaseHelper } from './database-helper';

export class DeviceRepository implements IRepository<IoTComponent> {
  constructor() { }

  /**
  * @summary inserts new IoTComponent
  * @param {IoTComponent} entity - the new IoT Device
  * @returns {Promise<Result>} - Result enum wrapped in a promise.
  */
  async create(entity: IoTComponent): Promise<Result> {
    try {
      let paramsArray = new Array<DBParameters>();
      paramsArray.push(new DBParameters('OrgID', entity.orgID.toString(), mssql.BigInt));
      paramsArray.push(new DBParameters('TypeName', entity.typeName, mssql.NVarChar));
      paramsArray.push(new DBParameters('Name_L1', entity.name_L1, mssql.NVarChar));
      paramsArray.push(new DBParameters('Name_L2', entity.name_L2, mssql.NVarChar));
      paramsArray.push(new DBParameters('Name_L3', entity.name_L3, mssql.NVarChar));
      paramsArray.push(new DBParameters('Name_L4', entity.name_L4, mssql.NVarChar));
      paramsArray.push(new DBParameters('QueueBranch_ID', entity.queueBranch_ID.toString(), mssql.BigInt));
      paramsArray.push(new DBParameters('ClassName', entity.className, mssql.NVarChar));
      paramsArray.push(new DBParameters('RelatedObject_ID', entity.relatedObject_ID.toString(), mssql.BigInt));
      paramsArray.push(new DBParameters('Identity', entity.identity, mssql.NVarChar));
      paramsArray.push(new DBParameters('Address', entity.address, mssql.NVarChar));
      paramsArray.push(new DBParameters('Description', entity.description, mssql.NVarChar));

      let databaseService = new DatabaseService();
      let config = new DatabaseConfiguration();
      await databaseService.open(config);

      let result = await databaseService.executeProcedure(DBProcedures.IoTComponentInsert, paramsArray);

      if (result == Result.Failed) {
        return Result.Failed;
      } else {
        return Result.Success;
      }
    } catch (error) {
      Logger.error(error);
    }
  }

  /**
  * @summary get a list of IoT component devices
  * @param {IoTComponent} entity - entity
  * @param {Array<KeyValue>} params - the paramters for the sql query
  * @returns {Promise<any>} - list of IoT component devices as JSON string.
  */
  async getAll(entity: IoTComponent): Promise<any> {
    try {
      let tableName = DatabaseHelper.table_Prefex + entity.constructor.name;
      let attributesStr = await DatabaseHelper.getEntityAttributes(entity);

      let sqlCommand = `select ${attributesStr} from ${tableName} FOR JSON AUTO`;

      let databaseService = new DatabaseService();
      let config = new DatabaseConfiguration();

      await databaseService.open(config);

      let devices = await databaseService.get(sqlCommand);

      if (devices && devices[0]) {
        return devices[0][DatabaseHelper.jsonKey];
      } else {
        return null;
      }
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }

  /**
  * @summary get an IoT device
  * @param {IoTComponent} entity - entity
  * @param {Array<KeyValue>} params - the paramters for the sql query
  * @returns {Promise<any>} - IoT component device as JSON string.
  */
  async get(entity: IoTComponent, params: Array<KeyValue>): Promise<any> {
    try {
      let paramsArray = new Array<DBParameters>();
      let sqlCondition = new KeyValue('sqlCondition', '');
      await DatabaseHelper.prepareCondition(params, paramsArray, sqlCondition);

      let tableName = DatabaseHelper.table_Prefex + entity.constructor.name;
      let attributesStr = await DatabaseHelper.getEntityAttributes(entity);

      let sqlCommand = `select ${attributesStr} from ${tableName} ${sqlCondition.value} FOR JSON AUTO`;
      let databaseService = new DatabaseService();
      let config = new DatabaseConfiguration();

      await databaseService.open(config);

      let device = await databaseService.get(sqlCommand, paramsArray);

      if (device && device[0]) {
        return device[0][DatabaseHelper.jsonKey];
      } else {
        return null;
      }
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }

  /**
  * @summary get an IoT device Configuuration
  * @param {IoTComponent} entity - entity
  * @param {Array<KeyValue>} params - the paramters for the sql query
  * @returns {Promise<any>} - IoT component device configuration as JSON string.
  */
  async getConfig(params: Array<KeyValue>): Promise<any> {
    try {
      let paramsArray = new Array<DBParameters>();
      let sqlCondition = new KeyValue('sqlCondition', '');
      await DatabaseHelper.prepareCondition(params, paramsArray, sqlCondition);

      let sqlCommand = `select configuration from T_IoTComponent ${sqlCondition.value} FOR JSON AUTO`;

      let databaseService = new DatabaseService();
      let config = new DatabaseConfiguration();

      await databaseService.open(config);
      let deviceConfig = await databaseService.get(sqlCommand, paramsArray);

      if (deviceConfig && deviceConfig[0]) {
        return deviceConfig[0][DatabaseHelper.jsonKey];
      } else {
        return null;
      }
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }

  /**
  * @summary get an IoT device Report
  * @param {IoTComponent} entity - entity
  * @param {Array<KeyValue>} params - the paramters for the sql query
  * @returns {Promise<any>} - IoT component device Report as JSON string.
  */
  async getReport(params: Array<KeyValue>): Promise<any> {
    try {
      let paramsArray = new Array<DBParameters>();
      let sqlCondition = new KeyValue('sqlCondition', '');
      await DatabaseHelper.prepareCondition(params, paramsArray, sqlCondition);

      let sqlCommand = `select reported from T_IoTComponent ${sqlCondition.value} FOR JSON AUTO`;
      let databaseService = new DatabaseService();
      let config = new DatabaseConfiguration();

      await databaseService.open(config);
      let deviceReport = await databaseService.get(sqlCommand, paramsArray);

      if (deviceReport && deviceReport[0]) {
        return deviceReport[0][DatabaseHelper.jsonKey];
      } else {
        return null;
      }
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }

  /**
  * @summary update an IoT device Configuration
  * @param {Array<KeyValue>} params - the paramters for the sql query
  * @returns {Promise<Result>} - Result enum wrapped in a promise.
  */
  async updateConfig(params: Array<KeyValue>): Promise<Result> {
    try {
      let paramsArray = new Array<DBParameters>();
      paramsArray.push(new DBParameters('ID', params.find(e => e.key === 'ID').value, mssql.BigInt));
      paramsArray.push(new DBParameters('TypeName', params.find(e => e.key === 'TypeName').value, mssql.NVarChar));
      paramsArray.push(new DBParameters('Configuration', params.find(e => e.key === 'Configuration').value, mssql.NVarChar));

      let databaseService = new DatabaseService();
      let configDB = new DatabaseConfiguration();

      await databaseService.open(configDB);
      let result = await databaseService.executeProcedure(DBProcedures.IoTComponentUpdateConfiguration, paramsArray);
      if (result == Result.Failed) {
        return Result.Failed;
      } else {
        return Result.Success;
      }
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }

  /**
  * @summary update an IoT device Report
  * @param {Array<KeyValue>} params - the paramters for the sql query
  * @returns {Promise<Result>} - Result enum wrapped in a promise.
  */
  async updateReport(params: Array<KeyValue>): Promise<Result> {
    try {
      let paramsArray = new Array<DBParameters>();
      paramsArray.push(new DBParameters('ID', params.find(e => e.key === 'ID').value, mssql.BigInt));
      paramsArray.push(new DBParameters('TypeName', params.find(e => e.key === 'TypeName').value, mssql.NVarChar));
      paramsArray.push(new DBParameters('ReportedData', params.find(e => e.key === 'ReportedData').value, mssql.NVarChar));

      let databaseService = new DatabaseService();
      let config = new DatabaseConfiguration();

      await databaseService.open(config);
      let result = await databaseService.executeProcedure(DBProcedures.IoTComponentUpdateReported, paramsArray);
      if (result == Result.Failed) {
        return Result.Failed;
      } else {
        return Result.Success;
      }
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }

  /**
  * @summary delete an IoT device
  * @param {IoTComponent} entity - entity
  * @param {Array<KeyValue>} params - the paramters for the sql query
  * @returns {Promise<Result>} - Result enum wrapped in a promise.
  */
  async delete(entity: IoTComponent, params: Array<KeyValue>): Promise<Result> {
    try {
      let paramsArray = new Array<DBParameters>();
      paramsArray.push(new DBParameters('ID', params.find(e => e.key === 'ID').value, mssql.BigInt));

      let tableName = DatabaseHelper.table_Prefex + entity.constructor.name;
      let sqlCommand = `delete from ${tableName} where ID IN (@ID)`;
      let databaseService = new DatabaseService();
      let config = new DatabaseConfiguration();

      await databaseService.open(config);
      let result = await databaseService.get(sqlCommand, paramsArray);
      if (result) {
        return Result.Failed;
      } else {
        return Result.Success;
      }
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }

  update(entity: IoTComponent, params: KeyValue[]): Promise<Result> {
    throw new Error("Method not implemented.");
  }
}
