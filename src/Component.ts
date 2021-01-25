import { getFieldOffset, Schema } from "./Schema.js"

export interface Component {
  schema: Schema
  dataView: DataView
}

export { newComponent as new }
export const newComponent = (schema: Schema, dataView: DataView): Component => {
  return {
    schema,
    dataView,
  }
}
export const getUint8 = (component: Component, key: string): number => {
  const offset = getFieldOffset(component.schema, key)
  if (offset[1] !== "uint8") {
    throw new Error(`Key ${key} and type ${offset[1]} is not type uint8`)
  }
  return component.dataView.getUint8(offset[2])
}
export const setUint8 = (component: Component, key: string, value: number): void => {
  const offset = getFieldOffset(component.schema, key)
  if (offset[1] !== "uint8") {
    throw new Error(`Key ${key} and type ${offset[1]} is not type uint8`)
  }
  component.dataView.setUint8(offset[2], value)
}
export const getF32 = (component: Component, key: string): number => {
  const offset = getFieldOffset(component.schema, key)
  if (offset[1] !== "f32") {
    throw new Error(`Key ${key} and type ${offset[1]} is not type f32`)
  }
  return component.dataView.getFloat32(offset[2])
}
export const setF32 = (component: Component, key: string, value: number): void => {
  const offset = getFieldOffset(component.schema, key)
  if (offset[1] !== "f32") {
    throw new Error(`Key ${key} and type ${offset[1]} is not type f32`)
  }
  component.dataView.setFloat32(offset[2], value)
}
export const getF64 = (component: Component, key: string): number => {
  const offset = getFieldOffset(component.schema, key)
  if (offset[1] !== "f64") {
    throw new Error(`Key ${key} and type ${offset[1]} is not type f64`)
  }
  return component.dataView.getFloat64(offset[2])
}
export const setF64 = (component: Component, key: string, value: number): void => {
  const offset = getFieldOffset(component.schema, key)
  if (offset[1] !== "f64") {
    throw new Error(`Key ${key} and type ${offset[1]} is not type f64`)
  }
  component.dataView.setFloat64(offset[2], value)
}
