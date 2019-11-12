
# Class: Removed <**T**>

Used to fetch all [Entities](_index_.entity.md) that were marked for removal since the last [World.maintain](_index_.world.md#maintain).
To be used in a [System](_index_.system.md) with queries.

```typescript
const funeralService = new flock.System((deadPeople) => {}, [new flock.Removed()]);
```

## Type parameters

▪ **T**

## Implements

* ComponentQuery‹T›

## Constructors

###  constructor

\+ **new Removed**(): *[Removed](_index_.removed.md)*

**Returns:** *[Removed](_index_.removed.md)*

## Properties

###  component

• **component**: *[Component](_index_.component.md)‹T›* =  new Component(null as any)
