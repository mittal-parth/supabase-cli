import { describe, expect, test } from "vitest";
import {
  shouldUnshadowCommandVersionFlag,
  unshadowCommandVersionFlag,
} from "./version-flag-shadowing.ts";

describe("version flag shadowing", () => {
  test("keeps root --version as the global CLI version flag", () => {
    expect(shouldUnshadowCommandVersionFlag(["--version"])).toBe(false);
    expect(unshadowCommandVersionFlag(["--version"])).toEqual(["--version"]);
  });

  test("keeps --version before any subcommand as the global CLI version flag", () => {
    expect(shouldUnshadowCommandVersionFlag(["--version", "db", "reset"])).toBe(false);
    expect(unshadowCommandVersionFlag(["--version", "db", "reset"])).toEqual([
      "--version",
      "db",
      "reset",
    ]);
  });

  test("treats --version after a subcommand as a command flag", () => {
    expect(shouldUnshadowCommandVersionFlag(["db", "reset", "--version", "20230101000000"])).toBe(
      true,
    );
    expect(unshadowCommandVersionFlag(["db", "reset", "--version", "20230101000000"])).toEqual([
      "db",
      "reset",
      "--supabase-cmd-version",
      "20230101000000",
    ]);
  });

  test("rewrites inline --version= forms after a subcommand", () => {
    expect(
      shouldUnshadowCommandVersionFlag(["migration", "squash", "--version=20230101000000"]),
    ).toBe(true);
    expect(unshadowCommandVersionFlag(["migration", "squash", "--version=20230101000000"])).toEqual(
      ["migration", "squash", "--supabase-cmd-version=20230101000000"],
    );
  });

  test("treats bare --version after a subcommand as a command flag", () => {
    expect(shouldUnshadowCommandVersionFlag(["db", "reset", "--version"])).toBe(true);
    expect(unshadowCommandVersionFlag(["db", "reset", "--version"])).toEqual([
      "db",
      "reset",
      "--supabase-cmd-version",
    ]);
  });
});
