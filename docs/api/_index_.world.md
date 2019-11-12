
# Class: World

Maintains all of the entities and performs queries.

```ts
const world = new flock.World()
```

## Constructors

###  constructor

\+ **new World**(): *[World](_index_.world.md)*

**Returns:** *[World](_index_.world.md)*

## Methods

###  _addEntityComponent

▸ **_addEntityComponent**<**T**>(`entity`: [Entity](_index_.entity.md), `component`: [Component](_index_.component.md)‹T›, `componentValue`: ComponentValue‹T›): *void*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`entity` | [Entity](_index_.entity.md) |
`component` | [Component](_index_.component.md)‹T› |
`componentValue` | ComponentValue‹T› |

**Returns:** *void*

___

###  _getEntityComponent

▸ **_getEntityComponent**<**T**>(`entity`: [Entity](_index_.entity.md), `component`: [Component](_index_.component.md)‹T›): *ComponentValue‹T› | undefined*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`entity` | [Entity](_index_.entity.md) |
`component` | [Component](_index_.component.md)‹T› |

**Returns:** *ComponentValue‹T› | undefined*

___

###  _removeEntityComponent

▸ **_removeEntityComponent**<**T**>(`entity`: [Entity](_index_.entity.md), `component`: [Component](_index_.component.md)‹T›): *ComponentValue‹T› | undefined*

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`entity` | [Entity](_index_.entity.md) |
`component` | [Component](_index_.component.md)‹T› |

**Returns:** *ComponentValue‹T› | undefined*

___

###  createEntity

▸ **createEntity**(): *[Entity](_index_.entity.md)*

Creates a new [Entity](_index_.entity.md).

```ts
const entity = world.createEntity();
```

**Returns:** *[Entity](_index_.entity.md)*

___

###  maintain

▸ **maintain**(): *void*

Removes [Entities](_index_.entity.md) from the [World](_index_.world.md) that have been marked for [removal](_index_.entity.md#remove).
Unmarks [Entities](_index_.entity.md) as `added`.

```ts
world.maintain();
```

**Returns:** *void*

___

###  query

▸ **query**(`componentQueries`: ComponentQuery‹any›[]): *[Entity](_index_.entity.md)[]*

Given a set of [Without](_index_.without.md), [Current](_index_.current.md), [Removed](_index_.removed.md), and [Added](_index_.added.md),
will return a list of [Entities](_index_.entity.md) that match the query.

Typically this is not used directly,
but implictly when [System.run](_index_.system.md#run) is called.

**Parameters:**

Name | Type |
------ | ------ |
`componentQueries` | ComponentQuery‹any›[] |

**Returns:** *[Entity](_index_.entity.md)[]*

___

###  registerComponent

▸ **registerComponent**<**T**>(`component`: [Component](_index_.component.md)‹T›): *void*

Registers a [Component](_index_.component.md) with the [World](_index_.world.md).

```ts
const age = new flock.Component(() => 30);
world.registerComponent(age);
```

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](_index_.component.md)‹T› |

**Returns:** *void*

___

###  unregisterComponent

▸ **unregisterComponent**<**T**>(`component`: [Component](_index_.component.md)‹T›): *void*

Unregisters a [Component](_index_.component.md) with the [World](_index_.world.md).

```ts
const age = new flock.Component(() => 30);
world.registerComponent(age);
world.unregisterComponent(age);
```

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`component` | [Component](_index_.component.md)‹T› |

**Returns:** *void*
