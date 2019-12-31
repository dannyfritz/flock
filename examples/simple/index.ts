import * as flock from 'flock-ecs';
const NUMBER_OF_ENTITIES = 20;

const world = new flock.World(NUMBER_OF_ENTITIES);

const Position = new flock.ComponentF32(NUMBER_OF_ENTITIES, 2);
world.registerComponent(Position);

const logSystem = new flock.System(
  (entities) => {
    entities.forEach(entityId => {
      const position = Position.getValues(entityId)!;
      console.log(`{ x: ${position[0]}, y: ${position[1]} }`);
    });
  },
  [ Position ],
);

for (let i=0; i<10; i++) {
  const entityId = world.createEntity();
  Position.addEntity(entityId, [Math.random() * 100, Math.random() * 100]);
}

logSystem.run(world);
world.maintain();
