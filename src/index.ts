class BaseComponent {}

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
	destroy() {}
}

class World {
	entities: Array<Entity> = [];
	createEntity(): Entity {
		const entity = new Entity();
		this.entities.push(entity);
		return entity;
	}
	query(params: Array<QueryParam>): Array<Entity> {
		return this.entities.filter((entity) => {
			return params.every((param) => param.test(entity));
		});
	}
}

interface QueryParam {
	test(entity: Entity): boolean;
}

class Has implements QueryParam {
	target: typeof BaseComponent;
	constructor(target: typeof BaseComponent) {
		this.target = target;
	}
	test(entity: Entity): boolean {
		return entity.hasComponent(this.target);
	}
}

export { type Entity, World, Has };
