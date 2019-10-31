import test from 'ava';
import * as flock from 'flock-ecs';

test('flock.System', t => {
  const system = new flock.System(() => {});
	t.truthy(system);
});

test('flock.World.query', t => {
  const world = new flock.World();
  const person = new flock.Component(() => "person");
  const adult = new flock.Component(() => "adult");
  const wise = new flock.Component(() => "wise");
  world.registerComponent(person);
  world.registerComponent(adult);
  world.registerComponent(wise);
  const dalaiLama = world.createEntity();
  dalaiLama.addComponent(person);
  dalaiLama.addComponent(adult);
  dalaiLama.addComponent(wise);
  const gretaThunberg = world.createEntity();
  gretaThunberg.addComponent(person);
  gretaThunberg.addComponent(wise);
  const donaldTrump = world.createEntity();
  donaldTrump.addComponent(person);
  donaldTrump.addComponent(adult); // Not sure on this one

  const wisePeopleSystem = new flock.System((wisePeople) => {
    t.is(wisePeople.length, 2);
    t.assert(wisePeople.includes(gretaThunberg));
    t.assert(wisePeople.includes(dalaiLama));
  }, [person, new flock.Current(wise)])
  wisePeopleSystem.run(world);

  donaldTrump.remove();
  const impeachedPeopleSystem = new flock.System((impeachedPeople) => {
    t.is(impeachedPeople.length, 1);
    t.assert(impeachedPeople.includes(donaldTrump));
  }, [new flock.Removed()])
  impeachedPeopleSystem.run(world);

  const everyoneSystem = new flock.System((everyone) => {
    t.is(everyone.length, 3);
    t.assert(everyone.includes(gretaThunberg));
    t.assert(everyone.includes(dalaiLama));
    t.assert(everyone.includes(donaldTrump));
  }, [new flock.Added()])
  everyoneSystem.run(world);

  const childrenSystem = new flock.System((children) => {
    t.is(children.length, 1);
    t.assert(children.includes(gretaThunberg));
  }, [new flock.Without(adult)])
  childrenSystem.run(world);
});
