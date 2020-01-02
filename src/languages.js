const mongoose = require('mongoose'			);
const ModSchema 				= require('./modified'		);
const Schema 						= mongoose.Schema;

mongoose.plugin(schema => { schema.options.usePushEach = true; });

const LanguageSchema = Schema({
	code: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	default: {
		type: Boolean,
		default: false
	},
	mod: [ModSchema]
});

LanguageSchema.methods.log = function(byFirstName, byName, what){
	console.log('Lenguaje');
	this.mod.unshift({
		by: `${byFirstName} ${byName}`,
		what: what,
		when: new Date()
	});
};

const Language = mongoose.model('languages', LanguageSchema);
module.exports = Language;
