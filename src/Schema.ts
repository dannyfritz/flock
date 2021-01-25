export interface Schema {
  id: symbol
  node: SchemaNode
  offsets: Offset[]
}

export { newSchema as new }
export const newSchema = (name: string, schemaNode: SchemaNode): Schema => {
  return {
    id: Symbol(name),
    node: schemaNode,
    offsets: SchemaNodeImpl.getFieldOffsets(schemaNode),
  }
}
export const getFieldOffset = (schema: Schema, key: string): Offset => {
  const offsetField = schema.offsets.find(e => e[0] === key)
  if (offsetField === undefined) {
    throw new Error(`Field of ${key} is invalid for component ${schema.id.toString()}\nand schema ${JSON.stringify(schema.node)}`)
  }
  return offsetField
}
export const sizeOf = (schema: Schema): number => {
  return SchemaNodeImpl.sizeOf(schema.node)
}

export type PrimitiveType =
  | "bigint64"
  | "biguint64"
  | "char"
  | "f32"
  | "f64"
  | "int8"
  | "int16"
  | "int32"
  | "uint16"
  | "uint32"
  | "uint8"

const PrimitiveTypeImpl = {
  sizeOf: (type: PrimitiveType): number => {
    switch (type) {
      case "bigint64":
      case "biguint64":
      case "f64":
        return 64 / 8
      case "int32":
      case "f32":
      case "uint32":
        return 32 / 8
      case "int16":
      case "uint16":
        return 16 / 8
      case "char":
      case "int8":
      case "uint8":
        return 8 / 8
    }
  },
}

type SchemaLeaf =
  // | Schema
  | [type: PrimitiveType, length: number]
  | PrimitiveType

export interface SchemaNode { [key: string]: SchemaLeaf }

type Offset = [key: string, type: PrimitiveType, offset: number]

const SchemaNodeImpl = {
  sizeOf: (schemaNode: SchemaNode): number => {
    return Object.keys(schemaNode).reduce((sum, key) => {
      const field = schemaNode[key]
      if (Array.isArray(field)) {
        return sum + PrimitiveTypeImpl.sizeOf(field[0]) * field[1]
        // } else if (field instanceof Object) {
        //   return sum + SchemaImpl.sizeOf(field);
      } else if (typeof field === "string") {
        return sum + PrimitiveTypeImpl.sizeOf(field)
      } else {
        return 0
      }
    }, 0)
  },
  getFieldOffsets: (schemaNode: SchemaNode): Offset[] => {
    const offsets: Offset[] = []
    let offset = 0
    for (const [key, value] of Object.entries(schemaNode)) {
      if (Array.isArray(value)) {
        // } else if (field instanceof Object) {
        //   return sum + SchemaImpl.sizeOf(field);
        for (let i = 0; i < value[1]; i++) {
          offsets.push([`${key}[${i}]`, value[0], offset + PrimitiveTypeImpl.sizeOf(value[0])])
          offset += PrimitiveTypeImpl.sizeOf(value[0])
        }
      } else if (typeof value === "string") {
        offsets.push([key, value, offset + PrimitiveTypeImpl.sizeOf(value)])
        offset += PrimitiveTypeImpl.sizeOf(value)
      } else {
      }
    }
    return offsets
  },
}
