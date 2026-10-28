/**
 * Check if a value is a non-null function accepted by a
 * `class X extends value` clause
 * @param value - The value to check
 * @returns True if the value is class-like, false otherwise
 */
export function isClassLike(value: unknown): boolean;

/**
 * Check if a value is accepted by a `class X extends value` clause
 * @param value - The value to check
 * @returns True if the extends clause accepts the value, false otherwise
 */
export function isDerivable(value: unknown): boolean;

/**
 * Check if a value carries the internal `[[Construct]]` method
 * @param value - The value to check
 * @returns True if the value is newable, false otherwise
 */
export function isNewable(value: unknown): boolean;

/**
 * Check if a value is newable and carries an object or function `prototype`
 * @param value - The value to check
 * @returns True if the value is a constructor, false otherwise
 */
export function isConstructor(value: unknown): boolean;
