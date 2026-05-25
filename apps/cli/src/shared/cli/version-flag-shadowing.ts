/** Internal alias used to avoid Effect CLI's global `--version` boolean flag. */
export const COMMAND_VERSION_FLAG_ALIAS = "supabase-cmd-version";

const VERSION_FLAG = "--version";
const VERSION_FLAG_PREFIX = "--version=";
const ALIAS_FLAG = `--${COMMAND_VERSION_FLAG_ALIAS}`;
const ALIAS_FLAG_PREFIX = `--${COMMAND_VERSION_FLAG_ALIAS}=`;

function isVersionFlagToken(arg: string): boolean {
  return arg === VERSION_FLAG || arg.startsWith(VERSION_FLAG_PREFIX);
}

/**
 * Returns true when `--version` appears after at least one subcommand token and
 * should be treated as a command flag instead of the global CLI version flag.
 */
export function shouldUnshadowCommandVersionFlag(args: ReadonlyArray<string>): boolean {
  let sawSubcommand = false;

  for (const arg of args) {
    if (isVersionFlagToken(arg)) {
      return sawSubcommand;
    }

    if (!arg.startsWith("-")) {
      sawSubcommand = true;
    }
  }

  return false;
}

/** Rewrites shadowed `--version` tokens to the internal command alias. */
export function unshadowCommandVersionFlag(args: ReadonlyArray<string>): ReadonlyArray<string> {
  if (!shouldUnshadowCommandVersionFlag(args)) {
    return args;
  }

  return args.map((arg) => {
    if (arg === VERSION_FLAG) {
      return ALIAS_FLAG;
    }

    if (arg.startsWith(VERSION_FLAG_PREFIX)) {
      return `${ALIAS_FLAG_PREFIX}${arg.slice(VERSION_FLAG_PREFIX.length)}`;
    }

    return arg;
  });
}
