import memoize from "memoize";
import ManyKeysMap from "many-keys-map";
type Ctor<T = object> = abstract new (...args: never) => T;

class Entity {
	components: Map<Ctor<unknown>, object> = new Map();
	addComponent<T extends object>(component: T): Entity {
		if (this.hasComponent(component.constructor as Ctor))
			throw new Error(
				`Component "${component.constructor.name}" already exists on Entity!`,
			);
		this.components.set(component.constructor as Ctor, component);
		return this;
	}
	getComponent<C>(Component: Ctor<C>): C {
		const c = this.components.get(Component);
		if (c === undefined)
			throw new Error(`Component "${Component.name}" doesn't exist on Entity!`);
		return c as C;
	}
	hasComponent(Component: Ctor): boolean {
		return this.components.has(Component);
	}
	removeComponent(Component: Ctor): Entity {
		if (!this.hasComponent(Component))
			throw new Error(`Component "${Component.name}" doesn't exist on Entity!`);
		this.components.delete(Component);
		return this;
	}
}

class World {
	entities: Array<Entity> = [];
	addEntity(entity: Entity): World {
		this.entities = [...this.entities, entity];
		return this;
	}
	removeEntity(entity: Entity): World {
		const index = this.entities.indexOf(entity);
		if (index === undefined) return this;
		this.entities = this.entities.toSpliced(index, 1);
		return this;
	}
	query(queryParam: QueryParam): Array<Entity> {
		return query(this.entities, queryParam);
	}
}

const query = memoize(
	(entities: Array<Entity>, queryParam: QueryParam): Array<Entity> => {
		return entities.filter((entity) => {
			return queryParam(entity);
		});
	},
	{
		cacheKey: (args) => args,
		cache: new ManyKeysMap(),
	},
);

type QueryParam = (entity: Entity) => boolean;

const With = memoize(
	(Component: Ctor): QueryParam =>
		(entity: Entity): boolean =>
			entity.hasComponent(Component),
);

const Without = memoize(
	(Component: Ctor): QueryParam =>
		(entity: Entity): boolean =>
			!entity.hasComponent(Component),
);

const And = memoize(
	(...params: Array<QueryParam>): QueryParam =>
		(entity: Entity): boolean =>
			params.every((param) => param(entity)),
);

const Or = memoize(
	(...params: Array<QueryParam>): QueryParam =>
		(entity: Entity): boolean =>
			params.some((param) => param(entity)),
);

export { Entity, World, query, Without, With, And, Or };
