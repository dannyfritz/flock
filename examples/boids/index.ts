import * as PIXI from 'pixi.js';
import * as flock from 'flock-ecs';

const world = flock.createWorld();

const Position = flock.createComponent(
  {
    x: 0,
    y: 0,
  },
  (component) => {
    component.value.x = 0;
    component.value.y = 0;
  }
);
world.registerComponent(Position);

const Velocity = flock.createComponent(
  {
    x: 0,
    y: 0,
  },
  (component) => {
    component.value.x = 0;
    component.value.y = 0;
  }
);
world.registerComponent(Velocity);

const entity = flock.createEntity();
entity.addComponent(Position);
entity.addComponent(Velocity);
world.addEntity(entity);

const movingSystem = flock.createSystem(
  (entities) => {
    entities.forEach(entity => {
      const position = entity.getComponent(Position);
      const velocity = entity.getComponent(Velocity);
      position.value.x = position.value.x + velocity.value.x;
      position.value.y = position.value.y + velocity.value.y;
    })
  },
  [ Position, Velocity ],
);

const boidSystem = flock.createSystem(
  (entities, others) => {
    entities.forEach(entity => {
      others.forEach(other => {
        //TODO: Boid stuff
      });
    });
  },
  [ Position, Velocity ],
  [ Position, Velocity ],
);

const logSystem = flock.createSystem(
  (entities) => {
    entities.forEach(entity => {
      const position = entity.getComponent(Position);
      console.log(`Entity currently at {${position.value.x}, ${position.value.y}}`);
    });
  },
  [ Position ],
)

const app = new PIXI.Application({ antialias: true });
document.body.appendChild(app.view);

app.ticker.add((delta) => {
  boidSystem.run(world);
  movingSystem.run(world);
  logSystem.run(world);
  world.maintain();
});
