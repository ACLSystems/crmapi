const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema ({
	name: {
		type: String
	},
	street: {
		type: String
	},
	ext: {
		type: String
	},
	int: {
		type: String
	},
	suburb: {
		type: String
	},
	postalCode: {
		type: String
	},
	locality: {
		type: String
	},
	city: {
		type: String
	},
	state: {
		type: String
	},
	country: {
		type: String
	}
},{ _id: false });

module.exports = AddressSchema;
