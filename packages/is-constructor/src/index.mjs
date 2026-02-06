export function isExtensable(value) {
	try {
		void class extends value{};

		return true;
	} catch {
		return false;
	}
}

export function isConstructor(value) {
	return typeof value === 'function' && isExtensable(value);
}
