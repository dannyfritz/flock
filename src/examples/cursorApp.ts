import { Matrix } from "pixi.js";
import { Graphics } from "../graphics.ts";
import { BUTTON_STATE, Mouse } from "../input.ts";

export class CursorApp {
	graphics: Graphics;
	mouse: Mouse;
	constructor() {
		this.graphics = new Graphics();
		this.mouse = new Mouse();
	}
	async init(): Promise<void> {
		await this.graphics.init();
		this.mouse.bind(this.graphics);
	}
	render() {
		this.mouse.tick();
		const matrix = new Matrix();
		matrix.translate(this.mouse.position.x, this.mouse.position.y);
		this.graphics.circle(10, matrix, { fill: "#FF0000" });
		if (this.mouse.buttons.get(0) === BUTTON_STATE.PRESSED) {
			this.graphics.circle(16, matrix, { fill: "#00FF00" });
		}
		if (this.mouse.buttons.get(0) === BUTTON_STATE.DOWN) {
			this.graphics.circle(12, matrix, { fill: "#0000FF" });
		}
		this.graphics.render();
	}
}
