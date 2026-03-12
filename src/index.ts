export type RGB = { r: number; g: number; b: number };
export type RGBA = RGB & { a: number };
export type ColorInput = string | (RGB & { a?: number });

class Polirae {
	private readonly rgba: RGBA;

	constructor(input: ColorInput) {
		this.rgba = this.parse(input);
	}

	private parse(input: ColorInput): RGBA {
		if (typeof input === "string") {
			return this.parseString(input);
		}

		const clamp = (v: number, max = 255) =>
			Math.max(0, Math.min(max, Math.floor(v)));

		return {
			r: clamp(input.r),
			g: clamp(input.g),
			b: clamp(input.b),
			a: typeof input.a === "number" ? Math.max(0, Math.min(1, input.a)) : 1,
		};
	}

	private parseString(str: string): RGBA {
		const hex = str.replace(/^#/, "");

		if (!/^(?:[0-9a-fA-F]{3}){1,2}$/.test(hex)) {
			throw new Error(`Invalid HEX format: ${str}`);
		}

		const fullHex =
			hex.length === 3
				? hex
						.split("")
						.map((c) => c + c)
						.join("")
				: hex;

		const r = parseInt(fullHex.slice(0, 2), 16);
		const g = parseInt(fullHex.slice(2, 4), 16);
		const b = parseInt(fullHex.slice(4, 6), 16);

		return { r, g, b, a: 1 };
	}

	public hex(): string {
		const toHex = (v: number) =>
			Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0");

		return `#${toHex(this.rgba.r)}${toHex(this.rgba.g)}${toHex(this.rgba.b)}`;
	}

	public css(): string {
		const { r, g, b, a } = this.rgba;

		return a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`;
	}

	public toString(): string {
		return this.css();
	}

	public alpha(val: number): Polirae {
		return new Polirae({ ...this.rgba, a: val });
	}

	public darken(amount = 0.1): Polirae {
		const factor = 1 - amount;

		return new Polirae({
			r: this.rgba.r * factor,
			g: this.rgba.g * factor,
			b: this.rgba.b * factor,
			a: this.rgba.a,
		});
	}
}

export const polirae = (input: ColorInput) => new Polirae(input);
