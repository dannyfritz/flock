import { Point, Polygon, type ShapePrimitive } from "pixi.js";
import { And, Entity, With, World } from "../ecs.ts";
import { Graphics } from "../graphics.ts";
import { BUTTON_STATE, Mouse } from "../input.ts";

const DEBUG = true;
class Trigger {
	active = false;
	hover = false;
	shape: ShapePrimitive;
	constructor(shape: ShapePrimitive) {
		this.shape = shape;
	}
}
class Position extends Point {}
class Velocity extends Point {}
class Mushroom {}
class Spore {}

export class MushroomApp {
	graphics = new Graphics();
	mouse = new Mouse();
	world = new World();
	async init() {
		await this.graphics.init();
		this.mouse.bind(this.graphics);
		const entity = new Entity();
		entity.addComponent(new Mushroom());
		entity.addComponent(new Position(400, 300));
		entity.addComponent(
			new Trigger(
				new Polygon([
					new Point(100, 100),
					new Point(200, 100),
					new Point(100, 200),
				]),
			),
		);
		this.world.addEntity(entity);
	}
	update() {
		this.mouse.tick();
		const triggers = this.world.query(With(Trigger));
		for (const entity of triggers) {
			const trigger = entity.getComponent(Trigger);
			trigger.hover = false;
			trigger.active = false;
			if (
				trigger.shape.contains(this.mouse.position.x, this.mouse.position.y)
			) {
				trigger.hover = true;
				if (this.mouse.buttons.get(0) === BUTTON_STATE.PRESSED) {
					trigger.active = true;
				}
			}
		}
		const mushrooms = this.world.query(And(With(Mushroom)));
		for (const mushroom of mushrooms) {
		}
	}
	render() {
		const mushrooms = this.world.query(And(With(Mushroom)));
		for (const mushroom of mushrooms) {
		}
		if (DEBUG) {
			const triggers = this.world.query(With(Trigger));
			for (const entity of triggers) {
				const trigger = entity.getComponent(Trigger);
				const color = trigger.active ? "red" : trigger.hover ? "blue" : "green";
				if (trigger.shape instanceof Polygon) {
					this.graphics.shape(
						trigger.shape,
						this.graphics.matrixPool.get(),
						{ stroke: color },
					);
				}
			}
			const positions = this.world.query(With(Position));
			for (const entity of positions) {
				const position = entity.getComponent(Position);
				this.graphics.circle(
					1,
					this.graphics.matrixPool.get().translate(position.x, position.y),
					{ stroke: "green" },
				);
			}
			const velocities = this.world.query(And(With(Position), With(Velocity)));
			for (const entity of velocities) {
				const position = entity.getComponent(Position);
				const velocity = entity.getComponent(Velocity);
				if (velocity) {
					this.graphics.line(
						new Point(0, 0),
						velocity,
						this.graphics.matrixPool.get().translate(position.x, position.y),
						{ stroke: "green" },
					);
				}
			}
		}
		this.graphics.render();
	}
}
