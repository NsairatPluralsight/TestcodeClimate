"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guid_1 = require("./guid");
class Message {
    constructor(sourceID) {
        this.time = 0;
        this.messageID = new guid_1.Guid().Guid();
        this.time = Date.now();
        this.source = 'CS/' + sourceID;
    }
}
exports.Message = Message;
//# sourceMappingURL=message.js.map