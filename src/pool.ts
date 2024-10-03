export class Pool<T> {
	pool: Array<T>;
	index: number;
	createFn: () => T;
	resetFn: (value: T) => T = (value: T) => value;
	constructor(createFn: () => T, resetFn: (value: T) => T) {
		this.pool = [];
		this.index = -1;
		this.createFn = createFn;
		if (resetFn) {
			this.resetFn = resetFn;
		}
	}
	get(): T {
		this.index += 1;
		let value = this.pool[this.index];
		if (value !== undefined) {
			return this.resetFn(value);
		}
		value = this.createFn();
		this.pool[this.index] = value;
		return value;
	}
	reset(): void {
		this.index = -1;
	}
}
