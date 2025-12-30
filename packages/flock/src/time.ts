export class Timer {
	constructor(duration: number) {
		this.duration = duration;
		this.stopwatch = new Stopwatch();
	}
	get canRollover(): boolean {
		return this.stopwatch.elapsed >= this.duration;
	}
	get elapsed(): number {
		return this.stopwatch.elapsed;
	}
	get percent_elapsed(): number {
		return this.elapsed / this.duration;
	}
	get remaining(): number {
		return this.duration - this.stopwatch.elapsed;
	}
	get isFinished(): boolean {
		return this.remaining <= 0;
	}
	duration: number;
	stopwatch: Stopwatch;
	reset() {
		this.stopwatch.reset();
	}
	rollover() {
		this.stopwatch.elapsed -= this.duration;
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
