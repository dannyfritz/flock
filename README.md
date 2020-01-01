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

## [API Docs](https://dannyfritz.github.io/flock-ecs/)

## Examples

### [Simple](./examples/simple)

```ts
import * as flock from 'flock-ecs';
const NUMBER_OF_ENTITIES = 20;

const world = new flock.World(NUMBER_OF_ENTITIES);

const Position = new flock.ComponentF32(NUMBER_OF_ENTITIES, 2);
world.registerComponent(Position);

const logSystem = new flock.System(
  (entities) => {
    entities.forEach(entityId => {
      const position = Position.getValues(entityId)!;
      console.log(`{ x: ${position[0]}, y: ${position[1]} }`);
    });
  },
  [ Position ],
);

for (let i=0; i<10; i++) {
  const entityId = world.createEntity();
  Position.addEntity(entityId, [Math.random() * 100, Math.random() * 100]);
}

logSystem.run(world);
world.maintain();
```

[![Image of Maggots example](./examples/maggots/screenshot.gif)](./examples/maggots)
[![Image of Boids example](./examples/boids/screenshot.gif)](./examples/boids)

## Development

### Yarn

This repo uses [Yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/), so make sure you're using `yarn` instead of `npm`.

### Relevant Commands

```sh
yarn build # Build library
yarn build:dev # Build library in watch mode
yarn lint # Lint the TypeScript
yarn test # Run tests
yarn test:dev # Run tests in watch mode
yarn docs # Build documentation
yarn docs:dev # Build documentaiton in watch mode
yarn workspace simple start # Run the Simple example
yarn workspace boids start # Run the Boids example
yarn workspace particle-system start # Run the Particle-System example
```

## [Code of Conduct](./CODE_OF_CONDUCT.md)
