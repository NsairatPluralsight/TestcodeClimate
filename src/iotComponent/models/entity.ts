export module EntityModule {

  export class Entity {
    id: number;
      name: string;
  }

  export function getEntityName(entities: Entity[], id: number): string {
      let entityName;
      if (entities !== undefined) {
          let entity = entities.find(p => p.id === id);
          if (entity !== undefined) {
              entityName = entity.name;
          }
      }
      return entityName;
  }
}
