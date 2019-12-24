
# Class: System

A [System](_index_.system.md) is a function that queries a [World](_index_.world.md) for entities.
It can then perform operations on each [Entity's](_index_.entity.md) [Components](_index_.component.md).

Given a set of [Without](_index_.without.md), [Current](_index_.current.md), [Removed](_index_.removed.md), and [Added](_index_.added.md),
[System.run](_index_.system.md#run) will pass in each query set with a list of appropriate [Entities](_index_.entity.md).

```ts
const position = new flock.Component(() => ({
  x: 0,
  y: 0,
}));
const movement = new flock.Component(() => ({
  x: 0.5,
  y: 0.75,
}));
const movementSystem = new flock.System(
  (birds, rocks) => {}, // This function specifies 2 entity lists: birds and rocks.
  [position, movement], // This is the query for birds. Requires both position and movement on entities
  [position, new flock.Without(movement)], // This is the query for rocks. Requires a position, but no movement on entities.
)
```

## Constructors

###  constructor

\+ **new System**(`runFunction`: function, ...`componentQueries`: ComponentQuery‹any› | [Component](_index_.component.md)‹any›[][]): *[System](_index_.system.md)*

**Parameters:**

▪ **runFunction**: *function*

▸ (...`entities`: [Entity](_index_.entity.md)[][]): *void*

**Parameters:**

Name | Type |
------ | ------ |
`...entities` | [Entity](_index_.entity.md)[][] |

▪... **componentQueries**: *ComponentQuery‹any› | [Component](_index_.component.md)‹any›[][]*

**Returns:** *[System](_index_.system.md)*

## Methods

###  run

▸ **run**(`world`: [World](_index_.world.md)): *void*

Execute the system on a [World](_index_.world.md).

```ts
mySystem.run(world);
```

**Parameters:**

Name | Type |
------ | ------ |
`world` | [World](_index_.world.md) |

**Returns:** *void*
