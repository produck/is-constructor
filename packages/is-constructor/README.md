# @produck/is-constructor

Use a modern way to check if it is a constructor.

## Installation

```bash
npm install @produck/is-constructor
```

## Semantics

Four predicates answer four different questions:

| Function               | Question                                                     |
| ---------------------- | ------------------------------------------------------------ |
| `isClassLike(value)`   | Is it a non-null function accepted by `class X extends`?     |
| `isDerivable(value)`   | Is `class X extends value` accepted at all (including null)? |
| `isNewable(value)`     | Does the value carry the internal `[[Construct]]`?           |
| `isConstructor(value)` | Is it newable and does it carry an object `prototype`?       |

`isClassLike` is the practical entry point: it accepts exactly the
values a class heritage clause accepts, minus `null`. The other three
exist for precision when a single judgment line is needed.

Guarantees and their limits:

- `isClassLike` guarantees the value can be used as a class heritage. It
  does not guarantee instantiation: `new (class extends Symbol {})()`
  still throws, and a `prototype` of `null` ends the prototype chain.
- `isNewable` guarantees the value carries `[[Construct]]` and reads no
  property, so no Proxy trap runs. It does not guarantee that
  `new value()` succeeds: `Symbol` and `BigInt` are newable, but their
  constructors throw.
- `isDerivable` is the heritage clause itself: it reads
  `value.prototype`, so a Proxy `get` trap runs and may have side
  effects.
- `isConstructor` adds the `[[Construct]]` and `prototype` requirements
  on top of `isNewable`, and also reads `value.prototype`. A callable
  `prototype` counts: `Function.prototype` is itself a function.

## Usage

### `isClassLike(value)`

Check whether the value is a non-null function accepted by a class
heritage clause. This is the recommended predicate when deciding
whether a value can be used as a class base.

```javascript
import { isClassLike } from '@produck/is-constructor';

class MyClass {}
isClassLike(MyClass); // true

function MyFunction() {}
isClassLike(MyFunction); // true

isClassLike(Object); // true
isClassLike(Function); // true, `Function.prototype` is a function

isClassLike(MyClass.bind(null)); // false, bound functions have no `prototype`
isClassLike(null); // false
isClassLike(() => {}); // false
isClassLike(42); // false
```

Deriving is not the same as instantiating:

```javascript
class FromSymbol extends Symbol {}
isClassLike(Symbol); // true
new FromSymbol(); // throws: Symbol is not a constructor
```

### `isDerivable(value)`

Check whether the value is accepted by a class heritage clause.

```javascript
import { isDerivable } from '@produck/is-constructor';

class MyClass {}
isDerivable(MyClass); // true

function MyFunction() {}
isDerivable(MyFunction); // true

isDerivable(Object); // true
isDerivable(Array); // true

isDerivable(null); // true, `class X extends null {}` is legal

isDerivable(undefined); // false
isDerivable(42); // false
isDerivable(() => {}); // false

const bound = MyClass.bind(null);
isDerivable(bound); // false, bound functions have no `prototype`
```

### `isNewable(value)`

Check whether the value carries the internal `[[Construct]]` method.

```javascript
import { isNewable } from '@produck/is-constructor';

class MyClass {}
isNewable(MyClass); // true

isNewable(MyClass.bind(null)); // true

isNewable(Symbol); // true, even though `new Symbol()` throws
isNewable(BigInt); // true, even though `new BigInt()` throws

isNewable(() => {}); // false
isNewable(async function () {}); // false
isNewable(function* () {}); // false
isNewable({ m() {} }.m); // false
isNewable(null); // false

const proxy = new Proxy(() => {}, { construct: () => ({}) });
isNewable(proxy); // false, a `construct` trap cannot add [[Construct]]
```

### `isConstructor(value)`

Check whether the value is newable and carries an object `prototype`.

```javascript
import { isConstructor } from '@produck/is-constructor';

class MyClass {}
isConstructor(MyClass); // true

function MyFunction() {}
isConstructor(MyFunction); // true

isConstructor(Object); // true
isConstructor(Symbol); // true

isConstructor(MyClass.bind(null)); // false, no own `prototype`
isConstructor(null); // false

const fn = function () {};
fn.prototype = 42;
isConstructor(fn); // false
```

## Edge cases

Measured results for values where the predicates disagree (⭐ marks the
recommended default):

| Value                                  | `isClassLike` ⭐ | `isDerivable` | `isNewable` | `isConstructor` |
| -------------------------------------- | ---------------- | ------------- | ----------- | --------------- |
| `null`                                 | `false`          | `true`        | `false`     | `false`         |
| `class C {}` / `function F() {}`       | `true`           | `true`        | `true`      | `true`          |
| `Function` (callable `prototype`)      | `true`           | `true`        | `true`      | `true`          |
| `C.bind(null)`                         | `false`          | `false`       | `true`      | `false`         |
| `Symbol` / `BigInt`                    | `true`           | `true`        | `true`      | `true`          |
| `F.prototype = null`                   | `true`           | `true`        | `true`      | `false`         |
| `F.prototype = 42`                     | `false`          | `false`       | `true`      | `false`         |
| Proxy over `C`, `get` returns `42`     | `false`          | `false`       | `true`      | `false`         |
| Revoked Proxy over `C`                 | `false`          | `false`       | `true`      | `false`         |
| Proxy over arrow with `construct` trap | `false`          | `false`       | `false`     | `false`         |

Every `true` in this table is a syntax-level or slot-level answer. None
of them implies `new` succeeds: `Symbol`, `BigInt` and a `construct` trap
that throws all pass the checks and still throw at instantiation.

## License

MIT
