interface World {
  registerComponent: <T>(component: Component<T>) => void,
  addEntity: (entity: EntityBuilder) => void,
  maintain: () => void,
  query: (componentQueries: ComponentQuery<any>[]) => Entity[],
}

export function createWorld(): World {
  return {
    registerComponent: (component) => {},
    addEntity: (entity) => {},
    maintain: () => {},
    query: (componentQueries) => [],
  };
};

interface EntityBuilder {
  addComponent: <T>(component: Component<T>) => void,
}

interface Entity {
  removed: boolean,
  added: boolean,
  addComponent: <T>(component: Component<T>, value?: T) => void,
  removeComponent: <T>(component: Component<T>) => T,
  getComponent: <T>(component: Component<T>) => ComponentValue<T>,
  remove: () => void,
}

export function createEntity(): EntityBuilder {
  return {
    addComponent: <T>(component: Component<T>) => {},
  };
}

interface Component<T> {
  type: Symbol,
  default: T
}

interface ComponentValue<T> {
  value: T
}

export function createComponent<T>(value: T, reset: (value: ComponentValue<T>) => void): Component<T> {
  return {
    type: Symbol(),
    default: value
  };
};

interface System {
  run: (world: World) => void,
}

export function createSystem(
  runFunction: (...entities: Entity[][]) => void,
  ...componentQueries: (ComponentQuery<any> | Component<any>)[][]
): System {
  return {
    run: (world): void => {
      runFunction(...(componentQueries).map(cqs => {
        const queries: ComponentQuery<any>[] = cqs.map(cq => {
          if ((cq as ComponentQuery<any>).component) {
            return cq as ComponentQuery<any>;
          } else {
            return current(cq as Component<any>);
          }
        });
        return world.query(queries);
      }));
    },
  }
}

enum ComponentQueryType {
  WITHOUT,
  CURRENT,
  REMOVED,
  ADDED,
};

interface ComponentQuery<T> {
  type: ComponentQueryType,
  component: Component<T>,
}

export function without<T>(component: Component<T>): ComponentQuery<T> {
  return {
    type: ComponentQueryType.WITHOUT,
    component,
  }
}
export function current<T>(component: Component<T>): ComponentQuery<T> {
  return {
    type: ComponentQueryType.CURRENT,
    component,
  }
}
export function removed<T>(component: Component<T>): ComponentQuery<T> {
  return {
    type: ComponentQueryType.REMOVED,
    component,
  }
}
export function added<T>(component: Component<T>): ComponentQuery<T> {
  return {
    type: ComponentQueryType.ADDED,
    component,
  }
}
