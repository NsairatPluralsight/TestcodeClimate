import { Commands, Result, PropertyType } from '../models/enum';
import { Logger } from '../../common/logger.service';
import { DeviceRepository } from '../repository/device-repository';
import { EventsService } from '../../common/event';
import { ResponsePayload } from '../models/response-payload';
import { Message } from '../models/message';
import { KeyValue } from '../models/key-value';
import { JsonValidator } from '../../common/json.validator.service';

export class ReportsService {
  moduleName = "ComponentService/Report";
  broadcastTopic = "ComponentService.broadcast";
  reportTopicName = 'ComponentService/DeviceReport_Changed';

  /**
  * @summary handle the messages with sub topic 'Report'
  * @param {Message} message - the message that resieved from MQ with sub topic name 'Report'
  * @return {Promise<number>} Result enum wrapped in a promise.
  */
  async processMessageRequest(message: Message) {
    try {
      var command = message.topicName.replace(this.moduleName + "/", "");
      let result = Result.Failed;

      switch (command) {
        case Commands.SetReport:
          result = await this.setReport(message);
          break;
        case Commands.GetReport:
          result = await this.getReport(message);
          break;
      }
      return result;
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }

  /**
  * @summary set IOT device report by device ID
  * @param {Message} message - the message that resieved from MQ with sub topic name 'Report'
  * @return {Promise<number>} Result enum wrapped in a promise.
  */
  async setReport(message: Message) {
    try {
      let params = new Array<KeyValue>();
      if (message.payload.deviceID && message.payload.deviceID > 0) {
        params.push(new KeyValue('ID', message.payload.deviceID));
      }
      if (message.payload.typeName) {
        params.push(new KeyValue('TypeName', message.payload.typeName));
      }
      if (message.payload.data) {
        params.push(new KeyValue('ReportedData', message.payload.data));
      }

      let validator = new JsonValidator();
      let isValid = await validator.validate(JSON.parse(message.payload.data), message.payload.typeName, PropertyType.ReportedData);

      let result = Result.Failed;
      if (isValid) {
        let deviceRepo = new DeviceRepository();
        result = await deviceRepo.updateReport(params);

        if (result == Result.Success) {
          let broadcastMessage = new Message(this.moduleName);
          broadcastMessage.payload = message.payload;
          broadcastMessage.topicName = this.reportTopicName;

          let events = new EventsService();
          events.broadcastMessage.emit('event', this.broadcastTopic, broadcastMessage);
        }
      }

      let payload = new ResponsePayload();
      payload.result = result;
      message.payload = payload;
      return result;
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }

  /**
  * @summary get IOT device report by device ID
  * @param {Message} message - the message that resieved from MQ with sub topic name 'Report'
  * @return {Promise<number>} Result enum wrapped in a promise.
  */
  async getReport(message: Message) {
    try {
      let params = new Array<KeyValue>();
      if (message.payload.deviceID && message.payload.deviceID > 0) {
        params.push(new KeyValue('ID', message.payload.deviceID));
      }
      if (message.payload.typeName) {
        params.push(new KeyValue('TypeName', message.payload.typeName));
      }

      let deviceRepo = new DeviceRepository();
      let data = await deviceRepo.getReport(params);
      let payload = new ResponsePayload();

      if (data) {
        payload.data = data;
        payload.result = Result.Success;
      } else {
        payload.result = Result.Failed
      }
      message.payload = payload;

      return message.payload.result;
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }

}
