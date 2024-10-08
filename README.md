![logo](logo.png)

# Flock

[![GitHub](https://img.shields.io/github/license/dannyfritz/flock-ecs?style=for-the-badge)](https://github.com/dannyfritz/flock-ecs/blob/master/LICENSE)
[![npm badge](https://img.shields.io/npm/v/flock-ecs?style=for-the-badge)](https://www.npmjs.com/package/flock-ecs)

A collection of tools for making interactive experiences in a web browser.

> [!IMPORTANT]  
> Only intended to work in a modern web browser environment.

**Tools:**

- ECS
- Graphics
- Input
- Math
- Pool
- Time

**Goals:**

- Simple API
- Good TypeScript types

**Non-Goals:**

- Performance
- Parallelization

### Inspiration

- [LÖVE](https://love2d.org/)
- [Bevy Engine](https://bevyengine.org/)

## Install

```sh
npm install -S @dannyfritz/flock
```

## Tools

### ECS (`@dannyfritz/flock/ecs`)

```ts
import { World, With, Entity } from "@dannyfritz/flock/ecs";
class Health { hp = 0 }
class Boss {}
class Player {}
function initSystem(world: World) {
	for (const player of world.query(With(Player))) {
		player.getComponent(Health).hp = 100;
	}
	for (const boss of world.query(With(Boss))) {
		boss.getComponent(Health).hp = 500;
	}
}
function dieSystem(world: World) {
	players[0].getComponent(Health).hp = 0;
	world.removeEntity(players[0]);
}
const world = new World();
world.addEntity(
	new Entity().addComponent(new Health()).addComponent(new Player()),
);
world.addEntity(
	new Entity().addComponent(new Health()).addComponent(new Boss()),
);
initSystem(world);
dieSystem(world);
```

### Input (`@dannyfritz/flock/input`)

```typescript
import { Mouse, Keyboard } from "@dannyfritz/flock/input";
// Mouse
const mouse = new Mouse();
mouse.buttons.register(0);
mouse.tick();
console.log(mouse.buttons.get(0));
// Keyboard
const keyboard = new Keyboard();
keyboard.keys.register("KeyA");
keyboard.tick();
console.log(keyboard.keys.get("KeyA"));
```

### Graphics (`@dannyfritz/flock/graphics`)

```typescript
const graphics = new Graphics();
const matrix = new Matrix();
matrix.translate(100, 200);
this.graphics.circle(5, matrix, { stroke: "#FFFFFF" });
graphics.render();
```

### Pool (`@dannyfritz/flock/pool`)

```typescript
class Item { value = 0 }
const pool = new Pool(() => new Item, (item) { item.value = 0; return item; });
const item1 = pool.get();
pool.reset();
console.log(item1 === pool.get());
```

### Time (`@dannyfritz/flock/time`)

```typescript
const { Timer, Stopwatch } from "@dannyfritz/flock/time"
// Timer
const timer = new Timer(60);
timer.tick();
console.log(timer.remaining)
while (true) {
	update();
	if (timer.isFinished) {
		timer.rollover();
	}
}
// Stopwatch
const stopwatch = new Stopwatch();
stopwatch.tick(30);
console.log(stopwatch.elapsed); // 30
```

## [Code of Conduct](./CODE_OF_CONDUCT.md)
