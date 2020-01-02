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
		type: Number,
		// enum: [
		// 	'Nueva',
		// 	'Demo',
		// 	'Evaluación',
		// 	'Negociación',
		// 	'Compromiso',
		// 	'En pausa',
		// 	'Ganada',
		// 	'Perdida'
		// ],
		default: 0
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
		type: Number,
		// enum: [
		// 	'Venta nueva',
		// 	'Renovación',
		// 	'Upgrade',
		// 	'Downgrade',
		// 	'Incremento',
		// 	'Decremento',
		// 	'Servicio',
		// 	'Venta libre'
		// ],
		default: 0
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

OpportunitiesSchema.methods.changeStatus = function(status){
	if(!status) {
		this.status = 0;
	} else {
		this.status = status;
	}
};

OpportunitiesSchema.static('enumType' , function(language, field){
	const Enum = require('../src/enums');
	return Enum.find({language, field,schemaName: 'opportunities'}).sort({value: 1});
});


OpportunitiesSchema.index({ name		: 1 } );
OpportunitiesSchema.index({ quote 	: 1 } );
OpportunitiesSchema.index({ type 		: 1 } );
OpportunitiesSchema.index({ status	: 1 } );
OpportunitiesSchema.index({ closed	: 1 }, { sparse: true } );

module.exports = OpportunitiesSchema;

OpportunitiesSchema.plugin(auto,{inc_field: 'number'});

const Opportunity = mongoose.model('opportunities', OpportunitiesSchema);
module.exports = Opportunity;
