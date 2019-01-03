"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    /**
    * @summary log error to the console
    * @param {error} error - the error that will be logged.
    */
    static error(error) {
        console.error('name: ' + error.name + ' message: ' + error.message + ' stack trace: ' + error.stack);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.service.js.map