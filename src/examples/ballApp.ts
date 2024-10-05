import { Howl } from "howler";
import { Matrix, Point } from "pixi.js";
import { And, Entity, With, World } from "../ecs.ts";
import { Graphics } from "../graphics.ts";
import { BUTTON_STATE, Mouse } from "../input.ts";
import blipSoundFile from "../../static/blip.wav";
import coinSoundFile from "../../static/coin.wav";

class Ball {
	radius = 20;
}
class Position extends Point {}
class Velocity extends Point {}

const blipSound = new Howl({
	src: [blipSoundFile],
});
const coinSound = new Howl({
	src: [coinSoundFile],
});

const GRAVITY = new Point(0, 0.2);

type E = { type: "Start" } | { type: "Bounce"; volume: number };

export class BallApp {
	graphics = new Graphics();
	world = new World();
	events: Array<E> = [];
	mouse = new Mouse();
	isStarted = false;
	async init() {
		await this.graphics.init();
		const entity = new Entity();
		entity.addComponent(new Ball());
		entity.addComponent(new Position(400, 50));
		entity.addComponent(new Velocity(5, 0));
		this.world.addEntity(entity);
		this.mouse.bind(this.graphics);
	}
	update() {
		this.mouse.tick();
		if (!this.isStarted) {
			if (this.mouse.buttons.get(0) === BUTTON_STATE.PRESSED) {
				this.events.push({ type: "Start" });
			}
			return;
		}
		const balls = this.world.query(And(With(Ball), With(Position), With(Velocity)));
		for (const entity of balls) {
			const position = entity.getComponent(Position);
			const velocity = entity.getComponent(Velocity);
			velocity.add(GRAVITY, velocity);
			position.add(velocity, position);
			position.y = Math.min(position.y, 600 - 20);
			if (position.y >= 600 - 20) {
				velocity.y = -velocity.y * 0.8;
				velocity.x = velocity.x * 0.8;
				if (Math.abs(velocity.y) > 0.1) {
					this.events.push({
						type: "Bounce",
						volume: (Math.min(velocity.magnitude(), 14) / 14) * 0.5,
					});
				}
			}
			if (position.x > 800 - 20 || position.x < 20) {
				velocity.x = -velocity.x;
				this.events.push({
					type: "Bounce",
					volume: (Math.min(velocity.magnitude(), 14) / 14) * 0.5,
				});
			}
			if (velocity.magnitude() < 0.1) {
				this.isStarted = false;
				position.x = 400;
				position.y = 50;
				velocity.x = Math.random() * 50 - 25;
				velocity.y = 0;
			}
		}
	}
	render() {
		for (const event of this.events) {
			switch (event.type) {
				case "Start": {
					coinSound.play();
					this.isStarted = true;
					break;
				}
				case "Bounce": {
					const id = blipSound.play();
					blipSound.volume(event.volume, id);
					break;
				}
			}
		}
		this.events = [];
		if (!this.isStarted) {
			const matrix = this.graphics.matrixPool.get().translate(325, 280);
			this.graphics.text("Click to start!", matrix, { fill: "white" });
			this.graphics.render();
			return;
		}
		const balls = this.world.query(And(With(Ball), With(Position)));
		for (const entity of balls) {
			const ball = entity.getComponent(Ball);
			const position = entity.getComponent(Position);
			const matrix = this.graphics.matrixPool
				.get()
				.translate(position.x, position.y);
			this.graphics.circle(ball.radius, matrix, { fill: "red" });
		}
		this.graphics.render();
	}
}
