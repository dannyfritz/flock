# Flock

An entity component system (ECS) created with TypeScript in mind.

## Featues

* No dependencies
* Very good TypeScript typings
* Simple, but powerful API
* Designed for performance
* Struct of Arrays for storing entity component values
* Entities are queryable by:
  * Component
  * Absence of Component
  * Added Entity
  * Removed Entity
* Systems can have 1 or more queries

## Install

```sh
npm install flock-ecs
```

```ts
const flock = require("flock-ecs");
//or
import * as flock from "flock-ecs";
```

## Examples

### [Simple](./examples/simple)

```ts
import * as flock from 'flock-ecs';

const world = new flock.World();

const Position = new flock.Component(
  () => ({
    x: 0,
    y: 0,
  })
);
world.registerComponent(Position);

const logSystem = new flock.System(
  (entities) => {
    entities.forEach(entity => {
      const position = entity.getComponentValue(Position)!;
      console.log(`{ x: ${position.value.x}, y: ${position.value.y} }`);
    });
  },
  [ Position ],
);

for (let i=0; i<10; i++) {
  const entity = world.createEntity();
  entity.addComponent(Position, { x: Math.random() * 100, y: Math.random() * 100 });
}

logSystem.run(world);
world.maintain();
```

### [Boids](./examples/boids)

## Development

This repo uses Yarn workspaces, so make sure you're using yarn instead of npm.

To build the library in watch mode:

```sh
yarn workspace flock-ecs dev
```

And then to live build one of the examples, in another terminal:

```sh
yarn workspace boids start
```

## [Code of Conduct](./CODE_OF_CONDUCT.md)
