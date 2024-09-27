import type { Meta, StoryObj } from "@storybook/html";
import { Matrix } from "pixi.js";
import { Cursor as CursorApp } from "./cursor.ts";

const meta: Meta = {
	title: "Examples",
	loaders: [
		async () => {
			const app = new CursorApp();
			await app.init();
			return {
				app,
			};
		},
	],
};

export default meta;
type Story = StoryObj;

export const Cursor: Story = {
	render: (_, { loaded: { app } }) => {
		function tick() {
			app.render();
			requestAnimationFrame(tick)
		}
		requestAnimationFrame(tick)
		return app.graphics.el;
	},
};
