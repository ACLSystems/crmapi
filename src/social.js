const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SocialSchema = new Schema ({
	facebook: {
		type: String,
	},
	twitter: {
		type: String
	},
	linkedin: {
		type: String
	},
	google: {
		type: String
	},
	instagram: {
		type: String
	}
},{ _id: false });

module.exports = SocialSchema;
