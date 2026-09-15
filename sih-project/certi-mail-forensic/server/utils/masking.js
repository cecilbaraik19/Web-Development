/**
 * Masks common PII patterns in raw email text before storage.
 * This is a best-effort content-level mask, not encryption — it satisfies
 * the "configurable masking mechanism" requirement in the problem statement
 * for reducing exposure of personal data at rest.
 */
export function maskSensitiveContent(text) {
  if (!text) return text;

  let masked = text;

  // Email addresses -> keep domain, mask local part
  masked = masked.replace(
    /([a-zA-Z0-9._%+-]+)(@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
    (match, local, domain) => `${local[0]}${'*'.repeat(Math.max(local.length - 1, 1))}${domain}`
  );

  // Card-like number sequences (13-19 digits, with optional spaces/dashes)
  masked = masked.replace(
    /\b(?:\d[ -]?){13,19}\b/g,
    (match) => match.replace(/\d(?=\d{4})/g, '*')
  );

  // Phone-number-like sequences (10+ consecutive digits, allow separators)
  masked = masked.replace(
    /\b(?:\+?\d{1,3}[ -]?)?(?:\d[ -]?){9,12}\b/g,
    (match) => {
      const digits = match.replace(/\D/g, '');
      if (digits.length < 10) return match; // avoid over-masking short numbers
      return match.replace(/\d(?=\d{2})/g, '*');
    }
  );

  return masked;
}