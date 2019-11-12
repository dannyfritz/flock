
# Class: Current <**T**>

Used to fetch all [Entities](_index_.entity.md) that do have a [Component](_index_.component.md).
To be used in a [System](_index_.system.md) with queries.

```typescript
const minorComponent = new flock.Component(() => {});
const minor = new flock.Current(minorComponent);
const jumpOnBouncyCastle = new flock.System((children) => {}, [new flock.Current(minor)]);
// Alternatively, because Current is very common, can be omitted.
const jumpOnBouncyCastle = new flock.System((children) => {}, [minor]);
```

## Type parameters

▪ **T**

## Implements

* ComponentQuery‹T›

## Constructors

###  constructor

\+ **new Current**(`component`: [Component](_index_.component.md)‹T›): *[Current](_index_.current.md)*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](_index_.component.md)‹T› |

**Returns:** *[Current](_index_.current.md)*

## Properties

###  component

• **component**: *[Component](_index_.component.md)‹T›*
