export class IoTComponent {
  id: number;
  orgID: number;
  typeName: string;
  name_L1: string;
  name_L2: string;
  name_L3: string;
  name_L4: string;
  queueBranch_ID: number;
  reportedData: string;
  configuration: string;
  className: string;
  relatedObject_ID: number;
  identity: string;
  address: string;
  description: string;

  constructor() {
    this.id = -1;
    this.orgID = -1;
    this.typeName = '';
    this.name_L1 = '';
    this.name_L2 = '';
    this.name_L3 = '';
    this.name_L4 = '';
    this.queueBranch_ID = -1;
    this.reportedData = '';
    this.configuration = '';
    this.className = '';
    this.relatedObject_ID = -1;
    this.identity = '';
    this.address = '';
    this.description = '';
  }
}
