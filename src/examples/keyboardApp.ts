import { Matrix, type Texture } from "pixi.js";
import { Graphics } from "../graphics.ts";
import { BUTTON_STATE, Keyboard, type KeyCode } from "../input.ts";
import spriteFile from "../../static/extra_character_a.png";

export class KeyboardApp {
	graphics: Graphics;
	keyboard: Keyboard;
	texture: Texture | undefined;
	position: { x: number; y: number };
	constructor() {
		this.graphics = new Graphics();
		this.keyboard = new Keyboard();
		this.position = { x: 0, y: 0 };
	}
	async init(): Promise<void> {
		await this.graphics.init();
		this.texture = await Graphics.loadTexture(spriteFile);
		this.graphics.el.addEventListener("keydown", (event) => {
			this.keyboard.keys.register(event.code as KeyCode);
			event.preventDefault();
		});
		this.graphics.el.addEventListener("keyup", (event) => {
			this.keyboard.keys.unregister(event.code as KeyCode);
			event.preventDefault();
		});
	}
	render() {
		this.keyboard.tick();
		if (this.keyboard.keys.get("ArrowUp") >= BUTTON_STATE.DOWN) {
			this.position.y -= 1;
		}
		if (this.keyboard.keys.get("ArrowDown") >= BUTTON_STATE.DOWN) {
			this.position.y += 1;
		}
		if (this.keyboard.keys.get("ArrowLeft") >= BUTTON_STATE.DOWN) {
			this.position.x -= 1;
		}
		if (this.keyboard.keys.get("ArrowRight") >= BUTTON_STATE.DOWN) {
			this.position.x += 1;
		}
		const matrix = new Matrix();
		matrix.translate(this.position.x, this.position.y);
		this.graphics.sprite(this.texture, matrix);
		this.graphics.render();
	}
}
