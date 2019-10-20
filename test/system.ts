import test from 'ava';
import * as flock from 'flock-ecs';

test('flock.World', t => {
  const system = new flock.System(() => {});
	t.truthy(system);
});
