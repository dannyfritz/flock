type EntityId = number;

export class World {
  pool: Array<EntityId>;
  components: Set<IComponent>;
  constructor(size: number) {
    this.components = new Set();
    this.pool = [...Array(size).keys()].reverse();
  }
  createEntity(): EntityId {
    return this.pool.pop()!;
  }
  removeEntity(entityId: EntityId) {
    for (const component of this.components) {
      component.removeEntity(entityId);
    }
    this.pool.push(entityId);
  }
  registerComponent(component: IComponent): void {
    this.components.add(component);
  }
  query(component: IComponent): Set<EntityId> {
    return component.entities();
  }
  maintain(): void {}
}

type TypedArray = Float32Array | Float64Array;

interface IComponent<T = TypedArray> {
  addEntity(entityId: EntityId, values: Array<number>): void;
  removeEntity(entityId: EntityId): void;
  entities(): Set<EntityId>;
  getValues(entityId: EntityId): T;
}

export class ComponentF32 implements IComponent<Float32Array> {
  private _store: Float32Array;
  private _stride: number;
  private _entities: Set<EntityId>;
  constructor(size: number, stride: number) {
    this._stride = stride;
    this._store = new Float32Array(size * stride);
    this._entities = new Set();
  }
  addEntity(entityId: EntityId, values: Array<number>) {
    this._entities.add(entityId);
    this._store.set(values, entityId * this._stride);
  }
  removeEntity(entityId: EntityId) {
    this._entities.delete(entityId);
  }
  entities(): Set<EntityId> {
    return this._entities;
  }
  getValues(entityId: EntityId): Float32Array {
    return this._store.subarray(entityId * this._stride, entityId * this._stride + this._stride);
  }
}

export class System {
  private _runFn: (...entityIds: Array<Array<EntityId>>) => void;
  private _queriesList: Array<Array<IComponent>>;
  constructor(runFn: (...entityIds: Array<Array<EntityId>>) => void, ...queriesList: Array<Array<IComponent>>) {
    this._runFn = runFn;
    this._queriesList = queriesList;
  }
  run(world: World): void {
    const entities = this._queriesList
      .map(queries => {
        return queries.flatMap(q => {
          return [...world.query(q)];
        });
      });
    this._runFn(...entities);
  }
}
