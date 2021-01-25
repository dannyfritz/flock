import { Archetype } from "./Archetype.js"
import * as ArchetypeImpl from "./Archetype.js"
import { Component } from "./Component.js"
import { Entity } from "./Entity.js"
import { Schema } from "./Schema.js"
import { Storage } from "./Storage.js"
import * as StorageImpl from "./Storage.js"

interface World {
  storages: Map<Archetype, Storage>
  nextEntity: Entity
}

export type QueryResult = [entity: Entity, components: Component[]]

export { newWorld as new }
export const newWorld = (): World => {
  return {
    storages: new Map(),
    nextEntity: 0,
  }
}
const addArchetypeEntity = (world: World, archetype: Archetype, entity: Entity): void => {
  const storage = world.storages.get(archetype)
  if (storage === undefined) {
    throw new Error(`Could not find Storage for Archetype ${ArchetypeImpl.toString(archetype)}`)
  }
  StorageImpl.addEntity(storage, entity)
}
const removeArchetypEntity = (world: World, archetype: Archetype, entity: Entity): void => {
  const storage = world.storages.get(archetype)
  if (storage === undefined) {
    throw new Error(`Could not find Storage for Archetype ${ArchetypeImpl.toString(archetype)}`)
  }
  StorageImpl.removeEntity(storage, entity)
}
const createArchetype = (world: World, schemas: Schema[]): void => {
  world.storages.set(ArchetypeImpl.new(schemas), StorageImpl.new(schemas))
}
export const createEntity = (world: World, schemas: Schema[] = []): Entity => {
  const entity = world.nextEntity++
  const archetype = ArchetypeImpl.new(schemas)
  if (!world.storages.has(archetype)) {
    createArchetype(world, schemas)
  }
  addArchetypeEntity(world, archetype, entity)
  return entity
}
export const removeEntity = (world: World, entity: Entity): void => {
  for (const [, storage] of world.storages.entries()) {
    if (StorageImpl.hasEntity(storage, entity)) {
      StorageImpl.removeEntity(storage, entity)
      return
    }
  }
  throw new Error(`Unable to find Entity ${entity}`)
}
const getEntityArchetype = (world: World, entity: Entity): Archetype => {
  for (const [archetype, storage] of world.storages) {
    if (StorageImpl.hasEntity(storage, entity)) {
      return archetype
    }
  }
  throw new Error(`Could not find Entity ${entity}`)
}
export const addSchemasToEntity = (world: World, entity: Entity, schemas: Schema[]): void => {
  const oldArchetype = getEntityArchetype(world, entity)
  const oldStorage = world.storages.get(oldArchetype)
  if (oldStorage === undefined) {
    throw new Error(`Could not find Storage for Archetype ${ArchetypeImpl.toString(oldArchetype)}`)
  }
  const newSchemas = [...oldStorage.schemas, ...schemas]
  const newArchetype = ArchetypeImpl.new(newSchemas)
  if (!world.storages.has(newArchetype)) {
    createArchetype(world, newSchemas)
  }
  addArchetypeEntity(world, newArchetype, entity)
  removeArchetypEntity(world, oldArchetype, entity)
}

export const query = function * (world: World, schemas: Schema[]): Iterable<QueryResult> {
  const targetArchetype = ArchetypeImpl.new(schemas)
  for (const [archetype, storage] of world.storages.entries()) {
    if (ArchetypeImpl.isSuperset(archetype, targetArchetype)) {
      for (const data of StorageImpl.query(storage, schemas)) {
        yield data
      }
    }
  }
}
export const queryEntity = (world: World, schemas: Schema[], entity: Entity): QueryResult => {
  for (const [, storage] of world.storages.entries()) {
    if (StorageImpl.hasEntity(storage, entity)) {
      for (const [entityB, components] of StorageImpl.query(storage, schemas)) {
        if (entity === entityB) {
          return [entity, components]
        }
      }
    }
  }
  throw new Error(`Unable to find Entity ${entity}`)
}
