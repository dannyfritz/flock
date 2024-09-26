![logo](logo.png)

# Flock

[![GitHub](https://img.shields.io/github/license/dannyfritz/flock-ecs?style=for-the-badge)](https://github.com/dannyfritz/flock-ecs/blob/master/LICENSE)
[![npm badge](https://img.shields.io/npm/v/flock-ecs?style=for-the-badge)](https://www.npmjs.com/package/flock-ecs)

A collection of tools for making interactive experiences in a web browser.

> [!IMPORTANT]  
> Only intended to work in a modern web browser environment.

**Tools:**
- Audio
- ECS
- Input
- Math
- Graphics
- Time

**Goals:**
- Simple API
- Good typescript types
- Simple code

**Non-Goals:**
- Performance
- Parallelization

## Install

```sh
npm install -S @dannyfritz/flock
```

## Tools

### Audio (`@dannyfritz/flock/audio`)

TBD

### ECS (`@dannyfritz/flock/ecs`)

```ts
import { World, And, Or, With, Without, Entity } from "@dannyfritz/flock/ecs";
class Health {
	hp = 0;
}
class Boss {}
class Player {}
const world = new World();
world.addEntity(
	new Entity().addComponent(new Health()).addComponent(new Player()),
);
world.addEntity(
	new Entity().addComponent(new Health()).addComponent(new Boss()),
);
function initSystem(world: World) {
	const players = world.query(With(Player));
	for (const player of players) {
		player.getComponent(Health).hp = 100;
	}
	const bosses = world.query(With(Boss));
	for (const boss of bosses) {
		boss.getComponent(Health).hp = 500;
	}
}
initSystem(world);
function dieSystem(world: World) {
	players[0].getComponent(Health).hp = 0;
	world.removeEntity(players[0]);
}
dieSystem(world);
```

### Input (`@dannyfritz/flock/input`)

```typescript
import { Mouse, Keyboard } from "@dannyfritz/flock/input"
// Mouse
const mouse = new Mouse({ target: document.querySelector("#game") });
console.log(mouse.x, mouse.y);
mouse.tick();
console.log(mouse.state(0), mouse.state(1));
// Keyboard
const keyboard = new Keyboard({ target: document.querySelector("#game") });
keyboard.tick();
console.log(keyboard.state("KeyA"));
```

### Math (`@dannyfritz/flock/math`)

```typescript
import { Vector2 } from "@dannyfritz/flock/math"

const position = new Vector2(10, 20);
console.log(position.x, position.y);
```

### Graphics (`@dannyfritz/flock/graphics`)

TBD

### Time (`@dannyfritz/flock/time`)

```typescript
const { Alarm, Stopwatch } from "@dannyfritz/flock/time"
// Alarm
const alarm = new Alarm(60);
alarm.tick();
console.log(alarm.remaining)
while (alarm.isTriggered) {
	update();
	alarm.rollover();
}
// Stopwatch
const stopwatch = new Stopwatch();
stopwatch.tick(30);
console.log(stopwatch.elapsed); // 30
```

## [Code of Conduct](./CODE_OF_CONDUCT.md)
