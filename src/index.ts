type RGB = { r: number; g: number; b: number };
type RGBA = RGB & { a: number };
type OPTIONAL_ALPHA_RGBA = RGB & { a?: number };

class Polirae {
	private readonly rgba: RGBA;

	constructor(input: string | OPTIONAL_ALPHA_RGBA) {
		this.rgba = this.parse(input);
	}

	private parse(input: string | OPTIONAL_ALPHA_RGBA): RGBA {
		if (typeof input === "string") {
			return this.parseString(input);
		}

		return {
			r: Math.max(0, Math.min(255, Math.round(input.r))),
			g: Math.max(0, Math.min(255, Math.round(input.g))),
			b: Math.max(0, Math.min(255, Math.round(input.b))),
			a: typeof input.a === "number" ? Math.max(0, Math.min(1, input.a)) : 1,
		};
	}

	private parseString(str: string): RGBA {
		const hex = str.replace(/^#/, "");

		if (!/^(?:[0-9a-fA-F]{3}){1,2}$/.test(hex)) {
			throw new Error(`Invalid HEX format: ${str}`);
		}

		const isShort = hex.length === 3;
		const step = isShort ? 1 : 2;

		const [r, g, b] = [0, 1, 2].map((i) => {
			const part = hex.substring(i * step, (i + 1) * step);
			return parseInt(isShort ? part + part : part, 16);
		});

		if (r === undefined || g === undefined || b === undefined) {
			throw new Error(`Failed to parse hex components: ${str}`);
		}

		return { r, g, b, a: 1 };
	}

	public hex(): string {
		const res = (
			(1 << 24) +
			(this.rgba.r << 16) +
			(this.rgba.g << 8) +
			this.rgba.b
		)
			.toString(16)
			.slice(1);

		return `#${res}`;
	}

	public css(): string {
		const { r, g, b, a } = this.rgba;

		return a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`;
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

export const polirae = (input: string | OPTIONAL_ALPHA_RGBA) =>
	new Polirae(input);
