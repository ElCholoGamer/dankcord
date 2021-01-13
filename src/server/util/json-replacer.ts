const jsonReplacer = (remove: string[] = []) =>
	function (key: string, val: any) {
		// Replace '_id' with 'id'
		if (typeof val === 'object' && '_id' in val) {
			val.id = val._id;
			delete val._id;
			return val;
		}

		// Replace date strings with timestamps
		if (typeof val === 'string') {
			const d = Date.parse(val);
			if (!isNaN(d)) return d;
		}

		return remove.includes(key) ? undefined : val;
	};

export default jsonReplacer;
