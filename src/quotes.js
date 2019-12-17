const mongoose 	= require('mongoose');
const auto 			= require('mongoose-sequence')(mongoose);
const ModSchema = require('./modified');
const Schema 		= mongoose.Schema;
const ObjectId 	= Schema.Types.ObjectId;

const QuoteSchema = new Schema ({
	quoteNumberInternal: {
		type: String,
	},
	quoteNumber: {
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
	opportunities: [{
		type: ObjectId,
		ref: 'opportunities'
	}],
	quoteCurrency: {
		type: ObjectId,
		ref: 'currencies'
	},
	quoteDiscount: {
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
	mod: [ModSchema]
});

QuoteSchema.pre('save', function(next) {
	let quote = this;
	let now = new Date();
	let month = now.getMonth() + '';
	month = month.padStart(2,'0');
	if(quote.quoteNumberInternal) {
		quote.quoteNumber = quote.quoteNumberInternal ? '' + now.getFullYear() + month + quote.quoteNumberInternal : now.getTime() + '';
	}
	next();
});

module.exports = QuoteSchema;

QuoteSchema.plugin(auto,{inc_field: 'quoteNumberInternal'});

const Quote = mongoose.model('quotes', QuoteSchema);
module.exports = Quote;
