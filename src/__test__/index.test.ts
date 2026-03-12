import { describe, expect, it } from "vitest";
import { polirae } from "../index.js";

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

			expect(result).toBe("#7f7f7f");
		});
	});

	describe("Output Consistency", () => {
		it("should always return lowercase hex", () => {
			const color = polirae("#ABC");
			expect(color.hex()).toBe("#aabbcc");
		});

		it("should return clean rgb string for alpha === 1", () => {
			const color = polirae({ r: 255, g: 0, b: 0, a: 1 });
			expect(color.css()).toBe("rgb(255, 0, 0)");
		});
	});

	describe("Mathematical Correctness", () => {
		it("should maintain color integrity after multiple operations", () => {
			const color = polirae("#ffffff").darken(0.5).darken(0.5);
			expect(color.hex()).toBe("#3f3f3f");
		});
	});

	describe("DX: Utility methods", () => {
		it("should allow string conversion in template literals", () => {
			const color = polirae("#ff0000");
			expect(`${color}`).toBe("rgb(255, 0, 0)");
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

		it("should not go below black when over-darkened", () => {
			expect(polirae("#000000").darken(1).hex()).toBe("#000000");
		});
	});
});
