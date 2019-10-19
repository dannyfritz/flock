export class World {
  components: Map<Component<any>, (ComponentValue<any> | null)[]> = new Map();
  entities: Entity[] = [];
  index: number = 0;
  constructor () {}
  createEntity(): Entity {
    const entity = new Entity(this, this.index);
    this.index = this.index + 1;
    this.entities[entity.index] = entity;
    for (const [, componentValues] of this.components) {
      componentValues.push(null);
    }
    return entity;
  }
  registerComponent<T>(component: Component<T>): void {
    if (this.components.get(component)) {
      return;
    }
    this.components.set(component, Array(this.index).fill(null));
  }
  unregisterComponent<T>(component: Component<T>): void {
    this.components.delete(component);
  }
  addEntityComponent<T>(entity: Entity, component: Component<T>, componentValue: ComponentValue<T>): void {
    const componentValues = this.components.get(component) as ComponentValue<T>[];
    if (!componentValues) {
      throw new Error(`Component is not registered.`);
    }
    componentValues[entity.index] = componentValue;
  }
  getEntityComponent<T>(entity: Entity, component: Component<T>): ComponentValue<T> | null {
    const componentValues = this.components.get(component) as (ComponentValue<T> | null)[];
    if (!componentValues) {
      throw new Error(`Component is not registered.`);
    }
    return componentValues[entity.index];
  }
  removeEntityComponent<T>(entity: Entity, component: Component<T>): ComponentValue<T> | null {
    const componentValues = this.components.get(component) as (ComponentValue<T> | null)[];
    if (!componentValues) {
      throw new Error(`Component is not registered.`);
    }
    const prevValue = componentValues[entity.index];
    componentValues[entity.index] = null;
    return prevValue;
  }
  maintain(): void {
    this.entities.forEach(entity => {
      entity.added = false;
    })
    const removed = this.entities.filter(entity => entity.removed);
    //TODO: clean up componentvalues
    this.entities = this.entities.filter(entity => !entity.removed);
  }
  query(componentQueries: ComponentQuery<any>[]): Entity[] {
    return this.entities.filter(entity => {
      return componentQueries.every(cq => {
        if(cq instanceof Current) {
          const componentValue = this.getEntityComponent(entity, cq.component);
          return componentValue !== null;
        }
        else if(cq instanceof Without) {
          const componentValue = this.getEntityComponent(entity, cq.component);
          return componentValue === null;
        }
        else if(cq instanceof Added) {
          return entity.added;
        }
        else if(cq instanceof Removed) {
          return entity.removed;
        }
      });
    });
  }
};

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
    this.world.addEntityComponent(this, component, componentValue);
  }
  removeComponent<T>(component: Component<T>): void {
    this.world.removeEntityComponent(this, component);
  }
  getComponent<T>(component: Component<T>): ComponentValue<T> | null {
    return this.world.getEntityComponent(this, component);
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
};

export class System {
  runFunction: (...entities: Entity[][]) => void;
  componentQueries: (ComponentQuery<any> | Component<any>)[][];
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

export interface ComponentQuery<T> {
  component: Component<T>;
}

export class Without<T> implements ComponentQuery<T> {
  component: Component<T>;
  constructor(component: Component<T>) {
    this.component = component;
  }
}
export class Current<T> implements ComponentQuery<T> {
  component: Component<T>;
  constructor(component: Component<T>) {
    this.component = component;
  }
}
export class Removed<T> implements ComponentQuery<T> {
  component: Component<T> = new Component(null as any);
  constructor() {}
}
export class Added<T> implements ComponentQuery<T> {
  component: Component<T> = new Component(null as any);
  constructor() {}
}
