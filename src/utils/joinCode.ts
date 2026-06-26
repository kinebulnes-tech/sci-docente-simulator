// Unambiguous characters — excludes 0/O, 1/I, 8/B, 5/S lookalikes.
const CHARS = "ACDEFGHJKLMNPQRTUVWXYZ2346789";
const CODE_LENGTH = 6;

/** Generates a random join code of the specified length. */
export function generateJoinCode(length = CODE_LENGTH): string {
  return Array.from(
    { length },
    () => CHARS[Math.floor(Math.random() * CHARS.length)]
  ).join("");
}

/** Strips non-alphanumeric chars and uppercases. */
export function normalizeJoinCode(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/** Returns true when the code matches the expected 6-char alphanumeric format. */
export function isValidJoinCode(raw: string): boolean {
  const code = normalizeJoinCode(raw);
  return code.length === CODE_LENGTH && /^[A-Z0-9]{6}$/.test(code);
}

/** Formats a raw code for display: "ABC123" → "ABC 123" */
export function formatJoinCode(raw: string): string {
  const code = normalizeJoinCode(raw).slice(0, CODE_LENGTH);
  return code.length > 3 ? `${code.slice(0, 3)} ${code.slice(3)}` : code;
}
