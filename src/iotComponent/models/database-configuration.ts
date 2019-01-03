import { config, IProcedureResult, IRecordSet, IOptions, IPool} from 'mssql';
import { KeyValue } from './key-value'

export class DatabaseConfiguration implements config {
  driver?: string;
  user?: string;
  password?: string;
  server: string;
  port?: number;
  domain?: string;
  database: string;
  connectionTimeout?: number;
  requestTimeout?: number;
  stream?: boolean;
  parseJSON?: boolean;
  options?: IOptions;
  pool?: IPool;

  constructor() {
    this.user = "sa";
    this.password = "sedco@123";
    this.server = "M-KHALAF";
    this.database = "CVMDB";
  }
}

export class DBResult implements IProcedureResult<any> {
  recordsets: IRecordSet<any>[];
  recordset: IRecordSet<any>;
  rowsAffected: number[];
  output: { [key: string]: any; };
  returnValue: any;
}

export class DBParameters extends KeyValue {
  type: any;

  constructor(pKey: string, pValue: string, pType: any) {
    super(pKey, pValue);
    this.type = pType;
  }
}
