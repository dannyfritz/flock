import type { Meta, StoryObj } from "@storybook/html";
import { Matrix } from "pixi.js";
import image from "../static/extra_character_a.png";
import { Graphics } from "./graphics.ts";
import { Vector2 } from "./math.ts";

const meta: Meta = {
	title: "Graphics",
	loaders: [
		async () => {
			const graphics = new Graphics();
			await graphics.init({
				antialias: true,
			});
			const sprite = await Graphics.loadTexture(image);
			console.log(sprite);
			return {
				graphics,
				sprite,
			};
		},
	],
};

export default meta;
type Story = StoryObj;

export const Circle: Story = {
	render: (_, { loaded: { graphics } }) => {
		const matrix = new Matrix();
		matrix.translate(25, 40);
		graphics.circle(20, matrix.clone(), { fill: "#00FF00" });
		matrix.translate(55, 0);
		graphics.circle(30, matrix.clone(), { stroke: "#FF0000" });
		matrix.translate(55, 0);
		graphics.circle(20, matrix.clone(), {
			stroke: { color: "#5555FF", width: 5 },
		});
		graphics.render();
		return graphics.el;
	},
};

export const Rectangle: Story = {
	render: (_, { loaded: { graphics } }) => {
		const matrix = new Matrix();
		matrix.translate(25, 40);
		graphics.rectangle(20, 50, matrix.clone(), { fill: "#00FF00" });
		matrix.translate(55, 0);
		graphics.rectangle(100, 30, matrix.clone(), { stroke: "#FF0000" });
		matrix.translate(55, 100);
		graphics.rectangle(200, 200, matrix.clone(), {
			stroke: { color: "#5555FF", width: 5 },
		});
		graphics.render();
		return graphics.el;
	},
};

export const Sprite: Story = {
	render: (_, { loaded: { graphics, sprite } }) => {
		const matrix = new Matrix();
		matrix.translate(-60, -60);
		matrix.rotate(Math.PI / 4);
		matrix.translate(120, 80);
		graphics.sprite(sprite, matrix);
		graphics.render();
		return graphics.el;
	},
};

export const Text: Story = {
	render: (_, { loaded: { graphics, sprite } }) => {
		const matrix = new Matrix();
		matrix.translate(100, 200);
		graphics.text("Hello World!", { fill: "FF0000" }, matrix);
		graphics.render();
		return graphics.el;
	},
};
