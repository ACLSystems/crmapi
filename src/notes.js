const mongoose = require('mongoose');
const ModSchema = require('./modified');
const Schema 		= mongoose.Schema;
const ObjectId 	= Schema.Types.ObjectId;

const NotesSchema = new Schema ({
	org:{
		type: ObjectId,
		ref: 'orgs'
	},
	user: {
		type: ObjectId,
		ref: 'users'
	},
	text: {
		type: String,
	},
	mod: [ModSchema]
});

module.exports = NotesSchema;

const Note = mongoose.model('notes', NotesSchema);
module.exports = Note;
