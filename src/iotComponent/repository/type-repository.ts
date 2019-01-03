import { IoTComponentType } from "../models/iot-component-type";
import { IRepository } from "../models/irepository";
import { Result } from "../models/enum";
import { Logger } from "../../common/logger.service";
import { DatabaseConfiguration, DBParameters } from "../models/database-configuration";
import { DatabaseService } from "./database.service";
import { KeyValue } from "../models/key-value";
import { DatabaseHelper } from "./database-helper";

export class IoTTypeRepository implements IRepository<IoTComponentType> {

  create(entity: IoTComponentType, params: KeyValue[]): Promise<Result> {
    throw new Error("Method not implemented.");
  }

  update(entity: IoTComponentType, params: KeyValue[]): Promise<Result> {
    throw new Error("Method not implemented.");
  }

  delete(entity: IoTComponentType, params: KeyValue[]): Promise<Result> {
    throw new Error("Method not implemented.");
  }

 async getAll(entity: IoTComponentType): Promise<any> {
    try {
      let tableName = DatabaseHelper.table_Prefex + entity.constructor.name;
      let attributesStr = await DatabaseHelper.getEntityAttributes(entity);

      let sqlCommand = `select ${attributesStr} from ${tableName}`;

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
    }
  }

  async get(entity: IoTComponentType, params: KeyValue[]): Promise<IoTComponentType> {
    try {
      let paramsArray = new Array<DBParameters>();
      let sqlCondition = new KeyValue('sqlCondition', '');
      await DatabaseHelper.prepareCondition(params, paramsArray, sqlCondition);

      let tableName = DatabaseHelper.table_Prefex + entity.constructor.name;
      let attributesStr = await DatabaseHelper.getEntityAttributes(entity);

      let sqlCommand = `select ${attributesStr} from ${tableName} ${sqlCondition.value}`;
      let databaseService = new DatabaseService();
      let config = new DatabaseConfiguration();

      await databaseService.open(config);

      let device = await databaseService.get(sqlCommand, paramsArray);

      if (device && device[0]) {
        return device[0];
      } else {
        return null;
      }
    } catch (error) {
      Logger.error(error);
    }
  }
}
