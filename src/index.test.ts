import { describe, expect, it } from "vitest";
import { polirae } from "./index.js";

describe("Polirae Color Library", () => {
	describe("Parsing", () => {
		it("should parse 6-digit HEX", () => {
			const color = polirae("#ff0000");
			expect(color.hex()).toBe("#ff0000");
			expect(color.css()).toBe("rgb(255, 0, 0)");
		});

		it("should parse 3-digit HEX", () => {
			const color = polirae("#0f0");
			expect(color.hex()).toBe("#00ff00");
			expect(color.css()).toBe("rgb(0, 255, 0)");
		});

		it("should parse RGBA object", () => {
			const color = polirae({ r: 0, g: 0, b: 255, a: 0.5 });
			expect(color.hex()).toBe("#0000ff");
			expect(color.css()).toBe("rgba(0, 0, 255, 0.5)");
		});

		it("should throw error on invalid hex", () => {
			expect(() => polirae("#invalid")).toThrow("Invalid HEX format");
		});
	});

	describe("Transformations (Immutable)", () => {
		it("should change alpha channel", () => {
			const base = polirae("#ffffff");
			const transparent = base.alpha(0.2);

			expect(base.css()).toBe("rgb(255, 255, 255)");
			expect(transparent.css()).toBe("rgba(255, 255, 255, 0.2)");
		});

		it("should darken the color", () => {
			const color = polirae("#ffffff").darken(0.2);
			expect(color.hex()).toBe("#cccccc");
		});

		it("should support chaining", () => {
			const result = polirae("#ffffff").darken(0.5).alpha(0.5).hex();

			expect(result).toBe("#808080");
		});
	});

	describe("Edge Cases", () => {
		it("should clamp values between 0 and 255", () => {
			const color = polirae({ r: 300, g: -20, b: 100 });
			expect(color.css()).toBe("rgb(255, 0, 100)");
		});

		it("should handle zero alpha correctly", () => {
			const color = polirae("#000").alpha(0);
			expect(color.css()).toBe("rgba(0, 0, 0, 0)");
		});
	});
});
