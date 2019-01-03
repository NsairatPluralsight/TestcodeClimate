"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const key_value_1 = require("./key-value");
class DatabaseConfiguration {
    constructor() {
        this.user = "sa";
        this.password = "sedco@123";
        this.server = "M-KHALAF";
        this.database = "CVMDB";
    }
}
exports.DatabaseConfiguration = DatabaseConfiguration;
class DBResult {
}
exports.DBResult = DBResult;
class DBParameters extends key_value_1.KeyValue {
    constructor(pKey, pValue, pType) {
        super(pKey, pValue);
        this.type = pType;
    }
}
exports.DBParameters = DBParameters;
//# sourceMappingURL=database-configuration.js.map