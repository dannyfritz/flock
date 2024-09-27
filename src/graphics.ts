import {
	Assets,
	type ClearOptions,
	Container,
	type FillInput,
	Graphics as PixiGraphics,
	type Matrix,
	Sprite,
	type StrokeInput,
	Text,
	type TextStyle,
	type Texture,
	type WebGLOptions,
	WebGLRenderer,
} from "pixi.js";
import type { Vector2 } from "./math.ts";

export class Graphics {
	static loadTexture(src: string): Promise<Texture> {
		return Assets.load<Texture>(src);
	}
	get el(): HTMLCanvasElement {
		return this.renderer.canvas;
	}
	renderer: WebGLRenderer;
	stage: Container;
	constructor() {
		this.renderer = new WebGLRenderer();
		this.stage = new Container();
	}
	init(options?: Partial<WebGLOptions>): Promise<void> {
		return this.renderer.init(options);
	}
	circle(
		radius: number,
		matrix: Matrix,
		options?: { fill?: FillInput; stroke?: StrokeInput },
	): PixiGraphics {
		const graphics = new PixiGraphics();
		graphics.circle(0, 0, radius);
		if (options?.fill) {
			graphics.fill(options.fill);
		}
		if (options?.stroke) {
			graphics.stroke(options.stroke);
		}
		graphics.setFromMatrix(matrix);
		this.stage.addChild(graphics);
		return graphics;
	}
	clear(options?: ClearOptions) {
		this.renderer.clear(options);
	}
	rectangle(
		width: number,
		height: number,
		matrix: Matrix,
		options?: { fill?: FillInput; stroke?: StrokeInput },
	) {
		const graphics = new PixiGraphics();
		graphics.rect(0, 0, width, height);
		if (options?.fill) {
			graphics.fill(options.fill);
		}
		if (options?.stroke) {
			graphics.stroke(options.stroke);
		}
		graphics.setFromMatrix(matrix);
		this.stage.addChild(graphics);
		return graphics;
	}
	render() {
		this.renderer.render(this.stage);
		this.stage = new Container();
	}
	sprite(texture: Texture, matrix: Matrix): Sprite {
		const sprite = new Sprite(texture);
		sprite.setFromMatrix(matrix);
		this.stage.addChild(sprite);
		return sprite;
	}
	text(string: string, style: TextStyle, matrix: Matrix): Text {
		const text = new Text({ text: string, style });
		text.setFromMatrix(matrix);
		this.stage.addChild(text);
		return text;
	}
}
