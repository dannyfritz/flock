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

export class Timer extends Stopwatch {
	constructor(duration: number) {
		super();
		this.duration = duration;
	}
	get canRollover(): boolean {
		return this.elapsed >= this.duration;
	}
	get percent_elapsed(): number {
		return this.elapsed / this.duration;
	}
	get remaining(): number {
		return this.duration - this.elapsed;
	}
	get isFinished(): boolean {
		return this.remaining <= 0;
	}
	duration: number;
	rollover() {
		this.elapsed -= this.duration;
	}
}
