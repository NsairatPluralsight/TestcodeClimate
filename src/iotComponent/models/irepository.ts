import { Result } from "./enum";
import { KeyValue } from "./key-value";

export interface IRepository<T> {
  create(entity: T, params: Array<KeyValue>): Promise<Result>;
  update(entity: T, params: Array<KeyValue>): Promise<Result>;
  delete(entity: T, params: Array<KeyValue>): Promise<Result>;
  getAll(entity: T): Promise<T>;
  get(entity: T, params: Array<KeyValue>): Promise<T>;
}
