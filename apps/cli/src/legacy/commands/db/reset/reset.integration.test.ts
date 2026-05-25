import { describe, expect, it } from "@effect/vitest";
import { Effect, Layer, Option } from "effect";
import { LegacyGoProxy } from "../../../../shared/legacy/go-proxy.service.ts";
import { legacyDbReset } from "./reset.handler.ts";
import type { LegacyDbResetFlags } from "./reset.command.ts";

function setupLegacyDbReset() {
  const calls: Array<ReadonlyArray<string>> = [];
  const layer = Layer.succeed(LegacyGoProxy, {
    exec: (args) =>
      Effect.sync(() => {
        calls.push(args);
      }),
  });
  return { layer, calls };
}

const baseFlags: LegacyDbResetFlags = {
  dbUrl: Option.none(),
  linked: false,
  local: false,
  noSeed: false,
  version: Option.none(),
  last: Option.none(),
};

describe("legacy db reset", () => {
  it.live("forwards --version to the Go proxy", () => {
    const { layer, calls } = setupLegacyDbReset();
    return Effect.gen(function* () {
      yield* legacyDbReset({
        ...baseFlags,
        version: Option.some("20230101000000"),
      });
      expect(calls).toEqual([["db", "reset", "--version", "20230101000000"]]);
    }).pipe(Effect.provide(layer));
  });
});
