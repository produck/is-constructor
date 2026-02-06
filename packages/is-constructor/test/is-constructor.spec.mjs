import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isConstructor, isNotNullConstructor } from '../src/index.mjs';

describe('isConstructor', () => {
	it('should return true for class', () => {
		class MyClass {}
		assert.strictEqual(isConstructor(MyClass), true);
	});

	it('should return true for function', () => {
		function MyFunction() {}
		assert.strictEqual(isConstructor(MyFunction), true);
	});

	it('should return true for built-in constructors', () => {
		assert.strictEqual(isConstructor(Object), true);
		assert.strictEqual(isConstructor(Array), true);
		assert.strictEqual(isConstructor(String), true);
		assert.strictEqual(isConstructor(Number), true);
		assert.strictEqual(isConstructor(Date), true);
	});

	it('should return false for arrow functions', () => {
		const arrowFunc = () => {};
		assert.strictEqual(isConstructor(arrowFunc), false);
	});

	it('should return false for async functions', () => {
		async function asyncFunc() {}
		assert.strictEqual(isConstructor(asyncFunc), false);
	});

	it('should return false for generator functions', () => {
		function* generatorFunc() {}
		assert.strictEqual(isConstructor(generatorFunc), false);
	});

	it('should return false for async generator functions', () => {
		async function* asyncGeneratorFunc() {}
		assert.strictEqual(isConstructor(asyncGeneratorFunc), false);
	});

	it('should return false for non-functions', () => {
		assert.strictEqual(isConstructor(null), false);
		assert.strictEqual(isConstructor(undefined), false);
		assert.strictEqual(isConstructor(123), false);
		assert.strictEqual(isConstructor('string'), false);
		assert.strictEqual(isConstructor({}), false);
		assert.strictEqual(isConstructor([]), false);
	});
});

describe('isNotNullConstructor', () => {
	it('should return true for class', () => {
		class MyClass {}
		assert.strictEqual(isNotNullConstructor(MyClass), true);
	});

	it('should return true for function', () => {
		function MyFunction() {}
		assert.strictEqual(isNotNullConstructor(MyFunction), true);
	});

	it('should return false for null', () => {
		assert.strictEqual(isNotNullConstructor(null), false);
	});

	it('should return false for undefined', () => {
		assert.strictEqual(isNotNullConstructor(undefined), false);
	});

	it('should return false for arrow functions', () => {
		const arrowFunc = () => {};
		assert.strictEqual(isNotNullConstructor(arrowFunc), false);
	});

	it('should return false for async functions', () => {
		async function asyncFunc() {}
		assert.strictEqual(isNotNullConstructor(asyncFunc), false);
	});

	it('should return false for generator functions', () => {
		function* generatorFunc() {}
		assert.strictEqual(isNotNullConstructor(generatorFunc), false);
	});

	it('should return false for async generator functions', () => {
		async function* asyncGeneratorFunc() {}
		assert.strictEqual(isNotNullConstructor(asyncGeneratorFunc), false);
	});

	it('should return false for non-constructors', () => {
		assert.strictEqual(isNotNullConstructor(123), false);
		assert.strictEqual(isNotNullConstructor('string'), false);
		assert.strictEqual(isNotNullConstructor({}), false);
		assert.strictEqual(isNotNullConstructor([]), false);
	});
});
