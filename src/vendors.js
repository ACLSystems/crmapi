const mongoose = require('mongoose');
const ModSchema = require('./modified');
const Schema = mongoose.Schema;

const VendorsSchema = new Schema ({
	name: {
		type: String,
	},
	mod: [ModSchema]
});

module.exports = VendorsSchema;

const Vendor = mongoose.model('vendors', VendorsSchema);
module.exports = Vendor;
