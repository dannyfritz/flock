import { Matrix, Point, type Texture } from "pixi.js";
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
		this.mouse.bind(this.graphics);
	}
	update() {
		const MAX_SPEED = 5;
		this.mouse.tick();
		if (this.mouse.buttons.get(0) === BUTTON_STATE.DOWN) {
			const entity = new Entity();
			const position = new Position(
				this.mouse.position.x,
				this.mouse.position.y,
			);
			entity.addComponent(position);
			entity.addComponent(new Satellite());
			const angle = Math.random() * 2 * Math.PI;
			const radius = Math.sqrt(Math.random() * MAX_SPEED);
			entity.addComponent(
				new Velocity(radius * Math.cos(angle), radius * Math.sin(angle)),
			);
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
		for (const satellite of satellites) {
			const position = satellite.getComponent(Position);
			const velocity = satellite.getComponent(Velocity);
			const displacement = new Point();
			for (const planet of planets) {
				planet.getComponent(Position).subtract(position, displacement);
				const distance = displacement.magnitude();
				displacement.multiplyScalar(2 / distance ** 2, displacement);
				velocity.add(displacement, velocity);
			}
			const speed = velocity.magnitude();
			if (speed > MAX_SPEED) {
				velocity.multiplyScalar(MAX_SPEED / speed, velocity);
			}
			position.add(velocity, position);
		}
	}
	render() {
		const satellites = query(this.world.entities, With(Satellite));
		const planets = query(this.world.entities, With(Planet));
		for (const entity of satellites) {
			const position = entity.getComponent(Position);
			const matrix = this.graphics.matrixPool.get();
			matrix.translate(position.x, position.y);
			this.graphics.circle(5, matrix, { stroke: "#FFFFFF" });
		}
		for (const entity of planets) {
			const position = entity.getComponent(Position);
			const matrix = this.graphics.matrixPool.get();
			matrix.translate(position.x, position.y);
			this.graphics.circle(15, matrix, { stroke: "#FF0000" });
		}
		const matrix = this.graphics.matrixPool.get();
		this.graphics.text(
			`Planets: ${planets.length}\nSatellites: ${satellites.length}`,
			matrix,
			{ fill: "#FFFFFFFF" },
		);
		this.graphics.render();
	}
}
