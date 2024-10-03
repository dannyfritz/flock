import test, { describe, beforeEach } from "node:test";
import assert from "node:assert";
import { Pool } from "./pool.ts";

class Item {
	value = 0;
}

describe("Pool", () => {
	test("new Pool()", () => {
		new Pool(
			() => {},
			() => {},
		);
	});
	test(".get()", async () => {
		const pool = new Pool(
			() => new Item(),
			(i) => i,
		);
		const item = pool.get();
		assert.equal(item.value, 0);
	});
	test(".get() twice", async () => {
		const pool = new Pool(
			() => new Item(),
			(i) => i,
		);
		const item1 = pool.get();
		const item2 = pool.get();
		assert.notEqual(item1, item2);
	});
	test(".reset()", async () => {
		const pool = new Pool(
			() => new Item(),
			(i) => i,
		);
		const item1 = pool.get();
		pool.reset();
		const item2 = pool.get();
		assert.equal(item1, item2);
	});
	test(".get() resetFn", async () => {
		const pool = new Pool(
			() => new Item(),
			(i) => {
				i.value = 0;
				return i;
			},
		);
		pool.get().value = 42;
		pool.reset();
		const item = pool.get();
		assert.equal(item.value, 0);
	});
});
