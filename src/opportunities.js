const mongoose 	= require('mongoose');
const auto 			= require('mongoose-sequence')(mongoose);
const ModSchema = require('./modified');
const Schema 		= mongoose.Schema;
const ObjectId 	= Schema.Types.ObjectId;

const OpportunitiesSchema = new Schema ({
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
	// quote: {
	// 	type: ObjectId,
	// 	ref: 'quotes'
	// },
	backCurrency: {
		type: ObjectId,
		ref: 'currencies'
	},
	value: {
		type: Number,
		default: 0
	},
	mrr: {
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
	product: {
		type: ObjectId,
		ref: 'products',
		required: true
	},
	plan: {
		type: String,
		required: true
	},
	quantity: {
		type: Number,
		min: 1,
		default: 1
	},
	discount: {
		type: Number,
		default: 0
	},
	base: {
		type: String
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

OpportunitiesSchema.pre('save', function(next) {
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

OpportunitiesSchema.index({ name		: 1 } );
OpportunitiesSchema.index({ quote 	: 1 } );
OpportunitiesSchema.index({ status	: 1 } );
OpportunitiesSchema.index({ closed	: 1 }, { sparse: true } );

module.exports = OpportunitiesSchema;

OpportunitiesSchema.plugin(auto,{inc_field: 'number'});

const Opportunity = mongoose.model('opportunities', OpportunitiesSchema);
module.exports = Opportunity;
