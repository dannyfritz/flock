
# Class: Entity

A container for [Components](_index_.component.md).

Create [Entities](_index_.entity.md) via a [World](_index_.world.md) instance.
```ts
const entity = world.createEntity();
```

## Constructors

###  constructor

\+ **new Entity**(`world`: [World](_index_.world.md), `index`: number): *[Entity](_index_.entity.md)*

**Parameters:**

Name | Type |
------ | ------ |
`world` | [World](_index_.world.md) |
`index` | number |

**Returns:** *[Entity](_index_.entity.md)*

## Properties

###  added

• **added**: *boolean* = true

___

###  index

• **index**: *number*

___

###  removed

• **removed**: *boolean* = false

## Methods

###  addComponent

▸ **addComponent**<**T**>(`component`: [Component](_index_.component.md)‹T›, `value?`: [T](undefined)): *void*

Add a [Component](_index_.component.md) to an [Entity](_index_.entity.md).

```ts
const age = new flock.Component(() => 30);
const entity = world.createEntity();
entity.addComponent(age);
//Second argument can be used to override the default value.
entity.addComponent(age, 44);
```

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](_index_.component.md)‹T› |
`value?` | [T](undefined) |

**Returns:** *void*

___

###  getComponent

▸ **getComponent**<**T**>(`component`: [Component](_index_.component.md)‹T›): *ComponentValue‹T› | undefined*

Get a [Component](_index_.component.md) from an [Entity](_index_.entity.md).
An object with a `value` property will be returned.

```ts
const age = new flock.Component(() => 30);
const entity = world.createEntity();
entity.addComponent(age);
const age = entity.getCompoent(age);
console.log(age.value);
```

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](_index_.component.md)‹T› |

**Returns:** *ComponentValue‹T› | undefined*

___

###  remove

▸ **remove**(): *void*

Mark this entity for removal during the next [World.maintain](_index_.world.md#maintain) call.

```ts
entity.remove();
```

**Returns:** *void*

___

###  removeComponent

▸ **removeComponent**<**T**>(`component`: [Component](_index_.component.md)‹T›): *void*

Remove a [Component](_index_.component.md) from an [Entity](_index_.entity.md).

```ts
const age = new flock.Component(() => 30);
const entity = world.createEntity();
entity.addComponent(age);
entity.removeComponent(age);
```

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](_index_.component.md)‹T› |

**Returns:** *void*
