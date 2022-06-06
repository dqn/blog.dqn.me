export function unwrap<T>(value: undefined | null | T, name: string): T {
  if (value === undefined || value === null) {
    throw new TypeError(`${name} must not be null`);
  }
  return value;
}
