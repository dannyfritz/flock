interface EntityBuilder {
  addComponent: <T>(component: Component<T>) => void,
}

interface Entity {
  addComponent: <T>(component: Component<T>, value: T) => void,
  removeComponent: <T>(component: Component<T>) => T,
  getComponent: <T>(component: Component<T>) => ComponentValue<T>,
  remove: () => void,
}

export function createEntity(): EntityBuilder {
  return {
    addComponent: <T>(component: Component<T>) => {},
  };
}

interface World {
  registerComponent: <T>(component: Component<T>) => void,
  addEntity: (entity: EntityBuilder) => void,
  maintain: () => void,
}

export function createWorld(): World {
  return {
    registerComponent: (component) => {},
    addEntity: (entity) => {},
    maintain: () => {},
  };
};

interface Component<T> {
  default: T
}

interface ComponentValue<T> {
  value: T
}

export function createComponent<T>(value: T, reset: (value: ComponentValue<T>) => void): Component<T> {
  return {
    default: value
  };
};

interface System {
  run: (world: World) => void,
}

interface QueryResults {
  added: Array<Entity>,
  current: Array<Entity>,
  removed: Array<Entity>,
}

export function createSystem(queries: Array<Component<any>>, runFunction: (entities: QueryResults) => void): System {
  return {
    run: (world) => {},
  }
}

export function not<T>(component: Component<T>) {}
