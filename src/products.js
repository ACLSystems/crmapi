const mongoose 	= require('mongoose');
const ModSchema = require('./modified');
const Schema 		= mongoose.Schema;
const ObjectId 	= Schema.Types.ObjectId;

const ProductSchema = new Schema ({
	name: {
		type: String,
	},
	version: {
		type: String
	},
	description: {
		type: String
	},
	catLevel1: {
		type: String
	},
	catLevel2: {
		type: String
	},
	catLevel3: {
		type: String
	},
	vendor: {
		type: ObjectId,
		ref: 'vendors'
	},
	pricing:[{
		plan: {
			type: String
		},
		level: {
			type: Number
		},
		description: {
			type: String
		},
		base: {
			type: String,
			enum: [
				'annually',
				'monthly'
			]
		},
		price: {
			type: Number
		},
		priceBase: {
			type: String,
			enum: [
				'/agent/month',
				'oneTime',
				'other'
			]
		},
		currency: {
			type: ObjectId,
			ref: 'currencies'
		}
	}],
	features: [{
		type: String
	}],
	addOn: [
		{
			name: {
				type: String
			},
			description: {
				type: String
			},
			minPlanLevel: {
				type: Number
			},
			price: {
				type: Number
			},
			priceBase: {
				type: String,
				enum: [
					'/agent/month',
					'oneTime',
					'other'
				]
			},
			currency: {
				type: String,
				enum: [
					'USD Dollar',
					'MXN Peso'
				],
				default: 'USD Dollar'
			}
		}
	],
	addOnGeneralDescription: {
		type: String
	},
	terms: [{
		type: String
	}],
	type: {
		type: String,
		enum: [
			'service',
			'product',
			'other'
		],
		default: 'service'
	},
	mod: [ModSchema]
});

module.exports = ProductSchema ;

const Product = mongoose.model('products', ProductSchema);
module.exports = Product;
