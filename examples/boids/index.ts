import * as PIXI from 'pixi.js';
import * as flock from 'flock-ecs';
import Victor from 'victor';
import shipImg from './ship.png';

const NUMBER_OF_BOIDS = 100;
const NUMBER_OF_NEIGHBORS = 3;
const SPEED = 50;
const NEAR = 40;
const FAR = 100;
const SEPARATION_WEIGHT = 0.02;
const COHESION_WEIGHT = 0.01;
const ALIGNMENT_WEIGHT = 0.01;

const app = new PIXI.Application();
document.body.appendChild(app.view);

const world = new flock.World(NUMBER_OF_BOIDS);

const Position = new flock.ComponentF32(NUMBER_OF_BOIDS, 2);
world.registerComponent(Position);

const Velocity = new flock.ComponentF32(NUMBER_OF_BOIDS, 2);
world.registerComponent(Velocity);

// [farLength, far x 10, nearLength, near x 10]
const Neighbors = new flock.ComponentUInt16(NUMBER_OF_BOIDS, 1 + NUMBER_OF_NEIGHBORS + 1 + NUMBER_OF_NEIGHBORS);
world.registerComponent(Neighbors);

// [cohesion x&y, separation x&y, alignment x&y]
const Boid = new flock.ComponentF32(NUMBER_OF_BOIDS, 2 + 2 + 2)
world.registerComponent(Boid);

const movingSystem = new flock.System(
  (entities) => {
    entities.forEach(entityId => {
      const position = Position.getValues(entityId);
      const velocity = Velocity.getValues(entityId);
      position[0] += velocity[0] * context.dt * SPEED;
      position[1] += velocity[1] * context.dt * SPEED;
      if (position[0] < 0) {
        position[0] = position[0] + 800;
      }
      else if (position[0] > 800) {
        position[0] = position[0] - 800;
      }
      if (position[1] < 0) {
        position[1] = position[1] + 600;
      }
      else if (position[1] > 600) {
        position[1] = position[1] - 600;
      }
    })
  },
  [ Position, Velocity ],
);

const v1 = new Victor(0, 0);
const v2 = new Victor(0, 0);
const neighborSystem = new flock.System(
  (entityIds) => {
    entityIds.forEach(entityId => {
      const neighbors = Neighbors.getValues(entityId);
      const near = neighbors.subarray(1, 1 + NUMBER_OF_NEIGHBORS);
      const far = neighbors.subarray(1 + NUMBER_OF_NEIGHBORS + 1, 1 + NUMBER_OF_NEIGHBORS + 1 + NUMBER_OF_NEIGHBORS);
      const position = Position.getValues(entityId);
      v1.x = position[0];
      v1.y = position[1];
      let nearIndex = 0;
      let farIndex = 0;
      for (const otherId of entityIds) {
        if (farIndex === NUMBER_OF_NEIGHBORS && nearIndex === NUMBER_OF_NEIGHBORS) {
          break;
        }
        if (otherId === entityId) {
          continue;
        }
        const otherPosition = Position.getValues(otherId)!;
        v2.x = otherPosition[0];
        v2.y = otherPosition[1];
        const distance = v1.distance(v2);
        if (nearIndex < NUMBER_OF_NEIGHBORS && distance <= NEAR) {
          near[nearIndex] = otherId;
          nearIndex += 1;
          neighbors[0] = nearIndex;
        }
        if (farIndex < NUMBER_OF_NEIGHBORS && distance <= FAR) {
          far[farIndex] = otherId;
          farIndex += 1;
          neighbors[1 + NUMBER_OF_NEIGHBORS] = farIndex;
        }
      }
    });
  },
  [Position, Neighbors],
)

const positionV = new Victor(0, 0);
const boidSystem = new flock.System(
  (entities) => {
    entities.forEach(entityId => {
      const position = Position.getValues(entityId);
      positionV.x = position[0];
      positionV.y = position[1];
      const velocity = Velocity.getValues(entityId);
      const neighbors = Neighbors.getValues(entityId);
      let nearLength = neighbors[0];
      const near = neighbors.subarray(1, 1 + nearLength);
      let farLength = neighbors[1 + NUMBER_OF_NEIGHBORS];
      const far = neighbors.subarray(1 + NUMBER_OF_NEIGHBORS + 1, 1 + NUMBER_OF_NEIGHBORS + 1 + farLength);
      const boid = Boid.getValues(entityId);
      const cohesion = boid.subarray(0, 2);
      const alignment = boid.subarray(2, 4);
      const separation = boid.subarray(4, 6);
      {
        const sum = far.reduce((sum, neighborId) => {
          const position = Position.getValues(neighborId);
          sum[0] += position[0];
          sum[1] += position[1];
          return sum;
        }, [0, 0])
        if (sum[0] === 0 && sum[1] === 0) {
          cohesion[0] = 0;
          cohesion[1] = 0;
        } else {
          const newCohesion = new Victor(sum[0] / farLength, sum[1] / farLength)
            .subtract(positionV)
            .normalize();
          cohesion[0] = newCohesion.x;
          cohesion[1] = newCohesion.y;
        }
      }
      {
        const sum = near.reduce((sum, neighborId) => {
          const position = Position.getValues(neighborId);
          sum[0] += position[0];
          sum[1] += position[1];
          return sum;
        }, [0, 0])
        if (sum[0] === 0 && sum[1] === 0) {
          separation[0] = 0;
          separation[1] = 0;
        } else {
          const newSeparation = new Victor(sum[0] / nearLength, sum[1] / nearLength)
            .subtract(positionV)
            .normalize();
          separation[0] = -newSeparation.x;
          separation[1] = -newSeparation.y;
        }
      }
      {
        const newAlignment = new Victor(velocity[0], velocity[1]);
        for (const neighborId of far) {
          if (neighborId === -1) {
            break;
          }
          const velocity = Velocity.getValues(neighborId);
          newAlignment
            .addScalarX(velocity[0])
            .addScalarY(velocity[1]);
        }
        newAlignment.normalize();
        alignment[0] = newAlignment.x;
        alignment[1] = newAlignment.y;
      }
      velocity[0] += cohesion[0] * COHESION_WEIGHT;
      velocity[1] += cohesion[1] * COHESION_WEIGHT;
      velocity[0] += separation[0] * SEPARATION_WEIGHT;
      velocity[1] += separation[1] * SEPARATION_WEIGHT;
      velocity[0] += alignment[0] * ALIGNMENT_WEIGHT;
      velocity[1] += alignment[1] * ALIGNMENT_WEIGHT;
      const normalizedVelocity = new Victor(velocity[0], velocity[1]).normalize();
      velocity[0] = normalizedVelocity.x;
      velocity[1] = normalizedVelocity.y;
    });
  },
  [ Boid, Neighbors, Position, Velocity ],
);

