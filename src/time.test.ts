import test, { describe, mock } from "node:test";
import assert from "node:assert";
import { Timer, Stopwatch } from "./time.ts";

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
	describe("Timer", () => {
		test("new", () => {
			new Timer(30);
		});
		test(".tick()", () => {
			const timer = new Timer(30);
			timer.tick(10);
			assert.equal(timer.remaining, 20);
		});
		test(".isFinished()", () => {
			const timer = new Timer(30);
			assert.equal(timer.isFinished, false);
			timer.tick(30);
			assert.equal(timer.isFinished, true);
		});
		test(".isFinished() double", () => {
			const timer = new Timer(30);
			timer.tick(60);
			assert.equal(timer.isFinished, true);
		});
		test(".reset()", () => {
			const timer = new Timer(30);
			timer.tick(31);
			timer.reset();
			assert.equal(timer.elapsed, 0);
		});
		test(".rollover()", () => {
			const timer = new Timer(30);
			timer.tick(31);
			timer.rollover();
			assert.equal(timer.elapsed, 1);
		});
		test(".rollover() double", () => {
			const timer = new Timer(30);
			timer.tick(60);
			timer.rollover();
			assert.equal(timer.elapsed, 30);
		});
	});
});
