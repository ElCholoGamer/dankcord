function jsonReplacer(key: string, val: any) {
	// Replace '_id' with 'id'
	if (typeof val === 'object' && '_id' in val) {
		val.id = val._id;
		delete val._id;
		return val;
	}

	// Replace date strings with timestamps
	if (['createdAt', 'updatedAt'].includes(key) && typeof val === 'string') {
		const d = Date.parse(val);
		if (!isNaN(d)) return d;
	}

	return ['password', '__v', 'email'].includes(key) ? undefined : val;
}

export default jsonReplacer;
