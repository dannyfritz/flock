export type ButtonState = (typeof BUTTON_STATE)[keyof typeof BUTTON_STATE];
export const BUTTON_STATE = {
	UP: "UP",
	PRESSED: "PRESSED",
	DOWN: "DOWN",
} as const;
export type MouseButton = 0 | 1 | 2 | 3 | 4;
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
	| `Page${"Down" | "Up"}`;

class State<T> {
	state: Map<T, ButtonState>;
	queue: Array<[T, ButtonState]>;
	constructor() {
		this.state = new Map();
		this.queue = [];
	}
	get(key: T): ButtonState {
		return this.state.get(key) ?? BUTTON_STATE.UP;
	}
	register(key: T): void {
		this.queue.push([key, BUTTON_STATE.PRESSED])
	}
	unregister(key: T): void {
		this.queue.push([key, BUTTON_STATE.UP])
	}
	tick(): void {
		for (const [key, state] of this.state) {
			if (state === BUTTON_STATE.PRESSED) {
				this.state.set(key, BUTTON_STATE.DOWN);
			}
		}
		for (const [key, qState] of this.queue) {
			const state = this.state.get(key);
			if (qState === BUTTON_STATE.PRESSED) {
				this.state.set(key, BUTTON_STATE.PRESSED);
			}
			if (qState === BUTTON_STATE.UP) {
				this.state.set(key, BUTTON_STATE.UP);
			}
		}
		this.queue = [];
	}
}

export class Mouse {
	buttons: State<MouseButton>;
	position: {
		x: number;
		y: number;
	};
	constructor() {
		this.buttons = new State();
		this.position = { x: Number.NaN, y: Number.NaN };
	}
	tick(): void {
		this.buttons.tick();
	}
}

export class Keyboard {
	static KEY_STATE = BUTTON_STATE;
	keys: State<KeyCode>;
	constructor() {
		this.keys = new State();
	}
	tick(): void {
		this.keys.tick();
	}
}
