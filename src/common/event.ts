import { EventEmitter } from 'events';

export class EventsService {
  broadcastMessage = new EventEmitter();
}
