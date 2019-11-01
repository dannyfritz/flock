/**
 * @module flock
 */

 /**
  * Maintains all of the entities and performs queries.
  *
  * ```ts
  * const world = new flock.World()
  * ```
  */
export class World {
  private components: Map<Component<any>, (ComponentValue<any> | undefined)[]> = new Map();
  private entities: (Entity | undefined)[] = [];
  private index: number = 0;
  constructor () {}
  /**
   * Creates a new [[Entity]].
   *
   * ```ts
   * const entity = world.createEntity();
   * ```
   */
  createEntity(): Entity {
    const entity = new Entity(this, this.index);
    this.index = this.index + 1;
    this.entities[entity.index] = entity;
    this.components.forEach((componentValues) => {
      componentValues[entity.index] = undefined;
    });
    return entity;
  }
  /**
   * Registers a [[Component]] with the [[World]].
   *
   * ```ts
   * const age = new flock.Component(() => 30);
   * world.registerComponent(age);
   * ```
   */
  registerComponent<T>(component: Component<T>): void {
    if (this.components.get(component)) {
      return;
    }
    this.components.set(component, Array(this.index).fill(undefined));
  }
  /**
   * Unregisters a [[Component]] with the [[World]].
   *
   * ```ts
   * const age = new flock.Component(() => 30);
   * world.registerComponent(age);
   * world.unregisterComponent(age);
   * ```
   */
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
  /**
   * Removes [[Entity|Entities]] from the [[World]] that have been marked for [[Entity.remove|removal]].
   * Unmarks [[Entity|Entities]] as `added`.
   *
   * ```ts
   * world.maintain();
   * ```
   */
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
  /**
   * Given a set of [[Without]], [[Current]], [[Removed]], and [[Added]],
   * will return a list of [[Entity|Entities]] that match the query.
   *
   * Typically this is not used directly,
   * but implictly when [[System.run]] is called.
   */
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

/**
 * A container for [[Component|Components]].
 *
 * Create [[Entity|Entities]] via a [[World]] instance.
 * ```ts
 * const entity = world.createEntity();
 * ```
 */
export class Entity {
  private world: World;
  removed: boolean = false;
  added: boolean = true;
  index: number;
  constructor (world: World, index: number) {
    this.world = world;
    this.index = index;
  }
  /**
   * Add a [[Component]] to an [[Entity]].
   *
   * ```ts
   * const age = new flock.Component(() => 30);
   * const entity = world.createEntity();
   * entity.addComponent(age);
   * //Second argument can be used to override the default value.
   * entity.addComponent(age, 44);
   * ```
   */
  addComponent<T>(component: Component<T>, value?: T) {
    const componentValue = new ComponentValue(value || component.defaultValue(), component);
    this.world._addEntityComponent(this, component, componentValue);
  }
  /**
   * Remove a [[Component]] from an [[Entity]].
   *
   * ```ts
   * const age = new flock.Component(() => 30);
   * const entity = world.createEntity();
   * entity.addComponent(age);
   * entity.removeComponent(age);
   * ```
   */
  removeComponent<T>(component: Component<T>): void {
    this.world._removeEntityComponent(this, component);
  }
  /**
   * Get a [[Component]] from an [[Entity]].
   * An object with a `value` property will be returned.
   *
   * ```ts
   * const age = new flock.Component(() => 30);
   * const entity = world.createEntity();
   * entity.addComponent(age);
   * const age = entity.getCompoent(age);
   * console.log(age.value);
   * ```
   */
  getComponent<T>(component: Component<T>): ComponentValue<T> | undefined {
    return this.world._getEntityComponent(this, component);
  }
  /**
   * Mark this entity for removal during the next [[World.maintain]] call.
   *
   * ```ts
   * entity.remove();
   * ```
   */
  remove() {
    this.removed = true;
  }
}

/**
 * @hidden
 */
export class ComponentValue<T> {
  value: T;
  component: Component<T>;
  constructor(value: T, component: Component<T>) {
    this.value = value;
    this.component = component;
  }
}

/**
 * A description of a set of values.
 *
 * ```ts
 * const person = new flock.Component(
 *   () => ({
 *     age: 10,
 *     name: "Flend Sandry",
 *   })
 * );
 * ```
 */
export class Component<T> {
  defaultValue: () => T;
  constructor(defaultValue: () => T) {
    this.defaultValue = defaultValue;
  }
}

/**
 * A [[System]] is a function that queries a [[World]] for entities.
 * It can then perform operations on each [[Entity|Entity's]] [[Component|Components]].
 *
 * Given a set of [[Without]], [[Current]], [[Removed]], and [[Added]],
 * [[System.run]] will pass in each query set with a list of appropriate [[Entity|Entities]].
 *
 * ```ts
 * const position = new flock.Component(() => ({
 *   x: 0,
 *   y: 0,
 * }));
 * const movement = new flock.Component(() => ({
 *   x: 0.5,
 *   y: 0.75,
 * }));
 * const movementSystem = new flock.System(
 *   (birds, rocks) => {}, // This function specifies 2 entity lists: birds and rocks.
 *   [position, movement], // This is the query for birds. Requires both position and movement on entities
 *   [position, new flock.Without(movement)], // This is the query for rocks. Requires a position, but no movement on entities.
 * )
 * ```
 */
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
  /**
   * Execute the system on a [[World]].
   *
   * ```ts
   * mySystem.run(world);
   * ```
   */
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
 * @hidden
 */
export interface ComponentQuery<T> {
  component: Component<T>;
}

/**
 * Used to fetch all [[Entity|Entities]] that do not have a [[Component]].
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
 * Used to fetch all [[Entity|Entities]] that do have a [[Component]].
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
 * Used to fetch all [[Entity|Entities]] that were marked for removal since the last [[World.maintain]].
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
 * Used to fetch all [[Entity|Entities]] that were added since the last [[World.maintain]].
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
