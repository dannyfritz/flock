import * as PIXI from 'pixi.js';
import * as flock from 'flock-ecs';

const app = new PIXI.Application({ antialias: true });
document.body.appendChild(app.view);

const world = new flock.World();

const Position = new flock.Component(
  {
    x: 0,
    y: 0,
  }
);
world.registerComponent(Position);

const Velocity = new flock.Component(
  {
    x: 0,
    y: 0,
  }
);
world.registerComponent(Velocity);

const movingSystem = new flock.System(
  (entities) => {
    entities.forEach(entity => {
      const position = entity.getComponent(Position)!;
      const velocity = entity.getComponent(Velocity)!;
      position.value.x = position.value.x + velocity.value.x;
      position.value.y = position.value.y + velocity.value.y;
    })
  },
  [ Position, Velocity ],
);

const boidSystem = new flock.System(
  (entities, others) => {
    entities.forEach(entity => {
      others.forEach(other => {
        //TODO: Boid stuff
      });
    });
  },
  [ Position, Velocity ],
  [ Position ],
);

const logSystem = new flock.System(
  (entities) => {
    entities.forEach(entity => {
      const position = entity.getComponent(Position)!;
      console.log(`Entity currently at {${position.value.x}, ${position.value.y}}`);
    });
  },
  [ Position ],
)

const entity = world.createEntity();
entity.addComponent(Position);
entity.addComponent(Velocity, { x: 1, y: 0 });

// app.ticker.add((delta) => {
  boidSystem.run(world);
  movingSystem.run(world);
  logSystem.run(world);
  world.maintain();
// });
