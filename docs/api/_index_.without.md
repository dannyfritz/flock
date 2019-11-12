
# Class: Without <**T**>

Used to fetch all [Entities](_index_.entity.md) that do not have a [Component](_index_.component.md).
To be used in a [System](_index_.system.md) with queries.

```typescript
const minorComponent = new flock.Component(() => {});
const notMinor = new flock.Without(minorComponent);
const watchViolentMovie = new flock.System((adults) => {}, [notMinor]);
```

## Type parameters

▪ **T**

## Implements

* ComponentQuery‹T›

## Constructors

###  constructor

\+ **new Without**(`component`: [Component](_index_.component.md)‹T›): *[Without](_index_.without.md)*

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](_index_.component.md)‹T› |

**Returns:** *[Without](_index_.without.md)*

## Properties

###  component

• **component**: *[Component](_index_.component.md)‹T›*
