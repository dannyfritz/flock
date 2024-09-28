import { Matrix, Point, type Texture } from "pixi.js";
import "pixi.js/math-extras"
import { Graphics } from "../graphics.ts";
import { And, Entity, With, World, query } from "../ecs.ts";
import { BUTTON_STATE, Mouse } from "../input.ts";

class Planet {}
class Satellite {}

class Position extends Point {}

class Velocity extends Point {}

export class ParticlesApp {
	graphics: Graphics;
	texture: Texture | undefined;
	world: World;
	mouse: Mouse;
	constructor() {
		this.graphics = new Graphics();
		this.world = new World();
		this.mouse = new Mouse();
	}
	async init(): Promise<void> {
		await this.graphics.init();
		this.graphics.el.addEventListener("pointermove", (event) => {
			this.mouse.position.x = event.offsetX;
			this.mouse.position.y = event.offsetY;
		});
		this.graphics.el.addEventListener("contextmenu", (event) => {
			event.preventDefault();
			return false;
		});
		this.graphics.el.addEventListener("pointerdown", (event) => {
			event.stopPropagation();
			event.stopImmediatePropagation();
			event.preventDefault();
			this.mouse.buttons.register(event.button);
		});
		this.graphics.el.addEventListener("pointerup", (event) => {
			this.mouse.buttons.unregister(event.button);
		});
	}
	render() {
		this.mouse.tick();
		if (this.mouse.buttons.get(0) === BUTTON_STATE.DOWN) {
			const entity = new Entity();
			const position = new Position(
				this.mouse.position.x,
				this.mouse.position.y,
			);
			console.log(position);
			entity.addComponent(position);
			entity.addComponent(new Satellite());
			entity.addComponent(new Velocity(0, 0));
			this.world.addEntity(entity);
		}
		if (this.mouse.buttons.get(2) === BUTTON_STATE.PRESSED) {
			const entity = new Entity();
			const position = new Position(
				this.mouse.position.x,
				this.mouse.position.y,
			);
			entity.addComponent(position);
			entity.addComponent(new Planet());
			this.world.addEntity(entity);
		}
		const satellites = query(this.world.entities, With(Satellite));
		const planets = query(this.world.entities, With(Planet));
		for (const entity of satellites) {
			const position = entity.getComponent(Position);
			const velocity = entity.getComponent(Velocity);
			for (const planet of planets) {
				// TODO: Perform gravity
				// Find direction towards planet
				// Find distnace to planet
				// Add to velocity in that direction
			}
			position.add(velocity);
		}
		for (const entity of satellites) {
			const position = entity.getComponent(Position);
			const matrix = new Matrix();
			matrix.translate(position.x, position.y);
			this.graphics.circle(5, matrix, { stroke: "#FFFFFF" });
		}
		for (const entity of planets) {
			const position = entity.getComponent(Position);
			const matrix = new Matrix();
			matrix.translate(position.x, position.y);
			this.graphics.circle(15, matrix, { stroke: "#FF0000" });
		}
		this.graphics.render();
	}
}
