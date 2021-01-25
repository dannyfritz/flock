import {
  Component,
  Schema,
  World,
} from "../src/index.js"

const world = World.new()

const Position = Schema.new(
  "position",
  {
    x: "f32",
    y: "f32",
  })

const Velocity = Schema.new(
  "velocity",
  {
    velocity: ["f32", 2],
  })

World.createEntity(world, [Position, Velocity])
{
  const entity = World.createEntity(world)
  World.addSchemasToEntity(world, entity, [Position, Velocity])
  const [, [position, velocity]] = World.queryEntity(world, [Position, Velocity], entity)
  Component.setF32(position, "x", 1)
  Component.setF32(position, "y", 2)
  Component.setF32(velocity, "velocity[0]", 3)
  Component.setF32(velocity, "velocity[1]", 4)
}

{
  const query = World.query(world, [Position, Velocity])
  for (const [entity, [position, velocity]] of query) {
    console.log("Entity", entity)
    console.log("  [x, y]:", Component.getF32(position, "x"), Component.getF32(position, "y"))
    console.log("  velocity:", Component.getF32(velocity, "velocity[0]"), Component.getF32(velocity, "velocity[1]"))
  }
}
{
  const query = World.query(world, [Position, Velocity])
  for (const [entity, [position, velocity]] of query) {
    Component.setF32(position, "x", 20)
    Component.setF32(position, "y", entity)
    Component.setF32(velocity, "velocity[0]", entity)
    Component.setF32(velocity, "velocity[1]", entity + 10)
  }
}
{
  const query = World.query(world, [Position, Velocity])
  for (const [entity, [position, velocity]] of query) {
    console.log("Entity", entity)
    console.log("  [x, y]:", Component.getF32(position, "x"), Component.getF32(position, "y"))
    console.log("  velocity:", Component.getF32(velocity, "velocity[0]"), Component.getF32(velocity, "velocity[1]"))
  }
}
