const mongoose = require('mongoose'			);
const ModSchema 				= require('./modified'		);
const Schema 						= mongoose.Schema;
const ObjectId 					= Schema.Types.ObjectId;

mongoose.plugin(schema => { schema.options.usePushEach = true; });

const EnumSchema = new Schema ({
	schemaName: {
		type: String,
		required: true
	},
	field: {
		type: String,
		required: true
	},
	value: {
		type: Number,
		required: true
	},
	text: {
		type: String,
		required: true
	},
	language: {
		type: ObjectId,
		ref: 'languages'
	},
	mod: [ModSchema]
});

EnumSchema.index({schemaName	: 1});
EnumSchema.index({field				: 1});
EnumSchema.index({value				: 1});
EnumSchema.index({text				: 1});
EnumSchema.index({language		: 1});
EnumSchema.index({
	schemaName	: 1,
	field				: 1,
	text				: 1,
	language		: 1
},{
	unique			: 1
});
EnumSchema.index({
	schemaName	: 1,
	field				: 1,
	value				: 1,
	language		: 1
},{
	unique			: 1
});

EnumSchema.methods.log = function(byFirstName, byName, what){
	this.mod.unshift({
		by: `${byFirstName} ${byName}`,
		what: what,
		when: new Date()
	});
};

const Enum = mongoose.model('enums', EnumSchema);
module.exports = Enum;
