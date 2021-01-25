export const isSuperset = <T>(set: Set<T>, subset: Set<T>): boolean => {
  return [...subset].every((e) => set.has(e))
}

export const isEqual = <T>(setA: Set<T>, setB: Set<T>): boolean => {
  if (setA.size !== setB.size) return false
  for (const a of setA) if (!setB.has(a)) return false
  return true
}
