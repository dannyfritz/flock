import * as PIXI from 'pixi.js';
import * as flock from 'flock-ecs';
import Victor from 'victor';

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
  entities: flock.Entity[],
}>(
  () => ({
    entities: [],
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
      position.value.x += velocity.value.x * context.dt * 50;
      position.value.y += velocity.value.y * context.dt * 50;
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
      neighbors.value.entities = [];
      const position = entity.getComponent(Position)!;
      const v1 = new Victor(position.value.x, position.value.y);
      entities.forEach(other => {
        if (other === entity) {
          return;
        }
        const otherPosition = other.getComponent(Position)!;
        const v2 = new Victor(otherPosition.value.x, otherPosition.value.y);
        if (v1.distance(v2) <= 50) {
          neighbors.value.entities.push(other);
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
        const sum = neighbors.value.entities.reduce((sum, neighbor) => {
          const position = neighbor.getComponent(Position)!;
          sum.x += position.value.x;
          sum.y += position.value.y;
          return sum;
        }, {x: 0, y: 0})
        const numberOfNeighbors = neighbors.value.entities.length;
        const cohesion = new Victor(sum.x / numberOfNeighbors, sum.y / numberOfNeighbors).subtract(new Victor(position.value.x, position.value.y));
        boid.value.cohesion.x = cohesion.normalize().x;
        boid.value.cohesion.y = cohesion.y;
        boid.value.separation.x = -cohesion.x;
        boid.value.separation.y = -cohesion.y;
      }
      {
        const alignment = new Victor(velocity.value.x, velocity.value.y).normalize();
        for (const neighbor of neighbors.value.entities) {
          const velocity = neighbor.getComponent(Velocity)!;
          alignment.add(new Victor(velocity.value.x, velocity.value.y).normalize());
        }
        boid.value.alignment.x = alignment.normalize().x;
        boid.value.alignment.y = alignment.y;
      }
      velocity.value.x += boid.value.cohesion.x * 2;
      velocity.value.y += boid.value.cohesion.y * 2
      velocity.value.x += boid.value.separation.x * 5;
      velocity.value.y += boid.value.separation.y * 5;
      velocity.value.x += boid.value.alignment.x * 10;
      velocity.value.y += boid.value.alignment.y * 10;
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
        graphics.lineStyle(1, 0xFF0000);
        graphics.beginFill(0xDE3249, 0);
        graphics.drawCircle(position.value.x, position.value.y, 4);
        graphics.endFill();
      }
      {
        graphics.lineStyle(1, 0xFFFFFF);
        graphics.beginFill(0xDE3249, 0);
        graphics.drawCircle(position.value.x, position.value.y, 50);
        graphics.endFill();
      }
      {
        const alignment = boid.value.alignment;
        const a = new Victor(alignment.x, alignment.y).normalize().multiply(new Victor(10, 10));
        graphics.lineStyle(2, 0x0000FF, 1);
        graphics.moveTo(position.value.x, position.value.y);
        graphics.lineTo(position.value.x + a.x, position.value.y + a.y);
      }
      {
        const cohesion = boid.value.cohesion;
        const c = new Victor(cohesion.x, cohesion.y).normalize().multiply(new Victor(10, 10));
        graphics.lineStyle(2, 0x00FF00, 1);
        graphics.moveTo(position.value.x, position.value.y);
        graphics.lineTo(position.value.x + c.x, position.value.y + c.y);
      }
      {
        const separation = boid.value.separation;
        const s = new Victor(separation.x, separation.y).normalize().multiply(new Victor(10, 10));
        graphics.lineStyle(2, 0xFFFF00, 1);
        graphics.moveTo(position.value.x, position.value.y);
        graphics.lineTo(position.value.x + s.x, position.value.y + s.y);
      }
      {
        const velocity = entity.getComponent(Velocity)!;
        const v = new Victor(velocity.value.x, velocity.value.y).normalize().multiply(new Victor(10, 10));
        graphics.lineStyle(2, 0xFFFFFF, 1);
        graphics.moveTo(position.value.x, position.value.y);
        graphics.lineTo(position.value.x + v.x, position.value.y + v.y);
      }
    });
  },
  [ Boid, Position, Velocity ],
)

const renderSystem = new flock.System(
  (entities) => {
    entities.forEach(entity => {
      const position = entity.getComponent(Position)!;
      const boid = entity.getComponent(Boid)!;
      {
        graphics.lineStyle(1, 0xFFFFFF);
        graphics.beginFill(0xDE3249, 0);
        graphics.drawCircle(position.value.x, position.value.y, 4);
        graphics.endFill();
      }
      {
        const velocity = entity.getComponent(Velocity)!;
        const v = new Victor(velocity.value.x, velocity.value.y).normalize().multiply(new Victor(10, 10));
        graphics.lineStyle(2, 0xFFFFFF, 1);
        graphics.moveTo(position.value.x, position.value.y);
        graphics.lineTo(position.value.x + v.x, position.value.y + v.y);
      }
    })
  },
  [ Position, Velocity ],
)

for (let i=0; i < 500; i++) {
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

  graphics.clear();

  neighborSystem.run(world);
  boidSystem.run(world);
  movingSystem.run(world);
  renderSystem.run(world);
  // debugSystem.run(world);

  world.maintain();
});

document.addEventListener('keydown', () => {
  console.log("stopping!");
  app.ticker.stop();
})
