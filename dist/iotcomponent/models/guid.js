"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Guid {
    GetGUID() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    Guid() {
        return this.GetGUID() + this.GetGUID() + '-' + this.GetGUID()
            + '-' + this.GetGUID() + '-' + this.GetGUID() + '-' + this.GetGUID() + this.GetGUID() + this.GetGUID();
    }
}
exports.Guid = Guid;
//# sourceMappingURL=guid.js.map