import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  isClassLike,
  isConstructor,
  isDerivable,
  isNewable,
} from '../src/index.mjs';

class MyClass {}
function MyFunction() {}

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

function NullPrototype() {}
NullPrototype.prototype = null;

function NonObjectPrototype() {}
NonObjectPrototype.prototype = 42;

const constructTrapProxy = new Proxy(() => {}, {
  construct() {
    return {};
  },
});

const nonObjectPrototypeProxy = new Proxy(MyClass, {
  get(target, property, receiver) {
    return property === 'prototype'
      ? 42
      : Reflect.get(target, property, receiver);
  },
});

const throwingGetProxy = new Proxy(MyClass, {
  get() {
    throw new Error('get trap must not run');
  },
});

const revokedProxy = (() => {
  const { proxy, revoke } = Proxy.revocable(MyClass, {});

  revoke();

  return proxy;
})();

const methodShorthand = { m() {} }.m;
const staticMethod = class {
  static s() {}
}.s;
const classProxy = new Proxy(MyClass, {});

const newableValues = [
  { name: 'class', value: MyClass },
  { name: 'regular function', value: MyFunction },
  { name: 'bound class', value: MyClass.bind(null) },
  { name: 'bound function', value: MyFunction.bind(null) },
  { name: 'Object', value: Object },
  { name: 'Array', value: Array },
  { name: 'String', value: String },
  { name: 'Number', value: Number },
  { name: 'Date', value: Date },
  { name: 'Function', value: Function },
  { name: 'AsyncFunction', value: AsyncFunction },
  { name: 'Symbol', value: Symbol },
  { name: 'BigInt', value: BigInt },
  { name: 'class proxy', value: classProxy },
  { name: 'non-object prototype proxy', value: nonObjectPrototypeProxy },
  { name: 'revoked proxy', value: revokedProxy },
  { name: 'throwing get proxy', value: throwingGetProxy },
  { name: 'null prototype function', value: NullPrototype },
  { name: 'non-object prototype function', value: NonObjectPrototype },
];

const derivableValues = [
  { name: 'class', value: MyClass },
  { name: 'regular function', value: MyFunction },
  { name: 'Object', value: Object },
  { name: 'Array', value: Array },
  { name: 'String', value: String },
  { name: 'Number', value: Number },
  { name: 'Date', value: Date },
  { name: 'Function', value: Function },
  { name: 'AsyncFunction', value: AsyncFunction },
  { name: 'Symbol', value: Symbol },
  { name: 'BigInt', value: BigInt },
  { name: 'class proxy', value: classProxy },
  { name: 'null prototype function', value: NullPrototype },
  { name: 'null', value: null },
];

const nonNewableFunctions = [
  { name: 'arrow function', value: () => {} },
  { name: 'async function', value: async function () {} },
  { name: 'generator function', value: function* () {} },
  { name: 'async generator function', value: async function* () {} },
  { name: 'bound arrow function', value: (() => {}).bind(null) },
  { name: 'method shorthand', value: methodShorthand },
  { name: 'static method', value: staticMethod },
  { name: 'Function.prototype', value: Function.prototype },
  { name: 'eval', value: eval },
  { name: 'construct trap proxy over arrow', value: constructTrapProxy },
];

const nonFunctionValues = [
  { name: 'undefined', value: undefined },
  { name: 'null', value: null },
  { name: 'number', value: 123 },
  { name: 'string', value: 'string' },
  { name: 'plain object', value: {} },
  { name: 'array literal', value: [] },
];

function testCases(testName, fn, fixtures) {
  for (const fixture of fixtures) {
    it(`${testName} - ${fixture.name}`, () => {
      fn(fixture.value);
    });
  }
}

describe('isDerivable()', () => {
  describe('✓ derivable values', () => {
    testCases(
      'should return true for',
      (value) => {
        assert.strictEqual(isDerivable(value), true);
      },
      derivableValues,
    );
  });

  describe('✗ non-derivable values', () => {
    testCases(
      'should return false for',
      (value) => {
        assert.strictEqual(isDerivable(value), false);
      },
      [
        ...nonNewableFunctions,
        ...nonFunctionValues.filter(({ value }) => value !== null),
        { name: 'bound class', value: MyClass.bind(null) },
        { name: 'bound function', value: MyFunction.bind(null) },
        { name: 'non-object prototype proxy', value: nonObjectPrototypeProxy },
        { name: 'revoked proxy', value: revokedProxy },
        { name: 'throwing get proxy', value: throwingGetProxy },
        { name: 'non-object prototype function', value: NonObjectPrototype },
      ],
    );
  });
});

describe('isNewable()', () => {
  describe('✓ newable values', () => {
    testCases(
      'should return true for',
      (value) => {
        assert.strictEqual(isNewable(value), true);
      },
      newableValues,
    );
  });

  describe('✗ non-newable values', () => {
    testCases(
      'should return false for',
      (value) => {
        assert.strictEqual(isNewable(value), false);
      },
      [...nonNewableFunctions, ...nonFunctionValues],
    );
  });
});

describe('isClassLike()', () => {
  describe('✓ class-like values', () => {
    testCases(
      'should return true for',
      (value) => {
        assert.strictEqual(isClassLike(value), true);
      },
      derivableValues.filter(({ value }) => value !== null),
    );
  });

  describe('✗ non-class-like values', () => {
    testCases(
      'should return false for',
      (value) => {
        assert.strictEqual(isClassLike(value), false);
      },
      [
        ...nonNewableFunctions,
        ...nonFunctionValues,
        { name: 'bound class', value: MyClass.bind(null) },
        { name: 'bound function', value: MyFunction.bind(null) },
        { name: 'non-object prototype proxy', value: nonObjectPrototypeProxy },
        { name: 'revoked proxy', value: revokedProxy },
        { name: 'throwing get proxy', value: throwingGetProxy },
        { name: 'non-object prototype function', value: NonObjectPrototype },
      ],
    );
  });
});

describe('isConstructor()', () => {
  describe('✓ constructor values', () => {
    testCases(
      'should return true for',
      (value) => {
        assert.strictEqual(isConstructor(value), true);
      },
      [
        { name: 'class', value: MyClass },
        { name: 'regular function', value: MyFunction },
        { name: 'Object', value: Object },
        { name: 'Array', value: Array },
        { name: 'String', value: String },
        { name: 'Number', value: Number },
        { name: 'Date', value: Date },
        { name: 'Function', value: Function },
        { name: 'AsyncFunction', value: AsyncFunction },
        { name: 'Symbol', value: Symbol },
        { name: 'BigInt', value: BigInt },
        { name: 'class proxy', value: new Proxy(MyClass, {}) },
      ],
    );
  });

  describe('✗ non-constructor values', () => {
    testCases(
      'should return false for',
      (value) => {
        assert.strictEqual(isConstructor(value), false);
      },
      [
        ...nonNewableFunctions,
        ...nonFunctionValues,
        { name: 'bound class', value: MyClass.bind(null) },
        { name: 'bound function', value: MyFunction.bind(null) },
        { name: 'null prototype function', value: NullPrototype },
        { name: 'non-object prototype function', value: NonObjectPrototype },
        { name: 'non-object prototype proxy', value: nonObjectPrototypeProxy },
        { name: 'revoked proxy', value: revokedProxy },
        { name: 'throwing get proxy', value: throwingGetProxy },
      ],
    );
  });
});
