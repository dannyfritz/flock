import test, { describe, beforeEach } from "node:test";
import assert from "node:assert";
import { Keyboard } from "./input.ts";
import { JSDOM } from "jsdom";

function KeydownEvent(dom: JSDOM, code: KeyboardEvent["code"]) {
	return new dom.window.KeyboardEvent("keydown", { code });
}
function KeyupEvent(dom: JSDOM, code: KeyboardEvent["code"]) {
	return new dom.window.KeyboardEvent("keyup", { code });
}

describe("Input", () => {
	describe("Mouse", () => {});
	describe("Keyboard", () => {
		let dom: JSDOM;
		let target: HTMLCanvasElement;
		beforeEach(() => {
			dom = new JSDOM("<!DOCTYPE html><body><canvas></canvas></body></html>");
			target = dom.window.document.querySelector("canvas") as HTMLCanvasElement;
		});
		test("new Keyboard()", () => {
			new Keyboard({ target });
		});
		test("state() initial state", async () => {
			const keyboard = new Keyboard({ target });
			assert.equal(keyboard.state("KeyA"), Keyboard.KEY_STATE.UP);
		});
		test("state() pressed", async () => {
			const keyboard = new Keyboard({ target });
			target.dispatchEvent(KeydownEvent(dom, "KeyA"));
			assert.equal(keyboard.state("KeyA"), Keyboard.KEY_STATE.PRESSED);
		});
		test("state() down", async () => {
			const keyboard = new Keyboard({ target });
			target.dispatchEvent(KeydownEvent(dom, "KeyA"));
			keyboard.tick();
			assert.equal(keyboard.state("KeyA"), Keyboard.KEY_STATE.DOWN);
		});
		test("state() down persists", async () => {
			const keyboard = new Keyboard({ target });
			target.dispatchEvent(KeydownEvent(dom, "KeyA"));
			keyboard.tick();
			keyboard.tick();
			keyboard.tick();
			assert.equal(keyboard.state("KeyA"), Keyboard.KEY_STATE.DOWN);
		});
		test("state() up", async () => {
			const keyboard = new Keyboard({ target });
			target.dispatchEvent(KeydownEvent(dom, "KeyA"));
			target.dispatchEvent(KeyupEvent(dom, "KeyA"));
			keyboard.tick();
			assert.equal(keyboard.state("KeyA"), Keyboard.KEY_STATE.UP);
		});
		test("state() up persists", async () => {
			const keyboard = new Keyboard({ target });
			target.dispatchEvent(KeydownEvent(dom, "KeyA"));
			target.dispatchEvent(KeyupEvent(dom, "KeyA"));
			keyboard.tick();
			keyboard.tick();
			keyboard.tick();
			assert.equal(keyboard.state("KeyA"), Keyboard.KEY_STATE.UP);
		});
	});
});
