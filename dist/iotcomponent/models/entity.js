"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EntityModule;
(function (EntityModule) {
    class Entity {
    }
    EntityModule.Entity = Entity;
    function getEntityName(entities, id) {
        let entityName;
        if (entities !== undefined) {
            let entity = entities.find(p => p.id === id);
            if (entity !== undefined) {
                entityName = entity.name;
            }
        }
        return entityName;
    }
    EntityModule.getEntityName = getEntityName;
})(EntityModule = exports.EntityModule || (exports.EntityModule = {}));
//# sourceMappingURL=entity.js.map