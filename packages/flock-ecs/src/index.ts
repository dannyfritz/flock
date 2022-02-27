import type { Opaque } from "type-fest";

// Requirements:
// Archetypal
  // TODO: Query via BitMask
  // TODO: Generational IDs
  // TODO: Query Cacheing
// Storage
  // TODO: ArrayBuffer Storage
  // TODO: Tags
  // TODO: POJO Storage
// Pipelining
  // TODO: Scheduling
  // TODO: Deferred Updates
  // NOTE: https://parceljs.org/languages/javascript/#workers
  // TODO: WebWorkers

type BitMask = null;

type Storage = null;

type Archetypes = Map<BitMask, Storage>;

const archetypes: Archetypes = new Map();

type Query = null;
type System = () => Commands;
type QuerySystem = [any[], (query: Query) => Commands];
type Commands = null;
type CommandBuffer = null;

const cPosition = defineComponent({
  x: "f32",
  y: "f32",
});

const cVelocity = defineComponent({
  x: "f32",
  y: "f32",
});

const sCreate: System = (): CommandBuffer => {
  const commands: Commands = null;
  for (let i=0; i<100; i++) {
    spawn()
      .insert(cPosition, { x: 0, y: 0 })
      .insert(cVelocity, { x: 1, y: 0 })
      .into(commands);
  }
  return commands.buffer;
};

const sMove: QuerySystem = [[cPosition, cVelocity], (query: Query): CommandBuffer => {
  const commands: Commands = null;
  for (const [position, velocity] of query) {
    cPosition.x += cVelocity.x;
    cPosition.y += cVelocity.y;
  }
  return commands.buffer;
}];

const world = new World();
world.runSystems([sCreate]);
world.runSystems([sMove]);
console.log(world);
