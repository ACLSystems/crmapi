const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HappySchema = new Schema ({
	level: {
		type: String,
		enum: [
			'unknown',
			'angry',
			'fragile',
			'neutral',
			'happy',
			'elated'
		],
		default: 'unknown'
	}
}, { _id: false });

module.exports = HappySchema;
