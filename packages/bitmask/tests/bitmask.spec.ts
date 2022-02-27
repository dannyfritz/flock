import { expect } from "chai";
import { idsToMask, all, any, without } from "../src/index";

describe("bitmask", () => {
  it("idsToMask()", () => {
    expect(idsToMask([])).to.equal(0b0n);
    expect(idsToMask([0])).to.equal(0b1n);
    expect(idsToMask([1])).to.equal(0b10n);
    expect(idsToMask([0, 1])).to.equal(0b11n);
    expect(idsToMask([0, 1, 10])).to.equal(0b10000000011n);
  });
  it("all()", () => {
    expect(all(0b10010n, 0b00000n)).to.equal(true);
    expect(all(0b10010n, 0b10000n)).to.equal(true);
    expect(all(0b10010n, 0b10010n)).to.equal(true);
    expect(all(0b10010n, 0b10011n)).to.equal(false);
    expect(all(0b10010n, 0b10001n)).to.equal(false);
    expect(all(0b10010n, 0b11111n)).to.equal(false);
  });
  it("any()", () => {
    expect(any(0b10010n, 0b11111n)).to.equal(true);
    expect(any(0b10010n, 0b10000n)).to.equal(true);
    expect(any(0b10010n, 0b11000n)).to.equal(true);
    expect(any(0b10010n, 0b00011n)).to.equal(true);
    expect(any(0b10010n, 0b00000n)).to.equal(false);
    expect(any(0b10010n, 0b01101n)).to.equal(false);
  });
  it("without()", () => {
    expect(without(0b10010n, 0b11111n)).to.equal(false);
    expect(without(0b10010n, 0b10000n)).to.equal(false);
    expect(without(0b10010n, 0b11000n)).to.equal(false);
    expect(without(0b10010n, 0b00011n)).to.equal(false);
    expect(without(0b10010n, 0b00000n)).to.equal(true);
    expect(without(0b10010n, 0b01101n)).to.equal(true);
  });
});
