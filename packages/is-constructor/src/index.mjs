export function isConstructor(value) {
	if (typeof value !== 'function') {
		return false;
	}

	try {
		void class extends value{};

		return true;
	} catch {
		return false;
	}
}

export function isNotNullConstructor(value) {
	return value !== null && isConstructor(value);
}
