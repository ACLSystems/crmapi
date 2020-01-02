const mongoose 	= require('mongoose');
const auto 			= require('mongoose-sequence')(mongoose);
const ModSchema = require('./modified');
const Schema 		= mongoose.Schema;
const ObjectId 	= Schema.Types.ObjectId;

const QuoteSchema = new Schema ({
	numberInternal: {
		type: Number,
	},
	number: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now
	},
	validDate: {
		type: Date
	},
	business: [
		{
			type: ObjectId,
			ref: 'businesses'
		}
	],
	owner: {
		type: ObjectId,
		ref: 'users'
	},
	customer: {
		type: ObjectId,
		ref: 'users',
		required: true
	},
	org: {
		type: ObjectId,
		ref: 'orgs',
		required: true
	},
	customerOrg: {
		type: ObjectId,
		ref: 'orgs',
		required: true
	},
	relatedUsers: [{
		type: ObjectId,
		ref: 'users'
	}],
	opportunities: [{
		type: ObjectId,
		ref: 'opportunities'
	}],
	currency: {
		type: ObjectId,
		ref: 'currencies'
	},
	discount: {
		type: Number
	},
	taxName: {
		type: String
	},
	tax: {
		type: Number
	},
	terms: [{
		type: String
	}],
	version: {
		type: Number
	},
	status: {
		type: Number,
		// enum: [
		// 	'new',
		// 	'review',
		// 	'won',
		// 	'lost'
		// ],
		default: 0
	},
	mod: [ModSchema]
});

QuoteSchema.static('enumType' , function(language, field){
	const Enum = require('../src/enums');
	return Enum.find({language, field,schemaName: 'quotes'}).sort({value: 1});
});


QuoteSchema.index({ number				: 1 }, {unique: true});
QuoteSchema.index({ numberInternal: 1 }, {unique: true});
QuoteSchema.index({ customerOrg		: 1 });
QuoteSchema.index({ org						: 1 });
QuoteSchema.index({ status				: 1 });
QuoteSchema.index({ customer			: 1 });

module.exports = QuoteSchema;

QuoteSchema.plugin(auto,{inc_field: 'numberInternal'});

const Quote = mongoose.model('quotes', QuoteSchema);
module.exports = Quote;
