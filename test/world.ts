import test from 'ava';
import * as flock from 'flock-ecs';

test('flock.World', t => {
  const world = new flock.World();
	t.truthy(world);
});
