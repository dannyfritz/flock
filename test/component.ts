import test from 'ava';
import * as flock from 'flock-ecs';

test('flock.Component', t => {
  const component = new flock.Component(() => {});
	t.truthy(component);
});
