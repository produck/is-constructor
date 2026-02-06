# @produck/is-constructor

Use a modern way to check if it is a constructor.

## Installation

```bash
npm install @produck/is-constructor
```

## Usage

### `isConstructor(value)`

Check if a value is a constructor function.

```javascript
import { isConstructor } from "@produck/is-constructor";

// Classes
class MyClass {}
isConstructor(MyClass); // true

// Regular functions
function MyFunction() {}
isConstructor(MyFunction); // true

// Built-in constructors
isConstructor(Object); // true
isConstructor(Array); // true
isConstructor(Date); // true

// Arrow functions
const arrowFunc = () => {};
isConstructor(arrowFunc); // false

// Async functions
async function asyncFunc() {}
isConstructor(asyncFunc); // false

// Generator functions
function* generatorFunc() {}
isConstructor(generatorFunc); // false

// Async generator functions
async function* asyncGeneratorFunc() {}
isConstructor(asyncGeneratorFunc); // false

// Non-functions
isConstructor(null); // false
isConstructor(undefined); // false
isConstructor(42); // false
isConstructor("string"); // false
isConstructor({}); // false
```

### `isNotNullConstructor(value)`

Check if a value is a constructor and not null/undefined.

```javascript
import { isNotNullConstructor } from "@produck/is-constructor";

class MyClass {}
isNotNullConstructor(MyClass); // true

isNotNullConstructor(null); // false
isNotNullConstructor(undefined); // false

const arrowFunc = () => {};
isNotNullConstructor(arrowFunc); // false
```

## API

### `isConstructor(value: unknown): boolean`

Determines whether the given value can be used as a constructor.

**Parameters:**

- `value` - Any JavaScript value to test

**Returns:**

- `true` if the value is a constructor function (class or regular
  function that can be called with `new`)
- `false` otherwise

### `isNotNullConstructor(value: unknown): boolean`

Determines whether the given value is a constructor and not null or
undefined.

**Parameters:**

- `value` - Any JavaScript value to test

**Returns:**

- `true` if the value is a constructor function and is not null or
  undefined
- `false` otherwise

## Why `isNotNullConstructor`?

In JavaScript, `null` can actually be extended as a class base:

```javascript
class MyClass extends null {}
// This is valid JavaScript!
```

However, in practical usage, we typically don't want to treat `null` as a
valid constructor candidate. The `isNotNullConstructor()` function
explicitly filters out `null` and `undefined`, ensuring that only genuine
constructor functions are considered valid for instantiation.

This is especially useful when validating constructor arguments:

```javascript
function instantiate(ConstructorFn, ...args) {
	if (isNotNullConstructor(ConstructorFn)) {
		return new ConstructorFn(...args);
	}

	throw new TypeError("Expected a valid constructor, not null");
}

instantiate(null); // Throws error
instantiate(MyClass); // Works
instantiate(() => {}); // Throws error (arrow function)
```

The function uses the technique of trying to extend the value as a class.
If the extension succeeds, the value is a valid constructor. This approach:

- ✓ Works with regular functions
- ✓ Works with class declarations
- ✓ Works with built-in constructors (Object, Array, Date, etc.)
- ✓ Correctly identifies non-constructors (arrow functions, async
  functions, generators, etc.)

## License

MIT
