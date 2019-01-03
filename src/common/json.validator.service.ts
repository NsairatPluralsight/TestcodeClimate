var AJV = require('ajv');
import { Logger } from './logger.service';
import { IoTTypeRepository } from '../iotComponent/repository/type-repository';
import { IoTComponentType } from '../iotComponent/models/iot-component-type';
import { KeyValue } from '../iotcomponent/models/key-value';
import { PropertyType } from '../iotComponent/models/enum';

export class JsonValidator {

  constructor() {}

  async validate(object: any, iotType: string, propertyType: PropertyType) {
    try {
      let params = new Array<KeyValue>();
      params.push(new KeyValue('TypeName', iotType));

      let typeRepo = new IoTTypeRepository();
      let componentType = new IoTComponentType();
      let result = await typeRepo.get(componentType, params);

      if(result) {

        let ajv = new AJV({
          version: 'draft-06',
          allErrors: true
        });

        let schema = propertyType == PropertyType.Configuration ? JSON.parse(result.configurationSchema) : JSON.parse(result.reportedDataSchema);
        let validate = ajv.compile(schema);
        let valid = validate(object);

        if(valid) {
          return true;
        } else {
          console.log(validate.errors);
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }
}
