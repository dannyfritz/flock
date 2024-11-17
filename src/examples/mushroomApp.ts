import {
	Matrix,
	Point,
	Polygon,
	Rectangle,
	type Texture,
	type ShapePrimitive,
} from "pixi.js";
import { And, Entity, With, World } from "../ecs.ts";
import { chunk, Graphics } from "../graphics.ts";
import { BUTTON_STATE, Mouse } from "../input.ts";
import { Timer, Stopwatch } from "../time.ts";
import sporeImageFile from "../../static/spore.png";
import mushroomImageFile from "../../static/mushroom.png";

const DEBUG = false;
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
class Spore {
	parent: boolean;
	constructor(parent: boolean) {
		this.parent = parent;
	}
}

// const randomPointInDisc = (): Velocity => {
// 	return new Velocity();
// }
//
// const newSpore = (parent: boolean, velocity: Velocity, transform: Transform): Spore => {
// 	const spore = new Entity();
// 	spore.addComponent(new Spore(false));
// 	spore.addComponent(new Transform().copyFrom(transform));
// 	spore.addComponent(new Timer(50));
// 	const new_velocity = new Velocity();
// 	new_velocity.x += Math.random() - 0.5;
// 	new_velocity.y += Math.random() - 0.5;
// 	new_velocity.normalize(new_velocity);
// 	new_velocity.multiplyScalar(Math.random() / 4, new_velocity);
// 	new_velocity.add(velocity, new_velocity);
// 	spore.addComponent(new_velocity);
// 	return spore;
// };

export class MushroomApp {
	graphics = new Graphics();
	mouse = new Mouse();
	world = new World();
	sporeTexture: Texture | undefined;
	mushroomTexture: Texture | undefined;
	async init() {
		await this.graphics.init();
		this.sporeTexture = await Graphics.loadTexture(sporeImageFile);
		this.mushroomTexture = await Graphics.loadTexture(mushroomImageFile);
		this.mouse.bind(this.graphics);
		const entity = new Entity();
		entity.addComponent(new Mushroom());
		entity.addComponent(new Transform().translate(400, 300));
		entity.addComponent(new Trigger());
		entity.addComponent(
			new TriggerShapes([
				new Polygon([
					new Point(-50, -100),
					new Point(-50, 100),
					new Point(50, 100),
					new Point(50, -100),
				]),
				new Rectangle(-100, -100, 200, 100),
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
		for (const entity of this.world.query(With(Timer))) {
			const alarm = entity.getComponent(Timer);
			alarm.tick(1);
		}
		for (const entity of this.world.query(
			And(With(Timer), With(Spore), With(Transform)),
		)) {
			const alarm = entity.getComponent(Timer);
			const spore = entity.getComponent(Spore);
			if (alarm.isFinished) {
				this.world.removeEntity(entity);
			} else if (spore.parent && Math.random() > 0.6) {
				const transform = entity.getComponent(Transform);
				const velocity = entity.getComponent(Velocity);
				const newSporeEntity = new Entity();
				newSporeEntity.addComponent(new Spore(false));
				newSporeEntity.addComponent(new Transform().copyFrom(transform));
				newSporeEntity.addComponent(new Timer(50));
				const new_velocity = new Velocity();
				new_velocity.x += Math.random() - 0.5;
				new_velocity.y += Math.random() - 0.5;
				new_velocity.normalize(new_velocity);
				new_velocity.multiplyScalar(Math.random() / 3, new_velocity);
				new_velocity.add(velocity, new_velocity);
				newSporeEntity.addComponent(new_velocity);
				this.world.addEntity(newSporeEntity);
			}
		}
		for (const entity of this.world.query(
			And(With(Mushroom), With(Trigger), With(Transform)),
		)) {
			const trigger = entity.getComponent(Trigger);
			const transform = entity.getComponent(Transform);
			if (trigger.active) {
				const sporeEntity = new Entity();
				sporeEntity.addComponent(new Spore(true));
				sporeEntity.addComponent(
					new Transform()
						.copyFrom(transform)
						.translate(Math.random() * 100 - 50, Math.random() * -50),
				);
				sporeEntity.addComponent(new Timer(200));
				const velocity = new Velocity();
				velocity.x = Math.random() - 0.5;
				velocity.y = Math.random() - 0.5;
				velocity.normalize(velocity);
				velocity.multiplyScalar(Math.random() / 2, velocity);
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
	DEBUG() {
		if (!DEBUG) return;
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
				this.graphics.line(
					this.graphics.pointPool.get(),
					velocity.multiplyScalar(10),
					transform,
					{
						stroke: "blue",
					},
				);
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
	render() {
		const mushroomTransform = new Transform();
		mushroomTransform.translate(-512/2, -512/2)
		mushroomTransform.scale(0.5, 0.5);
		mushroomTransform.translate(400, 300);
		this.graphics.sprite(this.mushroomTexture, mushroomTransform);
		for (const entity of this.world.query(And(With(Spore), With(Transform)))) {
			const transform = entity.getComponent(Transform);
			const spriteTransform = new Transform();
			spriteTransform.translate(-30, -30);
			spriteTransform.scale(0.25, 0.25);
			spriteTransform.translate(transform.tx, transform.ty);
			this.graphics.sprite(this.sporeTexture, spriteTransform);
		}
		this.DEBUG();
		this.graphics.render();
	}
}
