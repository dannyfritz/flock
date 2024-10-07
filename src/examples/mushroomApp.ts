import { Matrix, Point, Polygon, type ShapePrimitive } from "pixi.js";
import { And, Entity, With, World } from "../ecs.ts";
import { chunk, Graphics } from "../graphics.ts";
import { BUTTON_STATE, Mouse } from "../input.ts";
import { Alarm, Stopwatch } from "../time.ts";

const DEBUG = true;
class Trigger {
	active = false;
	hover = false;
}
class TriggerShapes {
	shapes: Array<ShapePrimitive>;
	constructor(shapes: Array<ShapePrimitive>) {
		this.shapes = shapes;
	}
	contains(point: Point): boolean {
		return this.shapes.some((shape) => shape.contains(point.x, point.y));
	}
}
class Transform extends Matrix {}
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
		entity.addComponent(new Transform().translate(399, 300));
		entity.addComponent(new Trigger());
		entity.addComponent(
			new TriggerShapes([
				new Polygon([
					new Point(-50, -50),
					new Point(-50, 150),
					new Point(50, 150),
					new Point(50, -50),
				]),
			]),
		);
		this.world.addEntity(entity);
	}
	update() {
		this.mouse.tick();
		for (const entity of this.world.query(
			And(With(Trigger), With(TriggerShapes), With(Transform)),
		)) {
			const trigger = entity.getComponent(Trigger);
			const triggerShapes = entity.getComponent(TriggerShapes);
			const transform = entity.getComponent(Transform);
			const cursor = transform.applyInverse(this.mouse.position);
			trigger.hover = false;
			trigger.active = false;
			if (triggerShapes.contains(cursor)) {
				trigger.hover = true;
				if (this.mouse.buttons.get(0) === BUTTON_STATE.PRESSED) {
					trigger.active = true;
				}
			}
		}
		for (const entity of this.world.query(With(Alarm))) {
			const alarm = entity.getComponent(Alarm);
			alarm.tick(1);
			if (alarm.isTriggered) {
				this.world.removeEntity(entity);
			}
		}
		for (const entity of this.world.query(
			And(With(Mushroom), With(Trigger), With(Transform)),
		)) {
			const trigger = entity.getComponent(Trigger);
			const transform = entity.getComponent(Transform);
			if (trigger.active) {
				const sporeEntity = new Entity();
				sporeEntity.addComponent(new Spore());
				sporeEntity.addComponent(new Transform().copyFrom(transform));
				sporeEntity.addComponent(new Alarm(200));
				const velocity = new Velocity();
				velocity.x = Math.random() * 2 - 1;
				velocity.y = Math.random() * 2 - 1;
				sporeEntity.addComponent(velocity);
				this.world.addEntity(sporeEntity);
			}
		}
		for (const entity of this.world.query(
			And(With(Velocity), With(Transform)),
		)) {
			const transform = entity.getComponent(Transform);
			const velocity = entity.getComponent(Velocity);
			transform.translate(velocity.x, velocity.y);
		}
	}
	render() {
		for (const mushroom of this.world.query(And(With(Mushroom)))) {
		}
		if (DEBUG) {
			for (const entity of this.world.query(
				And(With(Trigger), With(TriggerShapes), With(Transform)),
			)) {
				const trigger = entity.getComponent(Trigger);
				const transform = entity.getComponent(Transform);
				const triggerShapes = entity.getComponent(TriggerShapes);
				const color = trigger.active ? "red" : trigger.hover ? "blue" : "green";
				for (const shape of triggerShapes.shapes) {
					this.graphics.shape(shape, transform, { stroke: color });
				}
			}
			for (const entity of this.world.query(With(Transform))) {
				const transform = entity.getComponent(Transform);
				this.graphics.circle(1, transform, { stroke: "green" });
			}
			for (const entity of this.world.query(
				And(With(Velocity), With(Transform)),
			)) {
				const transform = entity.getComponent(Transform);
				const velocity = entity.getComponent(Velocity);
				if (velocity) {
					this.graphics.line(new Point(0, 0), velocity.multiplyScalar(5), transform, {
						stroke: "blue",
					});
				}
			}
			const color =
				this.mouse.buttons.get(0) === BUTTON_STATE.PRESSED
					? "red"
					: this.mouse.buttons.get(0) === BUTTON_STATE.DOWN
						? "blue"
						: "green";
			this.graphics.circle(
				4,
				this.graphics.matrixPool
					.get()
					.translate(this.mouse.position.x, this.mouse.position.y),
				{ stroke: color },
			);
		}
		this.graphics.render();
	}
}
