/**
 * Type guard to check if a value is a non-null object
 * @param value The value to check
 * @returns True if the value is a non-null object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard to check if a value is a string
 * @param value The value to check
 * @returns True if the value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard to check if a value is a number
 * @param value The value to check
 * @returns True if the value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Type guard to check if a value is a boolean
 * @param value The value to check
 * @returns True if the value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Type guard to check if a value is an array
 * @param value The value to check
 * @returns True if the value is an array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Type guard to check if a string is a valid UUID
 * @param value The string to check
 * @returns True if the string is a valid UUID
 */
export function isUuid(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Generates a random UUID v4
 * @returns A random UUID
 */
export function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
} 