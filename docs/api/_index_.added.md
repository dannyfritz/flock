
# Class: Added <**T**>

Used to fetch all [Entities](_index_.entity.md) that were added since the last [World.maintain](_index_.world.md#maintain).
To be used in a [System](_index_.system.md) with queries.

```typescript
const cry = new flock.System((babies) => {}, [new flock.Added()]);
```

## Type parameters

▪ **T**

## Implements

* ComponentQuery‹T›

## Constructors

###  constructor

\+ **new Added**(): *[Added](_index_.added.md)*

**Returns:** *[Added](_index_.added.md)*

## Properties

###  component

• **component**: *[Component](_index_.component.md)‹T›* =  new Component(null as any)
