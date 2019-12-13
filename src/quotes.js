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
	quote: [
		{
			product: {
				type: ObjectId,
				ref: 'products'
			},
			plan: {
				type: Number
			},
			quantity: {
				type: Number
			},
			discount: {
				type: Number
			},
			base: {
				type: String,
				enum: [
					'annually',
					'sixMonthly',
					'threeMonthly',
					'monthly',
					'OneTime'
				]
			}
		}
	],
	quoteCurrency: {
		type: ObjectId,
		ref: 'currencies'
	},
	quoteDiscount: {
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
