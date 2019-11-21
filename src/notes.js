const mongoose = require('mongoose');
const ModSchema = require('./modified');
const Schema = mongoose.Schema;

const NotesSchema = new Schema ({
	text: {
		type: String,
	},
	mod: [ModSchema]
});

module.exports = NotesSchema;

const Note = mongoose.model('notes', NotesSchema);
module.exports = Note;
