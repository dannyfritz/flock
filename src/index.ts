class BaseComponent {}

class Entity {
	components: Map<unknown, InstanceType<typeof BaseComponent>> = new Map();
	addComponent(component: InstanceType<typeof BaseComponent>): Entity {
		if (this.hasComponent(component.constructor as typeof BaseComponent))
			throw new Error(
				`Component "${component.constructor.name}" already exists on Entity!`,
			);
		this.components.set(component.constructor, component);
		return this;
	}
	getComponent<C extends typeof BaseComponent>(Component: C): InstanceType<C> {
		const c = this.components.get(Component) as InstanceType<C>;
		if (c === undefined)
			throw new Error(`Component "${Component.name}" doesn't exist on Entity!`);
		return c;
	}
	hasComponent(Component: typeof BaseComponent): boolean {
		return this.components.has(Component);
	}
	removeComponent(Component: typeof BaseComponent): Entity {
		if (!this.hasComponent(Component))
			throw new Error(`Component "${Component.name}" doesn't exist on Entity!`);
		this.components.delete(Component);
		return this;
	}
}

class World {
	entities: Array<Entity> = [];
	addEntity(entity: Entity): World {
		this.entities.push(entity);
		return this;
	}
	removeEntity(entity: Entity): World {
		const index = this.entities.indexOf(entity);
		if (index === undefined) return this;
		this.entities.splice(index, 1);
		return this;
	}
	query(queryParam: QueryParam): Array<Entity> {
		return query(this.entities, queryParam);
	}
}

const query = (
	entities: Array<Entity>,
	queryParam: QueryParam,
): Array<Entity> => {
	return entities.filter((entity) => {
		return queryParam(entity);
	});
};

type QueryParam = (entity: Entity) => boolean;

const With =
	(Component: typeof BaseComponent): QueryParam =>
	(entity: Entity): boolean =>
		entity.hasComponent(Component);

const Without =
	(Component: typeof BaseComponent): QueryParam =>
	(entity: Entity): boolean =>
		!entity.hasComponent(Component);

const And =
	(...params: Array<QueryParam>): QueryParam =>
	(entity: Entity): boolean =>
		params.every((param) => param(entity));

const Or =
	(...params: Array<QueryParam>): QueryParam =>
	(entity: Entity): boolean =>
		params.some((param) => param(entity));

export { Entity, World, query, Without, With, And, Or };
