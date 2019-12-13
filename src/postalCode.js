const mongoose 	= require('mongoose');
const Schema 		= mongoose.Schema;
const ModSchema = require('./modified');

const PostalCodeSchema = new Schema ({
	code: {
		type: String
	},
	suburb: {
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
	stateCode: {
		type: String
	},
	mod:[ModSchema]
});

PostalCodeSchema.index({code: 1});
PostalCodeSchema.index({code: 1, suburb: 1}, { unique: true});

module.exports = PostalCodeSchema;

const PostalCode = mongoose.model('postalCodes', PostalCodeSchema);
module.exports = PostalCode;
