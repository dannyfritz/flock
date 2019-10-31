import test from 'ava';
import * as flock from 'flock-ecs';

test('flock.World', t => {
  const world = new flock.World();
	t.truthy(world);
});

test('flock.World.registerComponent', t => {
  const world = new flock.World();
  const component = new flock.Component(() => {});
	t.is(world.components.size, 0);
  world.registerComponent(component);
  t.is(world.components.size, 1);
  t.is(world.components.keys().next().value, component);
});

test('flock.World.unregisterComponent', t => {
  const world = new flock.World();
  const component = new flock.Component(() => {});
	t.is(world.components.size, 0);
  world.registerComponent(component);
  t.is(world.components.size, 1);
  t.is(world.components.keys().next().value, component);
  world.unregisterComponent(component);
  t.is(world.components.size, 0);
});

test('flock.World.componentValues', t => {
  const world = new flock.World();
  const component = new flock.Component(() => 0);
  world.registerComponent(component);
  t.is(world.components.get(component).length, 0);
  {
    const entity = world.createEntity();
    entity.addComponent(component);
    t.is(world.components.get(component).length, 1);
    t.not(world.components.get(component)[0], undefined);
  }
  {
    const entity = world.createEntity();
    t.is(world.components.get(component).length, 2);
    t.is(world.components.get(component)[1], undefined);
    const value = entity.getComponent(component);
    t.is(value, undefined);
  }
  {
    world.createEntity();
    t.is(world.components.get(component).length, 3);
    t.is(world.components.get(component)[2], undefined);
  }
  {
    const entity = world.createEntity();
    entity.addComponent(component);
    const value = entity.getComponent(component);
    t.is(value.value, 0);
    t.is(world.components.get(component).length, 4);
    t.not(world.components.get(component)[3], undefined);
    entity.removeComponent(component);
    t.is(world.components.get(component)[3], undefined);
    const value2 = entity.getComponent(component);
    t.is(value2, undefined);
  }
});

test('flock.World.maintain', t => {
  const world = new flock.World();
  const entities = [world.createEntity(), world.createEntity(), world.createEntity()];
  const component = new flock.Component(() => {});
  world.registerComponent(component);
  entities[0].addComponent(component);
  entities[1].addComponent(component);
  entities[2].addComponent(component);
  t.is(world.entities.length, 3);
  t.is(world.entities.filter(e => e.added).length, 3);
  t.is(world.components.get(component).filter(e => e !== undefined).length, 3);
  world.maintain();
  t.is(world.entities.filter(e => e.added).length, 0);
  t.is(world.components.get(component).filter(e => e !== undefined).length, 3);
  entities[1].remove();
  entities[0].remove();
  world.maintain();
  t.is(world.entities.length, 3);
  t.is(world.entities.filter(e => e !== undefined).length, 1);
  t.is(world.components.get(component).filter(e => e !== undefined).length, 1);
});
