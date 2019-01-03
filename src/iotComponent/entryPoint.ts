
import { Result } from './models/enum';
import { Logger } from '../common/logger.service';
import { ReportsService } from './actions/reports.service';
import { ConfigurationService } from './actions/configuration.service';
import { RegistrationService } from './actions/registration.service';
import { EventsService } from '../common/event';
import { Message } from './models/message';
import { Guid } from './models/guid';
var rabbitMQClient = require("../rabbitMQClient");

export class EntryPoint {
  keys = ["ComponentService.*"];
  queueName = "ComponentService";
  rabbitMQClient: any;
  topicPrefix = "CVMServer/";
  sourceID = '';

  constructor() {
    this.rabbitMQClient = new rabbitMQClient(this.queueName, this.keys);
  }

  /**
  * @async
  * @summary intialaize rabbit MQ client start listining to the ComponentService queue
  */
  async start() {
    let that = this;
    this.rabbitMQClient.receive(async (request, replay) => { await this.processRequest(request, replay) });

    let events = new EventsService();
    events.broadcastMessage.on('event', this.broadcastMessage);
  }

  /**
  * @async
  * @summary call back method to handle the resieved messages
  * @returns {Promise<Result>} Result enum wrapped in a promise.
  */
  async processRequest(request: Message, reply: Message): Promise<Result> {
    try {
      let result = Result.Failed;
      let topic = request.topicName.split("/")[1];

      switch (topic) {
        case "Registration":
          let registration = new RegistrationService();
          result = await registration.registerDevice(request);
          reply = request;
          break;
        case 'Configuration':
          let configuration = new ConfigurationService();
          result = await configuration.processMessageRequest(request);
          reply = request;
          break;
        case 'Report':
          let reports = new ReportsService();
          result = await reports.processMessageRequest(request);
          reply = request;
          break;
          case "Data":
          result = await this.loadEntities(request);
          reply = request;
          break;
      }
      return result;
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }

  /**
  * @async
  * @summary call back method to handle the broadcasts messages
  * @returns {Promise<Result>} Result enum wrapped in a promise.
  */
  async broadcastMessage(broadcastTopic: string, request: Message): Promise<Result> {
    try {
      let result = await this.rabbitMQClient.sendBroadcast(broadcastTopic, JSON.stringify(request));
      return result;
    }
    catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  };

  /**
  * @async
  * @summary sends a message to module using rabbit MQ Client
  * @returns {Promise<Result>} Result enum wrapped in a promise.
  */
  async sendToModule(payload: any, topic: string, moduleName: string, reply: Array<any>): Promise<Result> {
    try {
      let message = new Message(this.getSourceId());
      message.topicName = topic;
      message.payload = payload;

      let reqMessage = JSON.stringify(message);
      let result = await this.rabbitMQClient.send(moduleName, reqMessage, reply);
      return result;
    } catch (error) {
      Logger.error(error);
    }
  }

  /**
  * @async
  * @summary return a list of objects of a specific entitiy , full object or object only contains {ID , Name}
  * @param {string} entitieName - the entitie name you want to retrieve
  * @param {Message} message - the message that resieved from MQ with sub topic name 'Configuration'
  * @return {Promise<number>} Result enum wrapped in a promise.
  */
  async loadEntities(message: Message): Promise<Result> {
    try {
      let topicName = this.getModuleName(message.payload.target);
      // let result = await communicationService.getData(message.payload, moduleName, data);
      let data = new Array<any>();
      let result = await this.sendToModule(message.payload, topicName, 'CVMServer', data);

      if (result == Result.Success) {

        let response = JSON.parse(data[0]);

        if (response && response.payload) {
          message.payload = response.payload;
          result = Result.Success;
        } else {
          result = Result.Failed;
        }
      } else {
        result = Result.Failed;
      }
      return result;
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }

  /**
  * @summary return the module name as string
  * @param {string} target - the target name that contains module name
  * @return {Promise<string>} module name.
  */
  getModuleName(target: string): string {
    try {
      var targetArr = target.split('.');
      var moduleName = this.topicPrefix + targetArr[0];
      return moduleName;
    } catch (error) {
      Logger.error(error);
      return undefined;
    }
  }

  /**
  * @summary return a new guid if sourse is not defined
  * @return {string} guid.
  */
  getSourceId(): string {
    if (this.sourceID == undefined) {
      this.sourceID = new Guid().Guid();
    }
    return this.sourceID;
  }

}
