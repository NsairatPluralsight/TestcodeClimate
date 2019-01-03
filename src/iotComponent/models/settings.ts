export class Settings {
  RabbitMQconnectionCloud: string;
  RabbitMQconnection: string;
  sqldbConnection: any;
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
