import {
	Assets,
	type ClearOptions,
	Container,
	type FillInput,
	Graphics as PixiGraphics,
	Matrix,
	Sprite,
	type StrokeInput,
	Text,
	type Texture,
	type WebGLOptions,
	WebGLRenderer,
	type TextOptions,
} from "pixi.js";

export class Pool<T> {
	pool: Array<T>;
	index: number;
	createFn: () => T;
	resetFn: (value: T) => T = (value: T) => value;
	constructor(createFn: () => T, resetFn: (value: T) => T) {
		this.pool = [];
		this.index = -1;
		this.createFn = createFn;
		if (resetFn) {
			this.resetFn = resetFn;
		}
	}
	get(): T {
		this.index += 1;
		let value = this.pool[this.index];
		if (value !== undefined) {
			return this.resetFn(value);
		}
		value = this.createFn();
		this.pool[this.index] = value;
		return value;
	}
	reset(): void {
		this.index = -1;
	}
}

export class Graphics {
	static loadTexture(src: string): Promise<Texture> {
		return Assets.load<Texture>(src);
	}
	get el(): HTMLCanvasElement {
		return this.renderer.canvas;
	}
	renderer: WebGLRenderer;
	stage: Container;
	pixiGraphicsPool: Pool<PixiGraphics>;
	matrixPool: Pool<Matrix>;
	containerPool: Pool<Container>;
	constructor() {
		this.renderer = new WebGLRenderer();
		this.stage = new Container();
		this.pixiGraphicsPool = new Pool(
			() => new PixiGraphics(),
			(pg) => pg.clear(),
		);
		this.matrixPool = new Pool(
			() => new Matrix(),
			(m) => m.copyFrom(Matrix.IDENTITY),
		);
		this.containerPool = new Pool(
			() => new Container(),
			(c) => {
				c.removeChildren();
				return c;
			},
		);
	}
	async init(options?: Partial<WebGLOptions>): Promise<void> {
		await this.renderer.init(options);
		this.renderer.canvas.tabIndex = -1;
	}
	circle(
		radius: number,
		matrix: Matrix,
		options?: { fill?: FillInput; stroke?: StrokeInput },
	): PixiGraphics {
		const pixiGraphics = this.pixiGraphicsPool.get();
		pixiGraphics.circle(0, 0, radius);
		if (options?.fill) {
			pixiGraphics.fill(options.fill);
		}
		if (options?.stroke) {
			pixiGraphics.stroke(options.stroke);
		}
		pixiGraphics.setFromMatrix(matrix);
		this.stage.addChild(pixiGraphics);
		return pixiGraphics;
	}
	rectangle(
		width: number,
		height: number,
		matrix: Matrix,
		options?: { fill?: FillInput; stroke?: StrokeInput },
	) {
		const pixiGraphics = this.pixiGraphicsPool.get();
		pixiGraphics.rect(0, 0, width, height);
		if (options?.fill) {
			pixiGraphics.fill(options.fill);
		}
		if (options?.stroke) {
			pixiGraphics.stroke(options.stroke);
		}
		pixiGraphics.setFromMatrix(matrix);
		this.stage.addChild(pixiGraphics);
		return pixiGraphics;
	}
	render(doNotReset = false) {
		this.renderer.render(this.stage);
		if (!doNotReset) {
			this.reset();
		}
	}
	reset() {
		this.stage.removeChildren();
		this.pixiGraphicsPool.reset();
		this.matrixPool.reset();
		this.containerPool.reset();
	}
	sprite(texture: Texture | undefined, matrix: Matrix): Sprite {
		const sprite = new Sprite(texture);
		sprite.setFromMatrix(matrix);
		this.stage.addChild(sprite);
		return sprite;
	}
	text(string: string, matrix: Matrix, style: TextOptions["style"]): Text {
		const text = new Text({ text: string, style });
		const container = this.containerPool.get();
		container.addChild(text);
		container.setFromMatrix(matrix);
		this.stage.addChild(container);
		return text;
	}
}
