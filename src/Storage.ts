import { newComponent } from "./Component.js"
import { Entity } from "./Entity.js"
import { Schema, sizeOf } from "./Schema.js"
import { QueryResult } from "./World.js"

export interface Storage {
  buffer: ArrayBuffer
  cache: DataView[]
  entities: Entity[]
  length: number
  schemas: Schema[]
  size: number
}

export { newStorage as new }
export const newStorage = (schemas: Schema[]): Storage => {
  const startingLength = 16
  const size = schemas.reduce((size, schema) => size + sizeOf(schema), 0)
  const byteLength = size * startingLength
  return {
    buffer: new ArrayBuffer(Math.ceil(byteLength / 8) * 8),
    cache: [],
    entities: [],
    length: startingLength,
    schemas,
    size,
  }
}
export const addEntity = (storage: Storage, entity: Entity): void => {
  storage.entities.push(entity)
  if (storage.entities.length >= storage.length) {
    const oldBuffer = storage.buffer
    storage.length *= 2
    const byteLength = storage.length * storage.size
    storage.buffer = new ArrayBuffer(Math.ceil(byteLength / 8) * 8)
    new Float64Array(storage.buffer).set(new Float64Array(oldBuffer))
    storage.cache = []
  }
}
export const removeEntity = (storage: Storage, entity: Entity): void => {
  const index = storage.entities.indexOf(entity)
  storage.entities[index] = -1
}
export const hasEntity = (storage: Storage, entity: Entity): boolean => {
  return storage.entities.includes(entity)
}
const getDataView = (storage: Storage, offset: number): DataView => {
  if (storage.cache[offset] === undefined) {
    const dataView = new DataView(storage.buffer, offset)
    storage.cache[offset] = dataView
  }
  return storage.cache[offset]
}
export const query = function * (storage: Storage, querySchemas: Schema[]): Iterable<QueryResult> {
  for (const [i, entity] of storage.entities.entries()) {
    if (entity === -1) {
      continue
    }
    const allComponents = []
    let offset = 0
    for (const schema of storage.schemas) {
      allComponents.push(newComponent(schema, getDataView(storage, storage.size * i + offset)))
      offset += sizeOf(schema)
    }
    const components = []
    for (const schema of querySchemas) {
      const component = allComponents.find(c => c.schema === schema)
      if (component === undefined) {
        throw new Error(`Could not find Component for Schema ${schema.id.toString()} within ${storage.schemas.map(s => s.id.toString()).join(",")}`)
      }
      components.push(component)
    }
    yield [entity, components]
  }
}
