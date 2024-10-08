import type { Meta, StoryObj } from "@storybook/html";

const meta: Meta = {
	title: "Examples",
};

export default meta;
type Story = StoryObj;

export const Ball: Story = {
	loaders: [
		async () => {
			const { BallApp } = await import("./ballApp.ts");
			const app = new BallApp();
			await app.init();
			return {
				app,
			};
		},
	],
	render: (_, { loaded: { app } }) => {
		function tick() {
			app.update();
			app.render();
			requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
		return app.graphics.el;
	},
};

export const Cursor: Story = {
	loaders: [
		async () => {
			const { CursorApp } = await import("./cursorApp.ts");
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
			const { KeyboardApp } = await import("./keyboardApp.ts");
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

export const Mushroom: Story = {
	loaders: [
		async () => {
			const { MushroomApp } = await import("./mushroomApp.ts");
			const app = new MushroomApp();
			await app.init();
			return {
				app,
			};
		},
	],
	render: (_, { loaded: { app } }) => {
		function tick() {
			app.update();
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
			const { ParticlesApp } = await import("./particlesApp.ts");
			const app = new ParticlesApp();
			await app.init();
			return {
				app,
			};
		},
	],
	render: (_, { loaded: { app } }) => {
		function tick() {
			app.update();
			app.render();
			requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
		return app.graphics.el;
	},
};
