import * as PIXI from 'pixi.js';
import * as flock from 'flock-ecs';
import Victor from 'victor';

const NUMBER_OF_BOIDS = 200;
const SPEED = 50;
const NEAR = 40;
const FAR = 100
const SEPARATION_WEIGHT = 0.08;
const COHESION_WEIGHT = 0.04;
const ALIGNMENT_WEIGHT = 0.02;

const app = new PIXI.Application({ antialias: true });
document.body.appendChild(app.view);

const world = new flock.World();

const Position = new flock.Component(
  () => ({
    x: 0,
    y: 0,
  })
);
world.registerComponent(Position);

const Velocity = new flock.Component(
  () => ({
    x: 0,
    y: 0,
  })
);
world.registerComponent(Velocity);

const Neighbors = new flock.Component<{
  far: flock.Entity[],
  near: flock.Entity[],
}>(
  () => ({
    far: [],
    near: [],
  })
);
world.registerComponent(Neighbors);

const Boid = new flock.Component(
  () => ({
    cohesion: {x: 0, y: 0},
    separation: {x: 0, y: 0},
    alignment: {x: 0, y: 0},
  })
)
world.registerComponent(Boid);

const movingSystem = new flock.System(
  (entities) => {
    entities.forEach(entity => {
      const position = entity.getComponent(Position)!;
      const velocity = entity.getComponent(Velocity)!;
      position.value.x += velocity.value.x * context.dt * SPEED;
      position.value.y += velocity.value.y * context.dt * SPEED;
      if (position.value.x < 0) {
        position.value.x = position.value.x + 800;
      }
      else if (position.value.x > 800) {
        position.value.x = position.value.x - 800;
      }
      if (position.value.y < 0) {
        position.value.y = position.value.y + 600;
      }
      else if (position.value.y > 600) {
        position.value.y = position.value.y - 600;
      }
    })
  },
  [ Position, Velocity ],
);

const neighborSystem = new flock.System(
  (entities) => {
    entities.forEach(entity => {
      const neighbors = entity.getComponent(Neighbors)!;
      neighbors.value.near = [];
      neighbors.value.far = [];
      const position = entity.getComponent(Position)!;
      const v1 = new Victor(position.value.x, position.value.y);
      entities.forEach(other => {
        if (other === entity) {
          return;
        }
        const otherPosition = other.getComponent(Position)!;
        const v2 = new Victor(otherPosition.value.x, otherPosition.value.y);
        const distance = v1.distance(v2);
        if (distance <= FAR) {
          neighbors.value.far.push(other);
        }
        if (distance <= NEAR) {
          neighbors.value.near.push(other);
        }
      });
    });
  },
  [Position, Neighbors],
)

const boidSystem = new flock.System(
  (entities) => {
    entities.forEach(entity => {
      const boid = entity.getComponent(Boid)!;
      const position = entity.getComponent(Position)!;
      const neighbors = entity.getComponent(Neighbors)!;
      const velocity = entity.getComponent(Velocity)!;
      {
        const sum = neighbors.value.far.reduce((sum, neighbor) => {
          const position = neighbor.getComponent(Position)!;
          sum.x += position.value.x;
          sum.y += position.value.y;
          return sum;
        }, {x: 0, y: 0})
        const numberOfNeighbors = neighbors.value.far.length;
        const cohesion = new Victor(sum.x / numberOfNeighbors, sum.y / numberOfNeighbors).subtract(new Victor(position.value.x, position.value.y));
        if (sum.x === 0 && sum.y === 0) {
          boid.value.cohesion.x = 0;
          boid.value.cohesion.y = 0;
        } else {
          boid.value.cohesion.x = cohesion.normalize().x;
          boid.value.cohesion.y = cohesion.y;
        }
      }
      {
        const sum = neighbors.value.near.reduce((sum, neighbor) => {
          const position = neighbor.getComponent(Position)!;
          sum.x += position.value.x;
          sum.y += position.value.y;
          return sum;
        }, {x: 0, y: 0})
        const numberOfNeighbors = neighbors.value.near.length;
        const separation = new Victor(sum.x / numberOfNeighbors, sum.y / numberOfNeighbors).subtract(new Victor(position.value.x, position.value.y));
        if (sum.x === 0 && sum.y === 0) {
          boid.value.separation.x = 0;
          boid.value.separation.y = 0;
        } else {
          boid.value.separation.x = -separation.normalize().x;
          boid.value.separation.y = -separation.y;
        }
      }
      {
        const alignment = new Victor(velocity.value.x, velocity.value.y).normalize();
        for (const neighbor of neighbors.value.far) {
          const velocity = neighbor.getComponent(Velocity)!;
          alignment.add(new Victor(velocity.value.x, velocity.value.y).normalize());
        }
        boid.value.alignment.x = alignment.normalize().x;
        boid.value.alignment.y = alignment.y;
      }
      if (context.ticks % 60 === 0) {
      }
      velocity.value.x += boid.value.cohesion.x * COHESION_WEIGHT;
      velocity.value.y += boid.value.cohesion.y * COHESION_WEIGHT;
      velocity.value.x += boid.value.separation.x * SEPARATION_WEIGHT;
      velocity.value.y += boid.value.separation.y * SEPARATION_WEIGHT;
      velocity.value.x += boid.value.alignment.x * ALIGNMENT_WEIGHT;
      velocity.value.y += boid.value.alignment.y * ALIGNMENT_WEIGHT;
      const normalizedVelocity = new Victor(velocity.value.x, velocity.value.y).normalize();
      velocity.value.x = normalizedVelocity.x;
      velocity.value.y = normalizedVelocity.y;
    });
  },
  [ Boid, Neighbors, Position, Velocity ],
);

