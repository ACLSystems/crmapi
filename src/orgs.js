// Definir requerimientos
const mongoose 	= require('mongoose'		);
const ModSchema = require('./modified'	);
const Address		= require('./address'		);
const Social 		= require('./social'		);
const Happy 		= require('./happiness'	);
const Schema 		= mongoose.Schema;
const ObjectId 	= Schema.Types.ObjectId;

mongoose.plugin(schema => { schema.options.usePushEach = true; });

// Definir esquema y subesquemas


// Esquema para organización

const OrgsSchema = new Schema ({
	name: {
		type: String,
		validate: {
			validator: (name) => name.length > 2,
			message: '"name" must have more than 2 characters'
		},
		required: [ true, '"name" es requerido'],
		lowercase: true,
		unique: true
	},
	longName: {
		type: String,
		validate: {
			validator: (longName) => longName.length > 2,
			message: '"longName" must have more than 2 characters'
		},
		required: [ true, '"longName" es required']
	},
	alias:{
		type: [String]
	},
	isActive: {
		type: Boolean,
		default: true
	},
	type: [{
		type: Number,
		// enum: ['customer', 'internal', 'provider', 'partner', 'support'],
		default: 0,
		required: true
	}],
	address: [Address],
	social: [Social],
	mod: [ModSchema],
	owner: {
		type: ObjectId,
		ref: 'users'
	},
	// notes: [{
	// 	text: {
	// 		type: String,
	// 	},
	// 	mod: [ModSchema]
	// }],
	phone: [{
		type: String
	}],
	emails: [{
		type: String,
		match: /\S+@\S+\.\S+/
	}],
	emailDomain: {
		type: String
	},
	happiness: Happy,
	tags: [{
		type: String
	}]
	// perm: PermissionsSchema,
});

// Definir virtuals

// Definir middleware

OrgsSchema.pre('save', function(next) {
	this.name = this.name.toLowerCase();
	next();
});

OrgsSchema.static('enumType' , function(language, field){
	const Enum = require('../src/enums');
	return Enum.find({language, field,schemaName: 'orgs'}).sort({value: 1});
});

// Definir índices

OrgsSchema.index({ isActive: 1});

// Compilar esquema

const Orgs = mongoose.model('orgs', OrgsSchema);
module.exports = Orgs;
