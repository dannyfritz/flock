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

type TypedArray = Float32Array | Float64Array | Uint8Array | Uint16Array;

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
  private _cache: Map<EntityId, Float32Array>;
  constructor(size: number, stride: number) {
    this._stride = stride;
    this._store = new Float32Array(size * stride);
    this._entities = new Set();
    this._cache = new Map();
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
    if (this._cache.has(entityId)) {
      return this._cache.get(entityId)!;
    }
    this._cache.set(entityId, this._store.subarray(entityId * this._stride, entityId * this._stride + this._stride));
    return this._cache.get(entityId)!;
  }
}

export class ComponentUInt8 implements IComponent<Uint8Array> {
  private _store: Uint8Array;
  private _stride: number;
  private _entities: Set<EntityId>;
  private _cache: Map<EntityId, Uint8Array>;
  constructor(size: number, stride: number) {
    this._stride = stride;
    this._store = new Uint8Array(size * stride);
    this._entities = new Set();
    this._cache = new Map();
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
  getValues(entityId: EntityId): Uint8Array {
    if (this._cache.has(entityId)) {
      return this._cache.get(entityId)!;
    }
    this._cache.set(entityId, this._store.subarray(entityId * this._stride, entityId * this._stride + this._stride));
    return this._cache.get(entityId)!;
  }
}

export class ComponentUInt16 implements IComponent<Uint16Array> {
  private _store: Uint16Array;
  private _stride: number;
  private _entities: Set<EntityId>;
  private _cache: Map<EntityId, Uint16Array>;
  constructor(size: number, stride: number) {
    this._stride = stride;
    this._store = new Uint16Array(size * stride);
    this._entities = new Set();
    this._cache = new Map();
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
  getValues(entityId: EntityId): Uint16Array {
    if (this._cache.has(entityId)) {
      return this._cache.get(entityId)!;
    }
    this._cache.set(entityId, this._store.subarray(entityId * this._stride, entityId * this._stride + this._stride));
    return this._cache.get(entityId)!;
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
    const entitiesArray = this._queriesList
      .map(queries => {
        return queries.flatMap(q => {
          return [...world.query(q)];
        });
      })
      .map(entities => [...new Set(entities)]);
    this._runFn(...entitiesArray);
  }
}
