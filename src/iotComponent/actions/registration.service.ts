import { Result } from '../models/enum';
import { Logger } from '../../common/logger.service';
import { DeviceRepository } from '../repository/device-repository';
import { IoTComponent } from '../models/iot-component';
import { ResponsePayload } from '../models/response-payload';
import { Message } from '../models/message';

export class RegistrationService {
  ModuleName = "ComponentService/Registration";

  /**
* @summary handle the messages with sub topic 'Registration'
* @param {Message} message - the message that resieved from MQ with sub topic name 'Registration'
* @return {Promise<Result>} Result enum wrapped in a promise.
*/
  async registerDevice(message: Message) {
    try {
      var command = message.topicName.replace(this.ModuleName + "/", "");
      let result = Result.Failed;
      result = await this.addDevice(message);
      return result;
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }

   /**
* @async
* @summary Add new IoT device based on the data in message
* @param {Message} message - the message that resieved from MQ with sub topic name 'Registration'
* @return {Promise<Result>} Result enum wrapped in a promise.
*/
  async addDevice(message: Message) {
    try {
      let device = JSON.parse(message.payload.data);

      let IoTDevice = new IoTComponent();
      IoTDevice.orgID = device.orgID;
      IoTDevice.typeName = device.typeName;
      IoTDevice.name_L1 = device.name_L1;
      IoTDevice.name_L2 = device.name_L2;
      IoTDevice.name_L3 = device.name_L3;
      IoTDevice.name_L4 = device.name_L4;
      IoTDevice.queueBranch_ID = device.queueBranch_ID;
      if(device.className) {
        IoTDevice.className = device.className;
        IoTDevice.relatedObject_ID = device.relatedObject_ID;
      }
      IoTDevice.identity = device.identity;
      IoTDevice.address = device.address;

      let deviceRepo = new DeviceRepository();

      let result = await deviceRepo.create(IoTDevice);

      let payload = new ResponsePayload();
      payload.result = result;
      message.payload = payload;

      return result;
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }
}
