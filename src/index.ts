export class World {
  components: Component<any>[] = [];
  entities: Entity[] = [];
  constructor () {}
  registerComponent<T>(component: Component<T>): void {
    this.components.push(component);
  }
  addEntity(entity: Entity): void {
    this.entities.push(entity);
  }
  maintain(): void {
    this.entities.forEach(entity => {
      entity.added = false;
    })
    this.entities = this.entities.filter(entity => !entity.removed);
  }
  query(componentQueries: ComponentQuery<any>[]): Entity[] {
    return this.entities.filter(entity => {
      return componentQueries.every(cq => {
        if(cq instanceof Current) {
          return entity.componentValues.some(cv => cv.component === cq.component);
        }
        else if(cq instanceof Without) {
          return entity.componentValues.every(cv => cv.component !== cq.component);
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
  componentValues: ComponentValue<any>[] = [];
  removed: boolean = false;
  added: boolean = true;
  constructor () {}
  addComponent<T>(component: Component<T>, value?: T) {
    const componentValue = new ComponentValue(value || component.defaultValue, component);
    this.componentValues.push(componentValue);
  }
  getComponent<T>(component: Component<T>): ComponentValue<T> {
    const componentValue = this.componentValues.find(cv => cv.component === component)!;
    return componentValue;
  }
  removeComponent<T>(component: Component<T>): ComponentValue<T> {
    const removedComponent = this.componentValues.find(cv => cv.component === component)!;
    this.componentValues = this.componentValues.filter(cv => cv.component !== component);
    return removedComponent;
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
  defaultValue: T;
  constructor(defaultValue: T) {
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
  component: Component<T> = new Component({} as T);
  constructor() {}
}
export class Added<T> implements ComponentQuery<T> {
  component: Component<T> = new Component({} as T);
  constructor() {}
}
