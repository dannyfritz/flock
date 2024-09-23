export class Alarm {
	constructor(start: number) {
		this.start = start;
		this.stopwatch = new Stopwatch();
	}
	get elapsed(): number {
		return this.stopwatch.elapsed;
	}
	get remaining(): number {
		return this.start - this.stopwatch.elapsed;
	}
	get isTriggered(): boolean {
		return this.remaining <= 0;
	}
	start: number;
	stopwatch: Stopwatch;
	reset() {
		this.stopwatch.reset();
	}
	rollover() {
		const remaining = Math.max(Math.abs(this.remaining), 0);
		this.stopwatch.reset();
		this.stopwatch.tick(remaining);
	}
	tick(dt: number) {
		this.stopwatch.tick(dt);
	}
}

export class Stopwatch {
	constructor() {
		this.elapsed = 0;
	}
	elapsed: number;
	reset() {
		this.elapsed = 0;
	}
	tick(dt: number) {
		this.elapsed += dt;
	}
}

export class Timer {}
