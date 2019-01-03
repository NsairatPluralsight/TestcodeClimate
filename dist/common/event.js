"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class EventsService {
    constructor() {
        this.broadcastMessage = new events_1.EventEmitter();
    }
}
exports.EventsService = EventsService;
//# sourceMappingURL=event.js.map