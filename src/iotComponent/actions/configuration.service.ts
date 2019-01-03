import { Commands, Result, PropertyType } from '../models/enum';
import { Logger } from '../../common/logger.service';
import { DeviceRepository } from '../repository/device-repository';
import { IoTComponent } from '../models/iot-component';
import { EventsService } from '../../common/event';
import { KeyValue } from '../models/key-value';
import { ResponsePayload } from '../models/response-payload';
import { Message } from '../models/message';
import { JsonValidator } from '../../common/json.validator.service';
import { IoTTypeRepository } from '../repository/type-repository';
import { IoTComponentType } from '../models/iot-component-type';

export class ConfigurationService {
  moduleName = 'ComponentService/Configuration';
  broadcastTopic = 'ComponentService.broadcast';
  configurationTopicName = 'ComponentService/DeviceConfiguration_Changed';
  executeCommandTopicName = 'ComponentService/ExecuteCommand';

  constructor() {
  }

  /**
  * @summary handle the messages with sub topic 'Configuration'
  * @param {Message} message - the message that resieved from MQ with sub topic name 'Configuration'
  * @return {Promise<Result>} Result enum wrapped in a promise.
  */
  async processMessageRequest(message: Message) {
    try {
      var command = message.topicName.replace(this.moduleName + "/", "");
      let result = Result.Failed;

      switch (command) {
        case Commands.GetDevices:
          result = await this.getIoTDevices(message);
          break;
        case Commands.GetDevice:
          result = await this.getIoTDevice(message);
          break;
        case Commands.SetConfig:
          result = await this.setConfig(message);
          break;
        case Commands.GetConfig:
          result = await this.getConfig(message);
          break;
        case Commands.ExecuteCommand:
          result = await this.executeCommand(message);
          break;
      }
      return result;
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }

  /**
  * @summary get list of IOT devices
  * @param {Message} message - the message that resieved from MQ with sub topic name 'Configuration'
  * @return {Promise<Result>} Result enum wrapped in a promise.
  */
  async getIoTDevices(message: Message) {
    try {
      let deviceRepo = new DeviceRepository();

      let component = new IoTComponent();
      let data = await deviceRepo.getAll(component);
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

  /**
  * @summary get a one or more of IOT devices
  * @param {Message} message - the message that resieved from MQ with sub topic name 'Configuration'
  * @return {Promise<Result>} Result enum wrapped in a promise.
  */
  async getIoTDevice(message: Message) {
    try {
      let params = new Array<KeyValue>();

      if(message.payload.deviceID && message.payload.deviceID > 0) {
        params.push(new KeyValue('ID', message.payload.deviceID));
      }
      if(message.payload.branchID && message.payload.branchID > 0) {
        params.push(new KeyValue('QueueBranch_ID', message.payload.branchID));
      }
      if(message.payload.typeName) {
        params.push(new KeyValue('TypeName', message.payload.typeName));
      }

      let deviceRepo = new DeviceRepository();
      let data = await deviceRepo.get(new IoTComponent(), params);
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

/**
  * @summary get list of IOT devices
  * @param {Message} message - the message that resieved from MQ with sub topic name 'Configuration'
  * @return {Promise<Result>} Result enum wrapped in a promise.
  */
  async getAllIoTTypes(message: Message) {
    try {
      let deviceRepo = new IoTTypeRepository();

      let data = await deviceRepo.getAll(new IoTComponentType());
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


  /**
  * @summary get a one or more of IOT devices Type
  * @param {Message} message - the message that resieved from MQ with sub topic name 'Configuration'
  * @return {Promise<Result>} Result enum wrapped in a promise.
  */
 async getIoTType(message: Message) {
  try {
    let params = new Array<KeyValue>();

    if(message.payload.deviceID && message.payload.deviceID > 0) {
      params.push(new KeyValue('ID', message.payload.deviceID));
    }
    if(message.payload.typeName) {
      params.push(new KeyValue('TypeName', message.payload.typeName));
    }

    let deviceRepo = new IoTTypeRepository();
    let data = await deviceRepo.get(new IoTComponentType(), params);
    let payload = new ResponsePayload();

    if (data) {
      payload.data = JSON.stringify(data);
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

  /**
  * @summary set IOT device config by device ID
  * @param {Message} message - the message that resieved from MQ with sub topic name 'Configuration'
  * @return {Promise<Result>} Result enum wrapped in a promise.
  */
  async setConfig(message: Message) {
    try {
      let params = new Array<KeyValue>();
      if (message.payload.deviceID && message.payload.deviceID > 0) {
        params.push(new KeyValue('ID', message.payload.deviceID));
      }
      if (message.payload.typeName) {
        params.push(new KeyValue('TypeName', message.payload.typeName));
      }
      if (message.payload.data) {
        params.push(new KeyValue('Configuration', message.payload.data));
      }

      let validator = new JsonValidator();
      let isValid = await validator.validate(JSON.parse(message.payload.data), message.payload.typeName, PropertyType.Configuration);

      let result = Result.Failed;
      if(isValid) {
        let deviceRepo = new DeviceRepository();
        result = await deviceRepo.updateConfig(params);

        if (result == Result.Success) {
          this.broadcastMessage(this.configurationTopicName, message);
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
  * @summary get IOT device config by device ID
  * @param {Message} message - the message that resieved from MQ with sub topic name 'Configuration'
  * @return {Promise<Result>} Result enum wrapped in a promise.
  */
  async getConfig(message: Message) {
    try {
      let params = new Array<KeyValue>();
      if (message.payload.deviceID && message.payload.deviceID > 0) {
        params.push(new KeyValue('ID', message.payload.deviceID));
      }
      if (message.payload.typeName) {
        params.push(new KeyValue('TypeName', message.payload.typeName));
      }

      let deviceRepo = new DeviceRepository();
      let data = await deviceRepo.getConfig(params);
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

  /**
  * @summary broadcast a message to the IOT component
  * @param {Message} message - the message that resieved from client
  * @return {Promise<Result>} Result enum wrapped in a promise.
  */
  async executeCommand(message: Message) {
    try {
      let result = await this.broadcastMessage(this.executeCommandTopicName, message)
      let payload = new ResponsePayload();

      if (result) {
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

  /**
 * @summary broadcast a message on the IOT component
 * @param {Message} topic - the message topic to broadcast on
 * @param {Message} message - the message that resieved from client
 * @return {Promise<boolean>} boolean wrapped in a promise.
 */
  async broadcastMessage(topic: string, message: Message) {
    try {
      let broadcastMessage = new Message(this.moduleName);
      broadcastMessage.payload = message.payload;
      broadcastMessage.topicName = topic;

      let events = new EventsService();
      let result = events.broadcastMessage.emit('event', this.broadcastTopic, broadcastMessage);

      return result;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }
}
