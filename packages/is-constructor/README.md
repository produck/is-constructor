# @produck/is-constructor

Use a modern way to check if it is a constructor.

## Installation

```bash
npm install @produck/is-constructor
```

## Usage

### `isExtensable(value)`

Check if a value can be extended as a class base.

```javascript
import { isExtensable } from "@produck/is-constructor";

// Classes and functions
class MyClass {}
isExtensable(MyClass); // true

function MyFunction() {}
isExtensable(MyFunction); // true

// Built-in constructors
isExtensable(Object); // true
isExtensable(Array); // true

// Special case: null can be extended
isExtensable(null); // true

// Non-extensible values
isExtensable(undefined); // false
isExtensable(42); // false
isExtensable("string"); // false
```

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

## API

### `isExtensable(value: unknown): boolean`

Determines whether the given value can be extended as a class base.

**Parameters:**

- `value` - Any JavaScript value to test

**Returns:**

- `true` if the value can be used as a base in a class extends
  clause
- `false` otherwise

### `isConstructor(value: unknown): boolean`

Determines whether the given value can be used as a constructor.

**Parameters:**

- `value` - Any JavaScript value to test

**Returns:**

- `true` if the value is a constructor function (class or
  regular function that can be called with `new`)
- `false` otherwise

## How It Works

The implementation uses the technique of trying to extend the value as a
class:

```javascript
function isExtensable(value) {
	try {
		void class extends value{};
		return true;
	} catch {
		return false;
	}
}
```

This approach:

- ✓ Works with regular functions
- ✓ Works with class declarations
- ✓ Works with built-in constructors (Object, Array, Date, etc.)
- ✓ Correctly identifies non-constructors (arrow functions, async
  functions, generators, etc.)

## License

MIT
