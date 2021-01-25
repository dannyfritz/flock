import { Schema } from "./Schema.js"
import * as SetImpl from "./Set.js"

export type Archetype = Set<symbol>

const cache: Set<Archetype> = new Set()

export { newArchetype as new }
export const newArchetype = (schemas: Schema[]): Archetype => {
  const newArchetype = new Set(schemas.map(s => s.id))
  for (const archetype of cache.values()) {
    if (isEqual(archetype, newArchetype)) {
      return archetype
    }
  }
  cache.add(newArchetype)
  return newArchetype
}
export const isEqual = (archetypeA: Archetype, archetypeB: Archetype): boolean => {
  return SetImpl.isEqual(archetypeA, archetypeB)
}
export const isSuperset = (set: Archetype, subset: Archetype): boolean => {
  return SetImpl.isSuperset(set, subset)
}
export const toString = (archetype: Archetype): string => {
  return [...archetype].join(",")
}
