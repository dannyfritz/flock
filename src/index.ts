/**
 * @module flock
 */

 /**
  * Maintains all of the entities and performs queries.
  */
export class World {
  private components: Map<Component<any>, (ComponentValue<any> | undefined)[]> = new Map();
  private entities: (Entity | undefined)[] = [];
  private index: number = 0;
  constructor () {}
  createEntity(): Entity {
    const entity = new Entity(this, this.index);
    this.index = this.index + 1;
    this.entities[entity.index] = entity;
    this.components.forEach((componentValues) => {
      componentValues[entity.index] = undefined;
    });
    return entity;
  }
  registerComponent<T>(component: Component<T>): void {
    if (this.components.get(component)) {
      return;
    }
    this.components.set(component, Array(this.index).fill(undefined));
  }
  unregisterComponent<T>(component: Component<T>): void {
    this.components.delete(component);
  }
  _addEntityComponent<T>(entity: Entity, component: Component<T>, componentValue: ComponentValue<T>): void {
    const componentValues = this.components.get(component) as ComponentValue<T>[];
    if (!componentValues) {
      throw new Error(`Component is not registered.`);
    }
    componentValues[entity.index] = componentValue;
  }
  _getEntityComponent<T>(entity: Entity, component: Component<T>): ComponentValue<T> | undefined {
    const componentValues = this.components.get(component) as (ComponentValue<T> | undefined)[];
    if (!componentValues) {
      throw new Error(`Component is not registered.`);
    }
    return componentValues[entity.index];
  }
  _removeEntityComponent<T>(entity: Entity, component: Component<T>): ComponentValue<T> | undefined {
    const componentValues = this.components.get(component) as (ComponentValue<T> | undefined)[];
    if (!componentValues) {
      throw new Error(`Component is not registered.`);
    }
    const prevValue = componentValues[entity.index];
    componentValues[entity.index] = undefined;
    return prevValue;
  }
  maintain(): void {
    this.entities.forEach(entity => {
      if (!entity) {
        return;
      }
      entity.added = false;
      if (entity.removed) {
        this.components.forEach((componentValues) => {
          componentValues[entity.index] = undefined;
        });
        this.entities[entity.index] = undefined;
      }
    });
  }
  query(componentQueries: ComponentQuery<any>[]): Entity[] {
    return this.entities.filter(entity => {
      if (!entity) {
        return false;
      }
      return componentQueries.every(cq => {
        if(cq instanceof Current) {
          const componentValue = this._getEntityComponent(entity, cq.component);
          return componentValue !== undefined;
        }
        else if(cq instanceof Without) {
          const componentValue = this._getEntityComponent(entity, cq.component);
          return componentValue === undefined;
        }
        else if(cq instanceof Added) {
          return entity.added;
        }
        else if(cq instanceof Removed) {
          return entity.removed;
        }
      });
    }) as Entity[];
  }
}

export class Entity {
  private world: World;
  removed: boolean = false;
  added: boolean = true;
  index: number;
  constructor (world: World, index: number) {
    this.world = world;
    this.index = index;
  }
  addComponent<T>(component: Component<T>, value?: T) {
    const componentValue = new ComponentValue(value || component.defaultValue(), component);
    this.world._addEntityComponent(this, component, componentValue);
  }
  removeComponent<T>(component: Component<T>): void {
    this.world._removeEntityComponent(this, component);
  }
  getComponent<T>(component: Component<T>): ComponentValue<T> | undefined {
    return this.world._getEntityComponent(this, component);
  }
  remove() {
    this.removed = true;
  }
}

export class ComponentValue<T> {
  value: T;
  component: Component<T>;
  constructor(value: T, component: Component<T>) {
    this.value = value;
    this.component = component;
  }
}

export class Component<T> {
  defaultValue: () => T;
  constructor(defaultValue: () => T) {
    this.defaultValue = defaultValue;
  }
}

export class System {
  private runFunction: (...entities: Entity[][]) => void;
  private componentQueries: (ComponentQuery<any> | Component<any>)[][];
  constructor(
    runFunction: (...entities: Entity[][]) => void,
    ...componentQueries: (ComponentQuery<any> | Component<any>)[][]
  ) {
    this.runFunction = runFunction;
    this.componentQueries = componentQueries;
  }
  run(world: World): void {
    this.runFunction(...(this.componentQueries).map(cqs => {
      const queries: ComponentQuery<any>[] = cqs.map(cq => {
        if ((cq as ComponentQuery<any>).component) {
          return cq as ComponentQuery<any>;
        } else {
          return new Current(cq as Component<any>);
        }
      });
      return world.query(queries);
    }));
  }
}

/**
 * @ignore
 */
export interface ComponentQuery<T> {
  component: Component<T>;
}

/**
 * Used to fetch all [[Entity]] that do not have a [[Component]].
 * To be used in a [[System]] with queries.
 *
 * ```typescript
 * const minorComponent = new flock.Component(() => {});
 * const notMinor = new flock.Without(minorComponent);
 * const watchViolentMovie = new flock.System((adults) => {}, [notMinor]);
 * ```
 */
export class Without<T> implements ComponentQuery<T> {
  component: Component<T>;
  constructor(component: Component<T>) {
    this.component = component;
  }
}
/**
 * Used to fetch all [[Entity]] that do have a [[Component]].
 * To be used in a [[System]] with queries.
 *
 * ```typescript
 * const minorComponent = new flock.Component(() => {});
 * const minor = new flock.Current(minorComponent);
 * const jumpOnBouncyCastle = new flock.System((children) => {}, [new flock.Current(minor)]);
 * // Alternatively, because Current is very common, can be omitted.
 * const jumpOnBouncyCastle = new flock.System((children) => {}, [minor]);
 * ```
 */
export class Current<T> implements ComponentQuery<T> {
  component: Component<T>;
  constructor(component: Component<T>) {
    this.component = component;
  }
}
/**
 * Used to fetch all [[Entity]] that were marked for removal since the last [[World.maintain]].
 * To be used in a [[System]] with queries.
 *
 * ```typescript
 * const funeralService = new flock.System((deadPeople) => {}, [new flock.Removed()]);
 * ```
 */
export class Removed<T> implements ComponentQuery<T> {
  component: Component<T> = new Component(null as any);
  constructor() {}
}
/**
 * Used to fetch all [[Entity]] that were added since the last [[World.maintain]].
 * To be used in a [[System]] with queries.
 *
 * ```typescript
 * const cry = new flock.System((babies) => {}, [new flock.Added()]);
 * ```
 */
export class Added<T> implements ComponentQuery<T> {
  component: Component<T> = new Component(null as any);
  constructor() {}
}