const graphics = new PIXI.Graphics();
app.stage.addChild(graphics);

const lineLength = new Victor(10, 10);
//eslint-disable-next-line no-unused-vars
const debugSystem = new flock.System(
  (entities) => {
    graphics.clear();
    entities.forEach(entityId => {
      const position = Position.getValues(entityId)!;
      const boid = Boid.getValues(entityId)!;
      {
        graphics.lineStyle(1, 0xFFFFFF, 0.25);
        graphics.drawCircle(position[0], position[1], FAR);
        graphics.endFill();
      }
      {
        graphics.lineStyle(1, 0xFFFFFF, 0.25);
        graphics.drawCircle(position[0], position[1], NEAR);
        graphics.endFill();
      }
      {
        graphics.lineStyle(1, 0xFF0000);
        graphics.drawCircle(position[0], position[1], 3);
        graphics.endFill();
      }
      {
        const velocity = Velocity.getValues(entityId)!;
        const v = new Victor(velocity[0], velocity[1]).normalize().multiply(lineLength);
        graphics.lineStyle(1, 0xFFFFFF, 1);
        graphics.moveTo(position[0], position[1]);
        graphics.lineTo(position[0] + v.x, position[1] + v.y);
      }
      {
        const alignment = [boid[0], boid[1]];
        const a = new Victor(alignment[0], alignment[1]).multiply(lineLength);
        graphics.lineStyle(1, 0x0000FF, 1);
        graphics.moveTo(position[0], position[1]);
        graphics.lineTo(position[0] + a.x, position[1] + a.y);
      }
      {
        const cohesion = [boid[2], boid[3]];
        const c = new Victor(cohesion[0], cohesion[1]).multiply(lineLength);
        graphics.lineStyle(1, 0x00FF00, 1);
        graphics.moveTo(position[0], position[1]);
        graphics.lineTo(position[0] + c.x, position[1] + c.y);
      }
      {
        const separation = [boid[4], boid[5]];
        const s = new Victor(separation[0], separation[1]).multiply(lineLength);
        graphics.lineStyle(1, 0xFFFF00, 1);
        graphics.moveTo(position[0], position[1]);
        graphics.lineTo(position[0] + s.x, position[1] + s.y);
      }
    });
  },
  [ Boid, Position, Velocity ],
)

const pixiParticles = new PIXI.ParticleContainer(NUMBER_OF_BOIDS, {
  position: true,
  rotation: true,
});
app.stage.addChild(pixiParticles);
const sprites = (new Array(NUMBER_OF_BOIDS)).fill(null).map(() => {
  const sprite = PIXI.Sprite.from(shipImg);
  sprite.anchor.set(0.5);
  pixiParticles.addChild(sprite);
  return sprite;
})

const renderSystem = new flock.System(
  (entityIds) => {
    entityIds.forEach(entityId => {
      const position = Position.getValues(entityId)!;
      const velocity = Velocity.getValues(entityId)!;
      sprites[entityId].x = position[0];
      sprites[entityId].y = position[1];
      sprites[entityId].angle = -1 * new Victor(velocity[0], velocity[1]).verticalAngleDeg() + 90;
    });
  },
  [ Position, Velocity ],
)

for (let i=0; i < NUMBER_OF_BOIDS; i++) {
  const entityId = world.createEntity();
  Position.addEntity(entityId, [Math.random() * 800, Math.random() * 600 ]);
  Boid.addEntity(entityId, []);
  Neighbors.addEntity(entityId, []);
  const velocity = new Victor(Math.random() * 2 - 1, Math.random() * 2 - 1)
    .normalize();
  Velocity.addEntity(entityId, [velocity.x, velocity.y]);
}

const context = {
  dt: 0,
  ticks: 0,
};

app.ticker.add(() => {
  context.dt = app.ticker.deltaMS / 1000;
  context.ticks = context.ticks + 1;
  if (context.ticks % 30 === 0) {
    console.log(Math.floor(app.ticker.FPS));
  }

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
