class BaseComponent { }

class Entity {
	components: Map<string, InstanceType<typeof BaseComponent>> = new Map();
	addComponent(component: InstanceType<typeof BaseComponent>) {
		this.components.set(component.constructor.name, component);
	}
	getComponent<C extends typeof BaseComponent>(
		component: C,
	): InstanceType<C> | undefined {
		return this.components.get(component.name) as InstanceType<C> | undefined;
	}
	hasComponent(component: typeof BaseComponent): boolean {
		return this.components.has(component.name);
	}
	removeComponent(component: BaseComponent) {
		this.components.delete(component.constructor.name);
	}
	// TODO: implement
	destroy() { }
}

// TODO: Resource
// TODO: Tag

class World {
	entities: Array<Entity> = [];
	createEntity(): Entity {
		const entity = new Entity();
		this.entities.push(entity);
		return entity;
	}
	query(params: Array<QueryParam>): Array<Entity> {
		return this.entities.filter((entity) => {
			return params.every((test) => test(entity));
		});
	}
}

type QueryParam = (entity: Entity) => boolean;

const With = (Component: typeof BaseComponent): QueryParam =>
	(entity: Entity): boolean => entity.hasComponent(Component);

const Without = (Component: typeof BaseComponent): QueryParam =>
	(entity: Entity): boolean => !entity.hasComponent(Component);

const Or = (left: QueryParam, right: QueryParam): QueryParam =>
	(entity: Entity): boolean => left(entity) || right(entity);

export { type Entity, World, Without, With, Or };
