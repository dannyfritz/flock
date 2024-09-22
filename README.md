![logo](logo.png)

# flock-ecs

[![GitHub](https://img.shields.io/github/license/dannyfritz/flock-ecs?style=for-the-badge)](https://github.com/dannyfritz/flock-ecs/blob/master/LICENSE)
[![npm badge](https://img.shields.io/npm/v/flock-ecs?style=for-the-badge)](https://www.npmjs.com/package/flock-ecs)

An entity component system (ECS) for learning and toy projects.

**Goals:**
- Simple API
- Good typescript types
- Simple code

**Non-Goals:**
- Performance
- Serialization
- Parallelization

## Install

```sh
npm install -S flock-ecs
```

## Examples

```ts
import { World, And, Or, With, Without, Entity } from "flock-ecs";
class Health {
	hp = 0;
}
class Dog {}
class Cat {}
class Boss {
	phase = 0;
}
class Player {}
const world = new World();
world.addEntity(
	new Entity().addComponent(new Health()).addComponent(new Dog()),
);
world.addEntity(
	new Entity().addComponent(new Health()).addComponent(new Dog()),
);
world.addEntity(
	new Entity()
		.addComponent(new Health())
		.addComponent(new Dog())
		.addComponent(new Boss()),
);
world.addEntity(
	new Entity()
		.addComponent(new Health())
		.addComponent(new Cat())
		.addComponent(new Player()),
);
function initSystem(world: World) {
	const minionDogs = world.query(And(With(Dog), Without(Boss)));
	for (const minionDog of minionDogs) {
		minionDog.getComponent(Health).hp = 10;
	}
	const players = world.query(With(Player));
	for (const player of players) {
		player.getComponent(Health).hp = 100;
	}
	const bosses = world.query(With(Boss));
	for (const boss of bosses) {
		boss.getComponent(Health).hp = 100;
		boss.getComponent(Boss).phase = 1;
	}
}
initSystem(world);
function fightSystem(world: World) {
	const minionDogs = world.query(And(With(Dog), Without(Boss)));
	minionDogs[1].getComponent(Health).hp = 0;
	world.removeEntity(minionDogs[1]);
}
fightSystem(world);
function dieSystem(world: World) {
	players[0].getComponent(Health).hp = 0;
	world.removeEntity(players[0]);
}
dieSystem(world);
```

## [Code of Conduct](./CODE_OF_CONDUCT.md)
