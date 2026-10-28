const constructProbe = new Proxy(Object, {
  construct() {
    return {};
  },
});

export function isNewable(value) {
  try {
    Reflect.construct(constructProbe, [], value);

    return true;
  } catch {
    return false;
  }
}

export function isDerivable(value) {
  try {
    void class extends value {};

    return true;
  } catch {
    return false;
  }
}

export function isClassLike(value) {
  return typeof value === 'function' && isDerivable(value);
}

export function isConstructor(value) {
  if (!isNewable(value)) {
    return false;
  }

  try {
    const prototype = value.prototype;

    if (prototype === null) {
      return false;
    }

    if (typeof prototype !== 'object' && typeof prototype !== 'function') {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
