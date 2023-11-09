import { describe, expect, test } from "vitest";
import { checkIsInside, checkIsNear, THRESHOLD } from "./functions";

const bounds: DOMRect = {
  x: 100,
  y: 100,
  width: 100,
  height: 100,
  bottom: 200,
  left: 100,
  right: 200,
  top: 100,
  toJSON: () => {},
};

describe("checkIsInside", () => {
  test("should be inside", () => {
    const coordinates = {
      x: 150,
      y: 150,
    };
    expect(checkIsInside(bounds, coordinates)).toBeTruthy();
  });
  test("should be outside (x)", () => {
    const coordinates = {
      x: 200,
      y: 150,
    };
    expect(checkIsInside(bounds, coordinates)).toBeFalsy();
  });
  test("should be outside (y)", () => {
    const coordinates = {
      x: 150,
      y: 200,
    };
    expect(checkIsInside(bounds, coordinates)).toBeFalsy();
  });
});

describe("checkIsNear", () => {
  test("should be inside threshold (top-left)", () => {
    const coordinates = {
      x: bounds.x - THRESHOLD / 2,
      y: bounds.y - THRESHOLD / 2,
    };
    expect(checkIsNear(bounds, coordinates)).toBeTruthy();
  });
  test("should be inside threshold (bottom-right)", () => {
    const coordinates = {
      x: bounds.right + THRESHOLD / 2,
      y: bounds.bottom + THRESHOLD / 2,
    };
    expect(checkIsNear(bounds, coordinates)).toBeTruthy();
  });
  test("should be outside threshold (top-left)", () => {
    const coordinates = {
      x: bounds.right + THRESHOLD,
      y: bounds.bottom + THRESHOLD,
    };
    expect(checkIsNear(bounds, coordinates)).toBeFalsy();
  });
  test("should be outside threshold (bottom-right)", () => {
    const coordinates = {
      x: bounds.x - THRESHOLD,
      y: bounds.y - THRESHOLD,
    };
    expect(checkIsNear(bounds, coordinates)).toBeFalsy();
  });
});
