import test from 'ava';
import * as flock from 'flock-ecs';

test('flock.Entity', t => {
  const world = new flock.World();
  const entity = world.createEntity();
	t.truthy(entity);
});
