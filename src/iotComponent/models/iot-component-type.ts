export class IoTComponentType {
  id: number;
  typeName: string;
  captionKey: string;
  configurationSchema: string;
  reportedDataSchema: string;

  constructor() {
    this.id = -1;
    this.typeName = '';
    this.captionKey = '';
    this.configurationSchema = '';
    this.reportedDataSchema = '';
  }
}




