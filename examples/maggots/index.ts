import * as PIXI from 'pixi.js';
import * as flock from 'flock-ecs';
import Victor from 'victor';
import spriteImg from './sprite.png';

const MAX_ENTITIES = 10000;

const app = new PIXI.Application();
document.body.appendChild(app.view);

const world = new flock.World(MAX_ENTITIES);

const Position = new flock.ComponentF32(MAX_ENTITIES, 2)
world.registerComponent(Position)

const Velocity = new flock.ComponentF32(MAX_ENTITIES, 2)
world.registerComponent(Velocity)

const moveSystem = new flock.System(
  (entityIds) => {
    entityIds.forEach(entityId => {
      const position = Position.getValues(entityId)!;
      const velocity = Velocity.getValues(entityId)!;
      position[0] = position[0] + velocity[0] * context.dt;
      position[1] = position[1] + velocity[1] * context.dt;
      if (position[0] < 0) {
        position[0] = 800;
      } else if (position[0] >= 800) {
        position[0] = 0;
      }
      if (position[1] < 0) {
        position[1] = 600;
      } else if (position[1] >= 600) {
        position[1] = 0;
      }
    });
  },
  [ Position, Velocity ],
)

const pixiParticles = new PIXI.ParticleContainer(MAX_ENTITIES, {
    position: true,
    rotation: true,
});
app.stage.addChild(pixiParticles);
const sprites = (new Array(MAX_ENTITIES).fill(null)).map(() => {
  const sprite = PIXI.Sprite.from(spriteImg);
  sprite.anchor.set(0.5);
  pixiParticles.addChild(sprite);
  return sprite;
});

const renderSystem = new flock.System(
  (entityIds) => {
    entityIds.forEach(entityId => {
      const position = Position.getValues(entityId)!;
      const velocity = Velocity.getValues(entityId)!;
      sprites[entityId].x = position[0];
      sprites[entityId].y = position[1];
      sprites[entityId].angle = -1 * new Victor(velocity[0], velocity[1]).verticalAngleDeg() + 180;
    });
  },
  [ Position, Velocity ],
)

for (var i=0; i<MAX_ENTITIES; i++) {
  const entityId = world.createEntity();
  const position = [Math.random() * 800, Math.random() * 600];
  Position.addEntity(entityId, position);
  const velocity = [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10];
  Velocity.addEntity(entityId, velocity);
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

  moveSystem.run(world);
  renderSystem.run(world);

  world.maintain();
});

document.addEventListener('keydown', () => {
  console.log("stopping!");
  app.ticker.stop();
})
