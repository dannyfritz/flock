![logo](logo.png)

[![GitHub](https://img.shields.io/github/license/dannyfritz/flock-ecs?style=for-the-badge)](https://github.com/dannyfritz/flock-ecs/blob/master/LICENSE)
[![npm badge](https://img.shields.io/npm/v/flock-ecs?style=for-the-badge)](https://www.npmjs.com/package/flock-ecs)

An entity component system (ECS) created with TypeScript in mind.

## Features

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

## [Roadmap](https://github.com/dannyfritz/flock-ecs/issues/1)

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
      const position = entity.getComponent(Position)!;
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

## [API Docs](https://dannyfritz.github.io/flock-ecs/)

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

To run tests:

```sh
yarn test
```

To run tests in watch mode:

```sh
yarn test:dev
```

## [Code of Conduct](./CODE_OF_CONDUCT.md)
