const mongoose = require('mongoose');
const ModSchema = require('./modified');
const Schema = mongoose.Schema;

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
		type: Number
	},
	mod: [ModSchema]
});

module.exports = CurrenciesSchema;

const Currency = mongoose.model('currencies', CurrenciesSchema);
module.exports = Currency;
