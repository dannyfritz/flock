import {
  Component,
  Schema,
  World,
} from "../src/index.js"

const world = World.new()

const Position = Schema.new("position", {
  x: "f32",
})
const Age = Schema.new("age", {
  age: "uint8",
})

console.time("create [Position]")
for (let i = 0; i < 490_000; i++) {
  World.createEntity(world, [Position])
}
console.log("490,000 entities created")
console.timeEnd("create [Position]")

console.time("create/delete [Position, Age]")
for (let i = 0; i < 10_000; i++) {
  const entity = World.createEntity(world, [Position, Age])
  if (i % 3 === 0) {
    World.removeEntity(world, entity)
  }
}
console.log("10,000 entities created")
console.log("3,333 entities created")
console.timeEnd("create/delete [Position, Age]")

console.time("write")
{
  const query = World.query(world, [Position])
  let counter = 0
  for (const [entity, [position]] of query) {
    try {
      Component.setF32(position, "x", entity)
    } catch (e) {
      console.log(counter)
    }
    counter++
  }
}
console.timeEnd("write")

for (let i = 0; i < 10; i++) {
  console.time("read")
  const query = World.query(world, [Position])
  let sum = 0
  for (const [, [position]] of query) {
    sum += Component.getF32(position, "x")
  }
  console.log("sum", sum)
  console.timeEnd("read")
}

{
  console.time("count [Position]")
  const query = World.query(world, [Position])
  let count = 0
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _ of query) {
    count += 1
  }
  console.log("count", count)
  console.timeEnd("count [Position]")
}

{
  console.time("count [Age]")
  const query = World.query(world, [Age])
  let count = 0
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _ of query) {
    count += 1
  }
  console.log("count", count)
  console.timeEnd("count [Age]")
}
