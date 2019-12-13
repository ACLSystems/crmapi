const mongoose = require('mongoose');
const ModSchema = require('./modified');
const Schema = mongoose.Schema;
const ObjectId 	= Schema.Types.ObjectId;

const CurrenciesSchema = new Schema ({
	name: {
		type: String
	},
	displayName: {
		type: String
	},
	symbol: {
		type: String
	},
	price: {
		type: Number,
		min: 0,
		default: 0
	},
	base: {
		type: ObjectId,
		ref: 'currencies'
	},
	isActive: {
		type: Boolean,
		default: true
	},
	mod: [ModSchema]
});

module.exports = CurrenciesSchema;

const Currency = mongoose.model('currencies', CurrenciesSchema);
module.exports = Currency;
