// Import flock
import * as flock from 'flock-ecs';

// Create a World
// A world stores components and componentValues,
// Creates new entities,
// And performs queries for systems
const world = new flock.World();

// Create a Component
// Components are how entities describe the data they need
const Position = new flock.Component(
  () => ({
    x: 0,
    y: 0,
  })
);
// Register the component with your world
world.registerComponent(Position);

// Create a System
// This sytem logs out each entity's position to the console
const logSystem = new flock.System(
  (entities) => {
    entities.forEach(entity => {
      // Entity.getComponent gets a ComponentValue from an entity
      const position = entity.getComponent(Position)!;
      // Make sure you use the value property to access your data
      console.log(`{ x: ${position.value.x}, y: ${position.value.y} }`);
    });
  },
  // Filter the entities by which components the entities contain
  [ Position ],
);

// Create Entities
for (let i=0; i<10; i++) {
  const entity = world.createEntity();
  // Provide a different position value than the default one when creating the entity
  entity.addComponent(Position, { x: Math.random() * 100, y: Math.random() * 100 });
}

// Run the system on the world
logSystem.run(world);
// Tell the world to clean up any removed entities
world.maintain();
