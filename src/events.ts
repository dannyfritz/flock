export class Events<E> {
	events: Array<E> = [];
	add(event: E): void {
		this.events.push(event);
	}
	clear(): void {
		this.events = [];
	}
	get(): Array<E> {
		const events = this.events;
		this.clear();
		return events;
	}
}
