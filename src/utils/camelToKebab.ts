/**
 * camelToKebab converts a camelCase string to kebab-case.
 */
export function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}
