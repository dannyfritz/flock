class BaseComponent { }

class Entity {
	components: Map<unknown, InstanceType<typeof BaseComponent>> = new Map();
	addComponent(component: InstanceType<typeof BaseComponent>) {
		this.components.set(component.constructor, component);
	}
	getComponent<C extends typeof BaseComponent>(
		Component: C,
	): InstanceType<C> | undefined {
		return this.components.get(Component) as InstanceType<C> | undefined;
	}
	hasComponent(Component: typeof BaseComponent): boolean {
		return this.components.has(Component);
	}
	removeComponent(Component: typeof BaseComponent) {
		this.components.delete(Component);
	}
	destroy(world: World) {
		world.removeEntity(this);
	}
}

class World {
	entities: Array<Entity> = [];
	createEntity(): Entity {
		const entity = new Entity();
		this.entities.push(entity);
		return entity;
	}
	removeEntity(entity: Entity) {
		const index = this.entities.indexOf(entity);
		if (!index) return;
		this.entities.splice(index, 1);
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
