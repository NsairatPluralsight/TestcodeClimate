"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Settings {
    constructor() {
        this.RabbitMQconnectionCloud = "amqp://vnojmzgd:p8afSb7X0JtGueCY0hLlfHrAf1oIBqQ_@woodpecker.rmq.cloudamqp.com/vnojmzgd";
        this.RabbitMQconnection = "amqp://guest:guest@localhost";
        this.sqldbConnection = {
            "user": "sa",
            "password": "sedco@123",
            "server": "M-KHALAF",
            "database": "CVMDB"
        };
    }
}
exports.Settings = Settings;
//# sourceMappingURL=settings.js.map