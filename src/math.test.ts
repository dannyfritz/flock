import test, { describe, mock } from "node:test";
import assert from "node:assert";
import { Vector2 } from "./math.ts";

describe("Math", () => {
	describe("Vector2", () => {
		test("new", () => {
			const position = new Vector2(10, 20);
			assert.equal(position.x, 10);
			assert.equal(position.y, 20);
		});
	});
});
