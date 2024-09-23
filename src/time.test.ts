import test, { describe, mock } from "node:test";
import assert from "node:assert";
import { Alarm, Stopwatch } from "./time.ts";

describe("Time", () => {
	describe("Stopwatch", () => {
		test("new", () => {
			new Stopwatch();
		});
		test(".tick()", () => {
			const stopwatch = new Stopwatch();
			stopwatch.tick(30);
			assert.equal(stopwatch.elapsed, 30);
		});
		test(".tick() double", () => {
			const stopwatch = new Stopwatch();
			stopwatch.tick(30);
			stopwatch.tick(40);
			assert.equal(stopwatch.elapsed, 70);
		});
		test(".reset()", () => {
			const stopwatch = new Stopwatch();
			stopwatch.tick(30);
			stopwatch.reset();
			assert.equal(stopwatch.elapsed, 0);
		});
	});
	describe("Alarm", () => {
		test("new", () => {
			new Alarm(30);
		});
		test(".tick()", () => {
			const alarm = new Alarm(30);
			alarm.tick(10);
			assert.equal(alarm.remaining, 20);
		});
		test(".isTriggered()", () => {
			const alarm = new Alarm(30);
			assert.equal(alarm.isTriggered, false);
			alarm.tick(30);
			assert.equal(alarm.isTriggered, true);
		});
		test(".isTriggered() double", () => {
			const alarm = new Alarm(30);
			alarm.tick(60);
			assert.equal(alarm.isTriggered, true);
		});
		test(".reset()", () => {
			const alarm = new Alarm(30);
			alarm.tick(31);
			alarm.reset();
			assert.equal(alarm.elapsed, 0);
		});
		test(".rollover()", () => {
			const alarm = new Alarm(30);
			alarm.tick(31);
			alarm.rollover();
			assert.equal(alarm.elapsed, 1);
		});
		test(".rollover() double", () => {
			const alarm = new Alarm(30);
			alarm.tick(60);
			alarm.rollover();
			assert.equal(alarm.elapsed, 30);
		});
	});
});
