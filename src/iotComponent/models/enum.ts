export enum Commands {
  SetConfig= 'SetConfig',
  GetConfig= 'GetConfig',
  SetReport= 'SetReport',
  GetReport= 'GetReport',
  GetDevices= 'GetDevices',
  GetDevice= 'GetDevice',
  ExecuteCommand= 'ExecuteCommand'
};

export enum Result {
  Success= 0,
  Failed= -1
};

export enum DBProcedures {
  IoTComponentInsert = 'SP_IoTComponent_Insert',
  IoTComponentUpdateConfiguration = 'SP_IoTComponent_UpdateConfiguration',
  IoTComponentUpdateReported = 'SP_IoTComponent_UpdateReported'
}

export enum PropertyType {
  Configuration,
  ReportedData
}
