const mongoose 	= require('mongoose');
const auto 			= require('mongoose-sequence')(mongoose);
const ModSchema = require('./modified');
const Schema 		= mongoose.Schema;
const ObjectId 	= Schema.Types.ObjectId;

const BusinessSchema = new Schema ({
	number: {
		type: Number
	},
	name: {
		type: String,
		required: [true, 'Hace falta el nombre']
	},
	status: {
		type: String,
		enum: [
			'new',
			'demo',
			'evaluation',
			'negotiation',
			'commitment',
			'hold',
			'won',
			'lost'
		],
		default: 'new'
	},
	closed: {
		type: Boolean,
		default: false
	},
	mainCurrency: {
		type: ObjectId,
		ref: 'currencies'
	},
	backCurrency: {
		type: ObjectId,
		ref: 'currencies'
	},
	value: {
		type: Number,
		default: 0
	},
	type: {
		type: String,
		enum: [
			'new',
			'renewal',
			'upgrade',
			'downgrade',
			'increase',
			'decrease',
			'service',
			'free'
		],
		default: 'new'
	},
	probability: {
		type: Number,
		min: 0,
		max: 100,
		default: 80
	},
	date: {
		type: Date,
		default: Date.now
	},
	expectedCloseDate: {
		type: Date
	},
	closeDate: {
		type: Date
	},
	relatedUsers: [{
		type: ObjectId,
		ref: 'users'
	}],
	owner: {
		type: ObjectId,
		ref: 'users',
		required: true
	},
	org: {
		type: ObjectId,
		ref: 'orgs',
		required: true
	},
	mod: [ModSchema]
});

BusinessSchema.pre('save', function(next) {
	if(this.status === 'won' || this.status === 'lost') {
		if(this.closed === undefined || this.closed === null) {
			this.closed = true;
		}
		if(!this.closeDate) {
			this.closeDate = new Date();
		}
	}
	next();
});

module.exports = BusinessSchema;

BusinessSchema.plugin(auto,{inc_field: 'number'});

const Business = mongoose.model('businesses', BusinessSchema);
module.exports = Business;
