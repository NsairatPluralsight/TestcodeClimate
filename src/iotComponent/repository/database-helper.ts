import { Logger } from "../../common/logger.service";
import { KeyValue } from "../models/key-value";
import { DBParameters } from "../models/database-configuration";
import * as mssql from 'mssql';

export class DatabaseHelper {
  static table_Prefex = "t_";
  static jsonKey = "JSON_F52E2B61-18A1-11d1-B105-00805F49916B";

    /**
   * @summary extract the attribute names of an entity
   * @param {any} entity - entity
   * @returns {string} - attribute as CSV .
   */
  static async getEntityAttributes(entity: any): Promise<string> {
    try {
      let attributes = Object.getOwnPropertyNames(entity);
      attributes = attributes.filter((value) => { return !value.startsWith("_"); });
      attributes = attributes.map((value) => { return `[${value}]`; });
      let attributesStr = attributes.join(",");
      return attributesStr;
    } catch (error) {
      Logger.error(error);
    }
  }

  static async prepareCondition(params: Array<KeyValue>, dbParameters: Array<DBParameters>, condition: KeyValue): Promise<void> {
    try {
      condition.value = 'where ';
      params.forEach(element => {
        condition.value += `${element.key} = @${element.key} and `;
        dbParameters.push(new DBParameters(element.key, element.value, this.getDBType(element.key)));
      });
      condition.value = condition.value.substring(0, condition.value.lastIndexOf('and'));
    } catch (error) {
      Logger.error(error);
    }
  }

  static getDBType(key: string): mssql.ISqlTypeFactoryWithNoParams {
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
    } catch (error) {
      Logger.error(error);
    }
  }
}
