"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AJV = require('ajv');
const logger_service_1 = require("./logger.service");
const type_repository_1 = require("../iotComponent/repository/type-repository");
const iot_component_type_1 = require("../iotComponent/models/iot-component-type");
const key_value_1 = require("../iotcomponent/models/key-value");
const enum_1 = require("../iotComponent/models/enum");
class JsonValidator {
    constructor() { }
    async validate(object, iotType, propertyType) {
        try {
            let params = new Array();
            params.push(new key_value_1.KeyValue('TypeName', iotType));
            let typeRepo = new type_repository_1.IoTTypeRepository();
            let componentType = new iot_component_type_1.IoTComponentType();
            let result = await typeRepo.get(componentType, params);
            if (result) {
                let ajv = new AJV({
                    version: 'draft-06',
                    allErrors: true
                });
                let schema = propertyType == enum_1.PropertyType.Configuration ? JSON.parse(result.configurationSchema) : JSON.parse(result.reportedDataSchema);
                let validate = ajv.compile(schema);
                let valid = validate(object);
                if (valid) {
                    return true;
                }
                else {
                    console.log(validate.errors);
                    return false;
                }
            }
            else {
                return false;
            }
        }
        catch (error) {
            logger_service_1.Logger.error(error);
            return false;
        }
    }
}
exports.JsonValidator = JsonValidator;
//# sourceMappingURL=json.validator.service.js.map