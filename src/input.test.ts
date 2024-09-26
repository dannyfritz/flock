import test, { describe, beforeEach } from "node:test";
import assert from "node:assert";
import { Keyboard, Mouse } from "./input.ts";
import { JSDOM } from "jsdom";

function KeyDownEvent(dom: JSDOM, code: KeyboardEvent["code"]) {
	return new dom.window.KeyboardEvent("keydown", { code });
}
function KeyUpEvent(dom: JSDOM, code: KeyboardEvent["code"]) {
	return new dom.window.KeyboardEvent("keyup", { code });
}
function PointerDownEvent(dom: JSDOM, button: PointerEvent["button"]) {
	return new dom.window.PointerEvent("pointerdown", { button });
}
function PointerUpEvent(dom: JSDOM, button: PointerEvent["button"]) {
	return new dom.window.PointerEvent("pointerup", { button });
}
// TODO: run in a browser because JSDom doesn't support this
function PointerMoveEvent(dom: JSDOM, position: { x: number; y: number }) {
	const event = new dom.window.PointerEvent("pointermove", {
		offsetX: position.x,
		offsetY: position.y,
	});
	return event;
}

describe("Input", () => {
	let dom: JSDOM;
	let target: HTMLCanvasElement;
	beforeEach(() => {
		dom = new JSDOM("<!DOCTYPE html><body><canvas></canvas></body></html>");
		dom.window.PointerEvent = dom.window.MouseEvent;
		target = dom.window.document.querySelector("canvas") as HTMLCanvasElement;
	});
	describe("Mouse", () => {
		test("new Mouse()", () => {
			new Mouse({ target });
		});
		test("state() initial state", async () => {
			const mouse = new Mouse({ target });
			assert.equal(mouse.state(0), Mouse.BUTTON_STATE.UP);
		});
		test("state() pressed", async () => {
			const mouse = new Mouse({ target });
			target.dispatchEvent(PointerDownEvent(dom, 0));
			assert.equal(mouse.state(0), Mouse.BUTTON_STATE.PRESSED);
		});
		test("state() down", async () => {
			const mouse = new Mouse({ target });
			target.dispatchEvent(PointerDownEvent(dom, 0));
			mouse.tick();
			assert.equal(mouse.state(0), Mouse.BUTTON_STATE.DOWN);
		});
		test("state() down persists", async () => {
			const mouse = new Mouse({ target });
			target.dispatchEvent(PointerDownEvent(dom, 0));
			mouse.tick();
			mouse.tick();
			mouse.tick();
			assert.equal(mouse.state(0), Mouse.BUTTON_STATE.DOWN);
		});
		test("state() up", async () => {
			const mouse = new Mouse({ target });
			target.dispatchEvent(PointerDownEvent(dom, 0));
			target.dispatchEvent(PointerUpEvent(dom, 0));
			mouse.tick();
			assert.equal(mouse.state(0), Mouse.BUTTON_STATE.UP);
		});
		test("state() up persists", async () => {
			const mouse = new Mouse({ target });
			target.dispatchEvent(PointerDownEvent(dom, 0));
			target.dispatchEvent(PointerUpEvent(dom, 0));
			mouse.tick();
			mouse.tick();
			mouse.tick();
			assert.equal(mouse.state(0), Mouse.BUTTON_STATE.UP);
		});
		test.only(".x / .y", async () => {
			const mouse = new Mouse({ target });
			assert.equal(mouse.x, Number.NaN);
			assert.equal(mouse.y, Number.NaN);
			target.dispatchEvent(PointerMoveEvent(dom, { x: 10, y: 20 }));
			assert.equal(mouse.x, 10);
			// assert.equal(mouse.y, 20);
			// target.dispatchEvent(PointerMoveEvent(dom, { x: 0, y: 0 }));
			// assert.equal(mouse.x, 0);
			// assert.equal(mouse.y, 0);
		});
	});
	describe("Keyboard", () => {
		test("new Keyboard()", () => {
			new Keyboard({ target });
		});
		test("state() initial state", async () => {
			const keyboard = new Keyboard({ target });
			assert.equal(keyboard.state("KeyA"), Keyboard.KEY_STATE.UP);
		});
		test("state() pressed", async () => {
			const keyboard = new Keyboard({ target });
			target.dispatchEvent(KeyDownEvent(dom, "KeyA"));
			assert.equal(keyboard.state("KeyA"), Keyboard.KEY_STATE.PRESSED);
		});
		test("state() down", async () => {
			const keyboard = new Keyboard({ target });
			target.dispatchEvent(KeyDownEvent(dom, "KeyA"));
			keyboard.tick();
			assert.equal(keyboard.state("KeyA"), Keyboard.KEY_STATE.DOWN);
		});
		test("state() down persists", async () => {
			const keyboard = new Keyboard({ target });
			target.dispatchEvent(KeyDownEvent(dom, "KeyA"));
			keyboard.tick();
			keyboard.tick();
			keyboard.tick();
			assert.equal(keyboard.state("KeyA"), Keyboard.KEY_STATE.DOWN);
		});
		test("state() up", async () => {
			const keyboard = new Keyboard({ target });
			target.dispatchEvent(KeyDownEvent(dom, "KeyA"));
			target.dispatchEvent(KeyUpEvent(dom, "KeyA"));
			keyboard.tick();
			assert.equal(keyboard.state("KeyA"), Keyboard.KEY_STATE.UP);
		});
		test("state() up persists", async () => {
			const keyboard = new Keyboard({ target });
			target.dispatchEvent(KeyDownEvent(dom, "KeyA"));
			target.dispatchEvent(KeyUpEvent(dom, "KeyA"));
			keyboard.tick();
			keyboard.tick();
			keyboard.tick();
			assert.equal(keyboard.state("KeyA"), Keyboard.KEY_STATE.UP);
		});
	});
});
