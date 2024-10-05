import { Point } from "pixi.js";
import { Entity, World } from "../ecs.ts";
import { Graphics } from "../graphics.ts";
import { Mouse } from "../input.ts";

class ClickTarget {}
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
		{
			const entity = new Entity();
			entity.addComponent(new Mushroom());
			entity.addComponent(new Position(400, 300));
			entity.addComponent(new ClickTarget());
			this.world.addEntity(entity);
		}
	}
	update() {

	}
	render() {}
}

