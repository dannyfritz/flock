import type { Meta, StoryObj } from "@storybook/html";
import { Matrix } from "pixi.js";
import { CursorApp } from "./cursorApp.ts";
import { KeyboardApp } from "./keyboardApp.ts";
import { ParticlesApp } from "./ParticlesApp.ts";

const meta: Meta = {
	title: "Examples",
};

export default meta;
type Story = StoryObj;

export const Cursor: Story = {
	loaders: [
		async () => {
			const app = new CursorApp();
			await app.init();
			return {
				app,
			};
		},
	],
	render: (_, { loaded: { app } }) => {
		function tick() {
			app.render();
			requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
		return app.graphics.el;
	},
};

export const Keyboard: Story = {
	loaders: [
		async () => {
			const app = new KeyboardApp();
			await app.init();
			return {
				app,
			};
		},
	],
	render: (_, { loaded: { app } }) => {
		function tick() {
			app.render();
			requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
		return app.graphics.el;
	},
};

export const Particles: Story = {
	loaders: [
		async () => {
			const app = new ParticlesApp();
			await app.init();
			return {
				app,
			};
		},
	],
	render: (_, { loaded: { app } }) => {
		function tick() {
			app.render();
			requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
		return app.graphics.el;
	},
};
