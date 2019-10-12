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
  query: (components: Component<any>[]) => Entity[],
}

export function createWorld(): World {
  return {
    registerComponent: (component) => {},
    addEntity: (entity) => {},
    maintain: () => {},
    query: (components) => [],
  };
};

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
  ...components: Component<any>[][]
): System {
  return {
    run: (world): void => {
      runFunction(...(components).map(c => world.query(c)));
    },
  }
}

export function not<T>(component: Component<T>) {}
