import { Point, type Texture } from "pixi.js";
import spriteFile from "../../static/extra_character_a.png";
import { And, Entity, With, World } from "../ecs.ts";
import { Graphics } from "../graphics.ts";
import { BUTTON_STATE, Keyboard, type KeyCode } from "../input.ts";
import { Timer } from "../time.ts";

const DT = 1000 / 60;

type Assets = {
	texture: Texture | undefined;
};

type Event = "PLAYER_UP" | "PLAYER_DOWN" | "PLAYER_RIGHT" | "PLAYER_LEFT";

type State = {
	elapsed: number;
};

class Player {}

class Position extends Point {}

class Target {}

export class FindApp {
	graphics = new Graphics();
	keyboard = new Keyboard();
	timer = new Timer(DT);
	world = new World();
	asset: Assets = {
		texture: undefined,
	};
	events: Array<Event> = [];
	state: State = {
		elapsed: -1,
	};
	async init(): Promise<void> {
		await Promise.all([
			this.graphics.init(),
			(async () => {
				this.asset.texture = await Graphics.loadTexture(spriteFile);
			})(),
		]);
		this.graphics.el.addEventListener("keydown", (event) => {
			this.keyboard.keys.register(event.code as KeyCode);
			event.preventDefault();
		});
		this.graphics.el.addEventListener("keyup", (event) => {
			this.keyboard.keys.unregister(event.code as KeyCode);
			event.preventDefault();
		});
		const entity = new Entity();
		entity.addComponent(new Player());
		entity.addComponent(new Position(0, 0));
		this.world.addEntity(entity);
	}
	tick(nextElapsed: number) {
		this.events = [];
		if (this.state.elapsed !== -1) {
			this.timer.tick(nextElapsed - this.state.elapsed);
		}
		this.state.elapsed = nextElapsed;
		while (this.timer.canRollover) {
			this.timer.rollover();
			this.update();
		}
		this.render();
	}
	update() {
		this.update_events();
		this.update_state();
	}
	update_events() {
		this.events = [];
		this.keyboard.tick();
		if (this.keyboard.keys.get("ArrowUp") >= BUTTON_STATE.DOWN) {
			this.events.push("PLAYER_UP");
		}
		if (this.keyboard.keys.get("ArrowDown") >= BUTTON_STATE.DOWN) {
			this.events.push("PLAYER_DOWN");
		}
		if (this.keyboard.keys.get("ArrowLeft") >= BUTTON_STATE.DOWN) {
			this.events.push("PLAYER_LEFT");
		}
		if (this.keyboard.keys.get("ArrowRight") >= BUTTON_STATE.DOWN) {
			this.events.push("PLAYER_RIGHT");
		}
	}
	update_state() {
		const dt = this.timer.duration / 1000;
		const events = this.events;
		const targets = this.world.query(With(Target));
		for (const target of targets) {
			this.world.removeEntity(target);
		}
		const players = this.world.query(And(With(Player), With(Position)));
		for (const entity of players) {
			const position = entity.getComponent(Position);
			for (const event of events) {
				switch (event) {
					case "PLAYER_UP":
						position.y -= 100 * dt;
						break;
					case "PLAYER_DOWN":
						position.y += 100 * dt;
						break;
					case "PLAYER_RIGHT":
						position.x += 100 * dt;
						break;
					case "PLAYER_LEFT":
						position.x -= 100 * dt;
						break;
				}
			}
			const target_entity = new Entity();
			target_entity.addComponent(new Target());
			target_entity.addComponent(
				new Position(
					Math.round(position.x / 128) * 128,
					Math.round(position.y / 128) * 128,
				),
			);
			this.world.addEntity(target_entity);
		}
	}
	render() {
		this.render_graphics();
	}
	render_graphics() {
		const target_entities = this.world.query(With(Target));
		const players = this.world.query(And(With(Player), With(Position)));
		for (const entity of target_entities) {
			const position = entity.getComponent(Position);
			const matrix = this.graphics.matrixPool.get();
			matrix.translate(position.x, position.y);
			this.graphics.rectangle(128, 128, matrix, {
				fill: { alpha: 0.25, color: "white" },
				stroke: { width: 1, alpha: 0.5 },
			});
		}
		for (const entity of players) {
			const position = entity.getComponent(Position);
			const matrix = this.graphics.matrixPool.get();
			matrix.translate(position.x, position.y);
			this.graphics.sprite(this.asset.texture, matrix);
		}
		this.graphics.render();
	}
}
