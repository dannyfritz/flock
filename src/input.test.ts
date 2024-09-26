import test, { describe, beforeEach } from "node:test";
import assert from "node:assert";
import { BUTTON_STATE, Keyboard, Mouse } from "./input.ts";

describe.only("Input", () => {
	describe("Mouse", () => {
		test("new Mouse()", () => {
			new Mouse();
		});
		test("state() initial state", async () => {
			const mouse = new Mouse();
			assert.equal(mouse.buttons.get(0), BUTTON_STATE.UP);
		});
		test("state() register with no tick", async () => {
			const mouse = new Mouse();
			mouse.buttons.register(0);
			assert.equal(mouse.buttons.get(0), BUTTON_STATE.UP);
		});
		test("state() register with tick", async () => {
			const mouse = new Mouse();
			mouse.buttons.register(0);
			mouse.tick();
			assert.equal(mouse.buttons.get(0), BUTTON_STATE.PRESSED);
		});
		test("state() down after pressed", async () => {
			const mouse = new Mouse();
			mouse.buttons.register(0);
			mouse.tick();
			mouse.tick();
			assert.equal(mouse.buttons.get(0), BUTTON_STATE.DOWN);
		});
		test("state() up after an unregistered press", async () => {
			const mouse = new Mouse();
			mouse.buttons.register(0);
			mouse.buttons.unregister(0);
			mouse.tick();
			assert.equal(mouse.buttons.get(0), BUTTON_STATE.UP);
		});
		test("state() up persists", async () => {
			const mouse = new Mouse();
			mouse.buttons.register(0);
			mouse.buttons.unregister(0);
			mouse.tick();
			mouse.tick();
			mouse.tick();
			assert.equal(mouse.buttons.get(0), BUTTON_STATE.UP);
		});
		test(".x / .y", async () => {
			const mouse = new Mouse();
			assert.equal(mouse.position.x, Number.NaN);
			assert.equal(mouse.position.y, Number.NaN);
			mouse.position.x = 10;
			mouse.position.y = 20;
			assert.equal(mouse.position.x, 10);
			assert.equal(mouse.position.y, 20);
		});
	});
	describe("Keyboard", () => {
		test("new Keyboard()", () => {
			new Keyboard();
		});
		test("state() initial state", async () => {
			const keyboard = new Keyboard();
			assert.equal(keyboard.keys.get("KeyA"), BUTTON_STATE.UP);
		});
		test("state() register with no tick", async () => {
			const keyboard = new Keyboard();
			keyboard.keys.register("KeyA");
			assert.equal(keyboard.keys.get("KeyA"), BUTTON_STATE.UP);
		});
		test("state() register with tick", async () => {
			const keyboard = new Keyboard();
			keyboard.keys.register("KeyA");
			keyboard.tick();
			assert.equal(keyboard.keys.get("KeyA"), BUTTON_STATE.PRESSED);
		});
		test("state() down after pressed", async () => {
			const keyboard = new Keyboard();
			keyboard.keys.register("KeyA");
			keyboard.tick();
			keyboard.tick();
			assert.equal(keyboard.keys.get("KeyA"), BUTTON_STATE.DOWN);
		});
		test("state() up after an unregistered press", async () => {
			const keyboard = new Keyboard();
			keyboard.keys.register("KeyA");
			keyboard.keys.unregister("KeyA");
			keyboard.tick();
			assert.equal(keyboard.keys.get("KeyA"), BUTTON_STATE.UP);
		});
	});
});
