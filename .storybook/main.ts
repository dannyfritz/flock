import type { StorybookConfig } from "@storybook/html-vite";

const config: StorybookConfig = {
	stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: ["@storybook/addon-essentials"],
	framework: {
		name: "@storybook/html-vite",
		options: {},
	},
	core: {
		disableTelemetry: true,
	},
};
export default config;
