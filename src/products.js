const mongoose 	= require('mongoose');
const ModSchema = require('./modified');
const Schema 		= mongoose.Schema;
const ObjectId 	= Schema.Types.ObjectId;

const PriceSchema = new Schema({
	base: {
		type: String
	},
	price: {
		type: Number,
		default: 0
	},
	discount: {
		type: Number,
		default: 0
	}
}, {_id: false});

module.exports = PriceSchema;

const BaseSchema = new Schema({
	name: {
		type: String,
		enum: [
			'Anual',
			'Mensual',
			'Trimestral',
			'Semestral'
		]
	},
	period: {
		type: Number,
		min: 1,
		max: 12,
		default: 1,
	}
}, {_id: false});

module.exports = BaseSchema;

const FeaturesSchema = new Schema({
	plan: {
		type: String
	},
	text: {
		type: String
	},
	description: {
		type: String
	}
}, {_id: false});

module.exports = FeaturesSchema;

const PlanSchema = new Schema({
	name: {
		type: String
	},
	level: {
		type: Number
	},
	description: {
		type: String
	},
	base: [BaseSchema],
	price: [PriceSchema],
	priceBase: {
		type: String,
		enum: [
			'/agente/mes',
			'Único pago',
			'Otro'
		]
	},
	currency: {
		type: ObjectId,
		ref: 'currencies'
	}
},{_id: false});

module.exports = PlanSchema;

const AddonSchema = new Schema({
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
			'/agente/mes',
			'Único pago',
			'Otro'
		]
	},
	currency: {
		type: ObjectId,
		ref: 'currencies'
	}
}, {_id: false});

module.exports = AddonSchema;

const ProductSchema = new Schema ({
	name: {
		type: String,
	},
	version: {
		type: String,
		default: 'no requerido'
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
		ref: 'vendors',
		required: true
	},
	isActive: {
		type: Boolean,
		default: true
	},
	plan:[PlanSchema],
	features: [FeaturesSchema],
	addOn: [AddonSchema],
	addOnGeneralDescription: {
		type: String
	},
	terms: [{
		type: String
	}],
	type: {
		type: String,
		enum: [
			'Servicio',
			'Producto',
			'Otro'
		],
		default: 'Servicio'
	},
	mod: [ModSchema]
});

ProductSchema.index({ name			: 1	});
ProductSchema.index({ vendor		: 1	});
ProductSchema.index({	name			: 1, vendor: 1}, {unique: true});
ProductSchema.index({ catLevel1	: 1});
ProductSchema.index({ catLevel2	: 1});
ProductSchema.index({ catLevel3	: 1});
ProductSchema.index({ isActive	: 1});
ProductSchema.index({ type			: 1});


module.exports = ProductSchema ;

const Product = mongoose.model('products', ProductSchema);
module.exports = Product;
