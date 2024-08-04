import { describe, expect, it, jest } from "@jest/globals";

import {
  getTag,
  isLogLevelProperty,
  omitFilePathExtension,
  omitRowIndication,
} from "../../src/logger/helpers";
import { mockLocalStack, mockServiceStack } from "./helpers.mocks";

describe("omitRowIndication", () => {
  it("should omit row indication from a term with a colon", () => {
    const term = "some/path/to/file.ts:25:12";
    const result = omitRowIndication(term);
    expect(result).toBe("some/path/to/file.ts");
  });

  it("should return the term itself if there is no colon", () => {
    const term = "some/path/to/file";
    const result = omitRowIndication(term);
    expect(result).toBe("some/path/to/file");
  });
});

describe("omitFilePathExtension", () => {
  it("should omit the file path extension", () => {
    const filePath = "some/path/to/file.ts";
    const result = omitFilePathExtension(filePath);
    expect(result).toBe("some/path/to/file");
  });

  it("should return the file path without modification if there is no extension", () => {
    const filePath = "some/path/to/file";
    const result = omitFilePathExtension(filePath);
    expect(result).toBe("some/path/to/file");
  });
});

describe("isLogLevelProperty", () => {
  it("should return true for valid log level properties", () => {
    expect(isLogLevelProperty("error")).toBe(true);
    expect(isLogLevelProperty("warn")).toBe(true);
    expect(isLogLevelProperty("info")).toBe(true);
    expect(isLogLevelProperty("http")).toBe(true);
    expect(isLogLevelProperty("debug")).toBe(true);
  });

  it("should return false for invalid log level properties", () => {
    expect(isLogLevelProperty("invalid")).toBe(false);
    expect(isLogLevelProperty(123)).toBe(false);
    expect(isLogLevelProperty({})).toBe(false);
  });
});

describe("getTag", () => {
  it("should return an empty string if no invokePath is available", () => {
    jest.spyOn(global, "Error").mockImplementation((message?: string) => {
      return {
        stack: undefined,
        name: "",
        message,
      } as Error;
    });
    const tag = getTag();
    expect(tag).toBe("");
  });

  it("should convert invocation path to relative path and return uppercase tag", () => {
    const tag = getTag(mockLocalStack);
    expect(tag).toBe("PACKAGES/MS-COMMON/TESTS/LOGGER/HELPERS");
  });

  it("should convert invocation path to relative path and return uppercase tag for service path", () => {
    const tag = getTag(mockServiceStack);
    expect(tag).toBe("SERVICES/AUTH/SRC/INDEX");
  });
});
