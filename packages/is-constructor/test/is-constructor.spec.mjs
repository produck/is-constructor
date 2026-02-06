import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isConstructor, isExtensable } from '../src/index.mjs';

// Define test classes and functions
class MyClass {}
function MyFunction() {}

// Shared test fixtures
const constructors = [
	{ name: 'class', value: MyClass },
	{ name: 'regular function', value: MyFunction },
	{ name: 'Object', value: Object },
	{ name: 'Array', value: Array },
	{ name: 'String', value: String },
	{ name: 'Number', value: Number },
	{ name: 'Date', value: Date },
];

const nonConstructorFunctions = [
	{ name: 'arrow function', value: () => {} },
	{ name: 'async function', value: async function () {} },
	{ name: 'generator function', value: function* () {} },
	{ name: 'async generator function', value: async function* () {} },
];

const nonFunctionValues = [
	{ name: 'undefined', value: undefined },
	{ name: 'number', value: 123 },
	{ name: 'string', value: 'string' },
	{ name: 'plain object', value: {} },
	{ name: 'array literal', value: [] },
];

/**
 * Helper function to run parameterized tests
 */
function testCases(testName, fn, fixtures) {
	for (const fixture of fixtures) {
		it(`${testName} - ${fixture.name}`, () => {
			fn(fixture.value);
		});
	}
}

describe('isConstructor', () => {
	describe('✓ valid constructors', () => {
		testCases(
			'should return true for',
			(value) => {
				assert.strictEqual(isConstructor(value), true);
			},
			constructors,
		);
	});

	describe('✗ invalid constructors', () => {
		testCases(
			'should return false for',
			(value) => {
				assert.strictEqual(isConstructor(value), false);
			},
			[
				...nonConstructorFunctions,
				{ name: 'null', value: null },
				...nonFunctionValues,
			],
		);
	});
});

describe('isExtensable', () => {
	describe('✓ extensible values', () => {
		testCases(
			'should return true for',
			(value) => {
				assert.strictEqual(isExtensable(value), true);
			},
			[
				...constructors,
				{ name: 'null (special case)', value: null },
			],
		);
	});

	describe('✗ non-extensible values', () => {
		testCases(
			'should return false for',
			(value) => {
				assert.strictEqual(isExtensable(value), false);
			},
			[...nonFunctionValues, ...nonConstructorFunctions],
		);
	});
});
