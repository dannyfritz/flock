import test, { describe, beforeEach } from "node:test";
import assert from "node:assert";
import { Keyboard } from "./input.ts";
import { JSDOM } from "jsdom";

function KeydownEvent(dom:JSDOM, code: KeyboardEvent["code"]) {
	return new dom.window.KeyboardEvent("keydown", { code })
}
function KeyupEvent(dom:JSDOM, code: KeyboardEvent["code"]) {
	return new dom.window.KeyboardEvent("keyup", { code })
}

describe("Input", () => {
	describe("Keyboard", () => {
		test("new Keyboard()", () => {
			const dom = new JSDOM("<!DOCTYPE html><body><canvas></canvas></body></html>");
			const canvas = dom.window.document.querySelector("canvas");
			assert(canvas);
			new Keyboard({ target: canvas });
		});
		test("state() initial state", async () => {
			const dom = new JSDOM("<!DOCTYPE html><body><canvas></canvas></body></html>");
			const KeyboardEvent = dom.window.KeyboardEvent;
			const canvas = dom.window.document.querySelector("canvas");
			assert(canvas);
			const keyboard = new Keyboard({ target: canvas });
			assert.equal(keyboard.state("KeyA"), Keyboard.KEY_STATE.UP);
		});
		test("state() pressed", async () => {
			const dom = new JSDOM("<!DOCTYPE html><body><canvas></canvas></body></html>");
			const KeyboardEvent = dom.window.KeyboardEvent;
			const canvas = dom.window.document.querySelector("canvas");
			assert(canvas);
			const keyboard = new Keyboard({ target: canvas });
			canvas.dispatchEvent(KeydownEvent(dom, "KeyA"))
			assert.equal(keyboard.state("KeyA"), Keyboard.KEY_STATE.PRESSED);
		});
		test("state() down", async () => {
			const dom = new JSDOM("<!DOCTYPE html><body><canvas></canvas></body></html>");
			const KeyboardEvent = dom.window.KeyboardEvent;
			const canvas = dom.window.document.querySelector("canvas");
			assert(canvas);
			const keyboard = new Keyboard({ target: canvas });
			canvas.dispatchEvent(KeydownEvent(dom, "KeyA"))
			keyboard.tick();
			assert.equal(keyboard.state("KeyA"), Keyboard.KEY_STATE.DOWN);
		});
		test("state() down persists", async () => {
			const dom = new JSDOM("<!DOCTYPE html><body><canvas></canvas></body></html>");
			const KeyboardEvent = dom.window.KeyboardEvent;
			const canvas = dom.window.document.querySelector("canvas");
			assert(canvas);
			const keyboard = new Keyboard({ target: canvas });
			canvas.dispatchEvent(KeydownEvent(dom, "KeyA"))
			keyboard.tick();
			keyboard.tick();
			keyboard.tick();
			assert.equal(keyboard.state("KeyA"), Keyboard.KEY_STATE.DOWN);
		});
		test("state() up", async () => {
			const dom = new JSDOM("<!DOCTYPE html><body><canvas></canvas></body></html>");
			const KeyboardEvent = dom.window.KeyboardEvent;
			const canvas = dom.window.document.querySelector("canvas");
			assert(canvas);
			const keyboard = new Keyboard({ target: canvas });
			canvas.dispatchEvent(KeydownEvent(dom, "KeyA"))
			canvas.dispatchEvent(KeyupEvent(dom, "KeyA"))
			keyboard.tick();
			assert.equal(keyboard.state("KeyA"), Keyboard.KEY_STATE.UP);
		});
		test("state() up persists", async () => {
			const dom = new JSDOM("<!DOCTYPE html><body><canvas></canvas></body></html>");
			const KeyboardEvent = dom.window.KeyboardEvent;
			const canvas = dom.window.document.querySelector("canvas");
			assert(canvas);
			const keyboard = new Keyboard({ target: canvas });
			canvas.dispatchEvent(KeydownEvent(dom, "KeyA"))
			canvas.dispatchEvent(KeyupEvent(dom, "KeyA"))
			keyboard.tick();
			keyboard.tick();
			keyboard.tick();
			assert.equal(keyboard.state("KeyA"), Keyboard.KEY_STATE.UP);
		});
	});
});
