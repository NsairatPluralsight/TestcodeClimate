"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Commands;
(function (Commands) {
    Commands["SetConfig"] = "SetConfig";
    Commands["GetConfig"] = "GetConfig";
    Commands["SetReport"] = "SetReport";
    Commands["GetReport"] = "GetReport";
    Commands["GetDevices"] = "GetDevices";
    Commands["GetDevice"] = "GetDevice";
    Commands["ExecuteCommand"] = "ExecuteCommand";
})(Commands = exports.Commands || (exports.Commands = {}));
;
var Result;
(function (Result) {
    Result[Result["Success"] = 0] = "Success";
    Result[Result["Failed"] = -1] = "Failed";
})(Result = exports.Result || (exports.Result = {}));
;
var DBProcedures;
(function (DBProcedures) {
    DBProcedures["IoTComponentInsert"] = "SP_IoTComponent_Insert";
    DBProcedures["IoTComponentUpdateConfiguration"] = "SP_IoTComponent_UpdateConfiguration";
    DBProcedures["IoTComponentUpdateReported"] = "SP_IoTComponent_UpdateReported";
})(DBProcedures = exports.DBProcedures || (exports.DBProcedures = {}));
var PropertyType;
(function (PropertyType) {
    PropertyType[PropertyType["Configuration"] = 0] = "Configuration";
    PropertyType[PropertyType["ReportedData"] = 1] = "ReportedData";
})(PropertyType = exports.PropertyType || (exports.PropertyType = {}));
//# sourceMappingURL=enum.js.map