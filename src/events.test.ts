import test, { describe, beforeEach } from "node:test";
import assert from "node:assert";
import { Events } from "./events.ts";

type Event = "BEGIN" | "END";

describe("Events", () => {
	test("new Events()", () => {
		new Events<Event>();
	});
	test(".add()", () => {
		const events = new Events<Event>();
		events.add("BEGIN");
		assert.equal(events.events.length, 1);
	});
	test(".get()", () => {
		const events = new Events<Event>();
		events.add("BEGIN");
		events.add("END");
		assert.deepEqual(events.get(), ["BEGIN", "END"]);
	});
	test(".get() clears", () => {
		const events = new Events<Event>();
		events.add("BEGIN");
		events.add("END");
		events.get();
		assert.deepEqual(events.get(), []);
	});
	test(".clear()", () => {
		const events = new Events<Event>();
		events.add("BEGIN");
		events.add("END");
		events.clear();
		assert.deepEqual(events.get(), []);
	});
});
