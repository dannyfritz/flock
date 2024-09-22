![logo](logo.png)

# flock-ecs

[![GitHub](https://img.shields.io/github/license/dannyfritz/flock-ecs?style=for-the-badge)](https://github.com/dannyfritz/flock-ecs/blob/master/LICENSE)
[![npm badge](https://img.shields.io/npm/v/flock-ecs?style=for-the-badge)](https://www.npmjs.com/package/flock-ecs)

An entity component system (ECS) for learning and toy projects.

**Goals:**
- Simple code
- Simple API
- Good types

**Non-Goals:**
- Performance
- Serialization

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
let minionDogs = world.query(And(With(Dog), Without(Boss)));
let players = world.query(With(Player));
let thingsWithHealth = world.query(With(Health));
let bosses = world.query(With(Boss));
players[0].getComponent(Health).hp = 100;
bosses[0].getComponent(Health).hp = 100;
bosses[0].getComponent(Boss).phase = 1;
for (const minionDog of minionDogs) {
	minionDog.getComponent(Health).hp = 10;
}
minionDogs[1].getComponent(Health).hp = 0;
world.removeEntity(minionDogs[1]);
```

## [Code of Conduct](./CODE_OF_CONDUCT.md)
