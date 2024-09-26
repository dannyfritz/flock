export class Mouse {}

export type Key = string;
export type KeyState =
	(typeof Keyboard.KEY_STATE)[keyof typeof Keyboard.KEY_STATE];
const KEY_STATE = {
	UP: "UP",
	PRESSED: "PRESSED",
	DOWN: "DOWN",
} as const;

export class Keyboard {
	static KEY_STATE = KEY_STATE;
	target: HTMLElement;
	keys: Map<Key, KeyState>;
	deferred: Map<Key, KeyState>;
	constructor(options: { target: HTMLElement }) {
		this.target = options.target;
		this.keys = new Map();
		this.deferred = new Map();
		this.#_keydownHandler = this.#keydownHandler.bind(this);
		this.#_keyupHandler = this.#keyupHandler.bind(this);
		this.target.addEventListener("keydown", this.#_keydownHandler);
		this.target.addEventListener("keyup", this.#_keyupHandler);
	}
	destroy(): void {
		if (this.#_keydownHandler) {
			this.target.removeEventListener("keydown", this.#_keydownHandler);
			this.#_keydownHandler = undefined;
		}
		if (this.#_keyupHandler) {
			this.target.removeEventListener("keyup", this.#_keyupHandler);
			this.#_keyupHandler = undefined;
		}
	}
	#_keydownHandler: ((event: KeyboardEvent) => void) | undefined;
	#_keyupHandler: ((event: KeyboardEvent) => void) | undefined;
	#keydownHandler(event: KeyboardEvent): void {
		this.keys.set(event.code, KEY_STATE.PRESSED);
		this.deferred.set(event.code, KEY_STATE.DOWN);
	}
	#keyupHandler(event: KeyboardEvent): void {
		this.deferred.set(event.code, KEY_STATE.UP);
	}
	tick(): void {
		for (const [key, value] of this.keys) {
			const state = this.keys.get(key);
			const deferred_state = this.deferred.get(key);
			if (state !== KEY_STATE.UP) {
				this.keys.set(key, deferred_state ?? KEY_STATE.DOWN);
			}
			this.deferred.delete(key);
		}
	}
	state(key: NonNullable<KeyboardEvent["code"]>): KeyState {
		return this.keys.get(key) ?? KEY_STATE.UP;
	}
}