const debugSystem = new flock.System(
  (entities) => {
    entities.forEach(entity => {
      const position = entity.getComponent(Position)!;
      const boid = entity.getComponent(Boid)!;
      {
        graphics.lineStyle(1, 0xFFFFFF, 0.25);
        graphics.drawCircle(position.value.x, position.value.y, FAR);
        graphics.endFill();
      }
      {
        graphics.lineStyle(1, 0xFFFFFF, 0.25);
        graphics.drawCircle(position.value.x, position.value.y, NEAR);
        graphics.endFill();
      }
      {
        graphics.lineStyle(1, 0xFF0000);
        graphics.drawCircle(position.value.x, position.value.y, 3);
        graphics.endFill();
      }
      {
        const velocity = entity.getComponent(Velocity)!;
        const v = new Victor(velocity.value.x, velocity.value.y).normalize().multiply(new Victor(10, 10));
        graphics.lineStyle(1, 0xFFFFFF, 1);
        graphics.moveTo(position.value.x, position.value.y);
        graphics.lineTo(position.value.x + v.x, position.value.y + v.y);
      }
      {
        const alignment = boid.value.alignment;
        const a = new Victor(alignment.x, alignment.y).multiply(new Victor(10, 10));
        graphics.lineStyle(1, 0x0000FF, 1);
        graphics.moveTo(position.value.x, position.value.y);
        graphics.lineTo(position.value.x + a.x, position.value.y + a.y);
      }
      {
        const cohesion = boid.value.cohesion;
        const c = new Victor(cohesion.x, cohesion.y).multiply(new Victor(10, 10));
        graphics.lineStyle(1, 0x00FF00, 1);
        graphics.moveTo(position.value.x, position.value.y);
        graphics.lineTo(position.value.x + c.x, position.value.y + c.y);
      }
      {
        const separation = boid.value.separation;
        const s = new Victor(separation.x, separation.y).multiply(new Victor(10, 10));
        graphics.lineStyle(1, 0xFFFF00, 1);
        graphics.moveTo(position.value.x, position.value.y);
        graphics.lineTo(position.value.x + s.x, position.value.y + s.y);
      }
    });
  },
  [ Boid, Position, Velocity ],
)

const renderSystem = new flock.System(
  (entities) => {
    graphics.lineStyle(1, 0xFFFFFF);
    entities.forEach(entity => {
      const position = entity.getComponent(Position)!;
      {
        graphics.drawCircle(position.value.x, position.value.y, 4);
      }
    });
  },
  [ Position, Velocity ],
)

for (let i=0; i < NUMBER_OF_BOIDS; i++) {
  const entity = world.createEntity();
  entity.addComponent(Position, { x: Math.random() * 800, y: Math.random() * 600 });
  entity.addComponent(Boid);
  entity.addComponent(Neighbors);
  const velocity = new Victor(Math.random() * 2 - 1, Math.random() * 2 - 1)
    .normalize();
  entity.addComponent(Velocity, { x: velocity.x, y: velocity.y });
}

const graphics = new PIXI.Graphics();
app.stage.addChild(graphics);

const context = {
  dt: 0,
  ticks: 0,
};

app.ticker.add(() => {
  context.dt = app.ticker.deltaMS / 1000;
  context.ticks = context.ticks + 1;
  if (context.ticks % 60 === 0) {
    console.log(Math.floor(app.ticker.FPS));
  }

  neighborSystem.run(world);
  boidSystem.run(world);
  movingSystem.run(world);

  graphics.clear();
  renderSystem.run(world);
  // debugSystem.run(world);

  world.maintain();
});

document.addEventListener('keydown', () => {
  console.log("stopping!");
  app.ticker.stop();
})
