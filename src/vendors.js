const mongoose = require('mongoose');
const ModSchema = require('./modified');
const Schema = mongoose.Schema;

const VendorsSchema = new Schema ({
	name: {
		type: String,
	},
	isActive: {
		type: Boolean,
		default: true
	},
	description: {
		type: String
	},
	mod: [ModSchema]
});

VendorsSchema.index( { name			: 1	});
VendorsSchema.index( { isActive	: 1	});

module.exports = VendorsSchema;

const Vendor = mongoose.model('vendors', VendorsSchema);
module.exports = Vendor;
