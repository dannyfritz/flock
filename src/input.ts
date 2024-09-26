export type Button = string;
export type ButtonState = (typeof BUTTON_STATE)[keyof typeof BUTTON_STATE];
const BUTTON_STATE = {
	UP: "UP",
	PRESSED: "PRESSED",
	DOWN: "DOWN",
} as const;
export type MouseButton = 0 | 1 | 2 | 3 | 4;

export class Mouse {
	static BUTTON_STATE = BUTTON_STATE;
	target: HTMLElement;
	buttons: Map<MouseButton, ButtonState>;
	deferred: Map<MouseButton, ButtonState>;
	x: number;
	y: number;
	constructor(options: { target: HTMLElement }) {
		this.target = options.target;
		this.buttons = new Map();
		this.deferred = new Map();
		this.x = Number.NaN;
		this.y = Number.NaN;
		this.#_pointerdownHandler = this.#pointerdownHandler.bind(this);
		this.#_pointerupHandler = this.#pointerupHandler.bind(this);
		this.#_pointermoveHandler = this.#pointermoveHandler.bind(this);
		this.target.addEventListener("pointerdown", this.#_pointerdownHandler);
		this.target.addEventListener("pointerup", this.#_pointerupHandler);
		this.target.addEventListener("pointermove", this.#_pointermoveHandler);
	}
	destroy(): void {
		if (this.#_pointerdownHandler) {
			this.target.removeEventListener("pointerdown", this.#_pointerdownHandler);
			this.#_pointerdownHandler = undefined;
		}
		if (this.#_pointerupHandler) {
			this.target.removeEventListener("pointerup", this.#_pointerupHandler);
			this.#_pointerupHandler = undefined;
		}
		if (this.#_pointermoveHandler) {
			this.target.removeEventListener("pointermove", this.#_pointermoveHandler);
			this.#_pointermoveHandler = undefined;
		}
	}
	#_pointerdownHandler: ((event: PointerEvent) => void) | undefined;
	#_pointerupHandler: ((event: PointerEvent) => void) | undefined;
	#_pointermoveHandler: ((event: PointerEvent) => void) | undefined;
	#pointerdownHandler(event: PointerEvent): void {
		this.buttons.set(event.button as MouseButton, BUTTON_STATE.PRESSED);
		this.deferred.set(event.button as MouseButton, BUTTON_STATE.DOWN);
	}
	#pointerupHandler(event: PointerEvent): void {
		this.deferred.set(event.button as MouseButton, BUTTON_STATE.UP);
	}
	#pointermoveHandler(event: PointerEvent): void {
		console.log({ x: event.offsetX, y: event.offsetY })
		this.x = event.offsetX;
		this.y = event.offsetY;
	}
	tick(): void {
		for (const [key, value] of this.buttons) {
			const state = this.buttons.get(key);
			const deferred_state = this.deferred.get(key);
			if (state !== BUTTON_STATE.UP) {
				this.buttons.set(key, deferred_state ?? BUTTON_STATE.DOWN);
			}
			this.deferred.delete(key);
		}
	}
	state(button: MouseButton): ButtonState {
		return this.buttons.get(button) ?? BUTTON_STATE.UP;
	}
}

type UpperCaseCharacters =
	| "A"
	| "B"
	| "C"
	| "D"
	| "E"
	| "F"
	| "G"
	| "H"
	| "I"
	| "J"
	| "K"
	| "L"
	| "M"
	| "N"
	| "O"
	| "P"
	| "Q"
	| "R"
	| "S"
	| "T"
	| "U"
	| "V"
	| "W"
	| "X"
	| "Y"
	| "Z";
type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type Direction = "Left" | "Right" | "Up" | "Down";
type Side = "Left" | "Right";
type Modifier = "Shift" | "Control" | "Alt" | "Meta";
export type KeyCode =
	| "Backquote"
	| "Backspace"
	| "CapsLock"
	| "Comma"
	| "Delete"
	| "End"
	| "Enter"
	| "Equal"
	| "Escape"
	| "Home"
	| "Insert"
	| "Minus"
	| "NumLock"
	| "Pause"
	| "Period"
	| "Quote"
	| "ScrollLock"
	| "Semicolon"
	| "Slash"
	| "Space"
	| "Tab"
	| `F${Digit | "10" | "11" | "12"}`
	| `${Modifier}${Side}`
	| `Array${Direction}`
	| `Bracket${Side}`
	| `Digit${Digit}`
	| `Key${UpperCaseCharacters}`
	| `Numpad${Digit | "Multiply" | "Add" | "Subtract" | "Decimal" | "Divide"}`
	| `Page${"Down" | "Up"}`
;

export class Keyboard {
	static KEY_STATE = BUTTON_STATE;
	target: HTMLElement;
	keys: Map<KeyCode, ButtonState>;
	deferred: Map<KeyCode, ButtonState>;
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
		this.keys.set(event.code as KeyCode, BUTTON_STATE.PRESSED);
		this.deferred.set(event.code as KeyCode, BUTTON_STATE.DOWN);
	}
	#keyupHandler(event: KeyboardEvent): void {
		this.deferred.set(event.code as KeyCode, BUTTON_STATE.UP);
	}
	tick(): void {
		for (const [key, value] of this.keys) {
			const state = this.keys.get(key);
			const deferred_state = this.deferred.get(key);
			if (state !== BUTTON_STATE.UP) {
				this.keys.set(key, deferred_state ?? BUTTON_STATE.DOWN);
			}
			this.deferred.delete(key);
		}
	}
	state(key: KeyCode): ButtonState {
		return this.keys.get(key) ?? BUTTON_STATE.UP;
	}
}
