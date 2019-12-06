// Definir requerimientos
const mongoose 					= require('mongoose'			);
const moment 						= require('moment'				);
const bcrypt 						= require('bcryptjs'			);
const ModSchema 				= require('./modified'		);
// const PermissionsSchema = require('./permissions'	);
// const PointSchema 			= require('./point'				);
const Address						= require('./address'			);
const Social 						= require('./social');

const Schema 						= mongoose.Schema;
const ObjectId 					= Schema.Types.ObjectId;

mongoose.plugin(schema => { schema.options.usePushEach = true; });

// Definir esquema y subesquemas

// Definir virtuals

// Definir middleware

// Esquema para datos de la persona que posee un usuario
const PersonSchema = new Schema ({
	name: {
		type: String
	},
	fatherName: {
		type: String
	},
	motherName: {
		type: String
	},
	email: {
		type: String,
		unique: [true, 'Email already exists. Please verify'],
		match: /\S+@\S+\.\S+/
	},
	emails: [{
		type: String,
		match: /\S+@\S+\.\S+/
	}],
	birthDate: {
		type: Date
	},
	mainPhone: {
		type: String
	},
	secondaryPhone: {
		type: String
	},
	cellPhone: {
		type: String
	},
	gender: {
		type: String,
		enum: ['male', 'female']
	},
	alias: {
		type: String
	}

},{ _id: false });

// Definir virtuals
PersonSchema.virtual('fullName').get(function () {
	return this.name + ' ' + this.fatherName + ' ' + this.motherName;
});

// Definir middleware
PersonSchema.pre('save', function(next) {
	this.name = properCase(this.name);
	this.fatherName = properCase(this.fatherName);
	this.motherName = properCase(this.motherName);
	var birthDate = moment.utc(this.birthDate);
	this.birthDate = birthDate.toDate();
	next();
});

module.exports = PersonSchema;

// Esquema para manejar roles

const RolesSchema = new Schema ({
	isAdmin: {
		type: Boolean,
		required: true,
		default: false
	},
	isBusiness: {
		type: Boolean,
		required: true,
		default: false
	},
	isSales: {
		type: Boolean,
		required: true,
		default: false
	},
	isFinance: {
		type: Boolean,
		required: true,
		default: false
	},
	isCustomer: {
		type: Boolean,
		required: true,
		default: false
	},
	isAudit: {
		type: Boolean,
		required: true,
		default: false
	}
},{ _id: false });

// Definir virtuals

// Definir middleware

module.exports = RolesSchema;

const AdmUsrSchema = new Schema({
	isActive: {
		type: Boolean,
		default: true
	},
	isVerified: {
		type: Boolean,
		default: false
	},
	isDataVerified: {
		type: Boolean,
		default: false
	},
	recoverString: {
		type: String,
		default: ''
	},
	passwordSaved:{
		type: String,
		default: ''
	},
	validationString: {
		type: String,
		default: ''
	},
	adminCreate: {
		type: Boolean,
		default: false
	},
	initialPassword: {
		type: String
	},
	// tokens del usuario
	tokens: [{
		type: String
	}]
},{ _id: false });

// Definir virtuals

// Definir middleware

module.exports = AdmUsrSchema;

const PrefsSchema = new Schema({
	alwaysSendEmail: {
		type: Boolean,
		default: true
	}
},{ _id: false });

// Definir virtuals

// Definir middleware

module.exports = PrefsSchema;

// Esquema para usuario
const UserSchema = new Schema ({
	name: {
		type: String,
		required: [true, 'User name is required'],
		unique: [true, 'User name already exists. Please verify'],
		match: /\S+@\S+\.\S+/
	},
	password: {
		type: String
	},
	org: [{
		type: ObjectId,
		ref: 'orgs'
	}],
	orgUnit: {
		type: ObjectId,
		ref: 'orgUnits'
	},
	char1: {
		type: String
	},
	char2: {
		type: String
	},
	flag1: {
		type: String
	},
	flag2: {
		type: String
	},
	isActive: {
		type: Boolean,
		default: true,
	},
	person: PersonSchema,
	roles: RolesSchema,
	type: [{
		type: String,
		enum: ['lead', 'contact', 'internal', 'partner','reseller','other'],
		default: 'lead'
	}],
	contactRole: [{
		type: String,
		enum: [
			'Decision Maker',
			'Executive Sponsor',
			'Admin/Project Manager',
			'Finance',
			'Legal',
			'Purchase',
			'Technical',
			'Other'
		]
	}],
	hasAuthority: {
		type: Boolean,
		default: false
	},
	unSubscribe: {
		type: Boolean,
		default: false
	},
	owner: {
		type: ObjectId,
		ref: 'users'
	},
	source: {
		type: String,
		enum: [
			'web',
			'phone',
			'email',
			'fresh',
			'direct',
			'referal',
			'social',
			'event'
		]
	},
	notes: [{
		type: ObjectId,
		ref: 'notes'
	}],
	tags: [{
		type: String
	}],
	social: Social,
	happiness: {
		type: String,
		enum: [
			'unknown',
			'angry',
			'fragile',
			'neutral',
			'happy',
			'elated'
		],
		default: 'unknown'
	},
	address: [Address],
	mod: [ModSchema],
	// perm: PermissionsSchema,
	admin: AdmUsrSchema,
	preferences: PrefsSchema
});
// Definir virtuals

// Definir middleware

//Encriptar password antes de guardarlo en la base
UserSchema.pre('save', function(next) {
	// Este último pedazo hay que validarlo antes de liberarlo.
	// if(!this.isModified('password')) {
	// 	next();
	// }
	//if(this.password && this.admin.passwordSaved !== 'saved') {
	if(this.password) {
		var re = /^\$2a\$10\$.*/;
		var found = re.test(this.password);
		if(!found) {
			var salt = bcrypt.genSaltSync(10);
			this.password = bcrypt.hashSync(this.password, salt);
			this.admin.passwordSaved = 'saved';
		}
	}
	next();
});

UserSchema.pre('save', function(next) {
	if(!this.roles) {
		var roles = { isAdmin: false };
		this.roles = roles;
	}
	next();
});

UserSchema.methods.validatePassword = function(password, cb) {
	bcrypt.compare(password, this.password, function(err, isOk) {
		if(err) return cb(err);
		cb(null, isOk);
	});
};

// Definir índices

UserSchema.index( { name								: 1	}	);
UserSchema.index( { org									: 1	}	);
UserSchema.index( { char1								: 1	}	);
UserSchema.index( { char2								: 1	}	);
UserSchema.index( { flag1								: 1	}	);
UserSchema.index( { flag2								: 1	}	);
UserSchema.index( { report							: 1	}	);
UserSchema.index( { orgUnit							: 1	}	);
UserSchema.index( { 'person.name'				: 1	}	);
UserSchema.index( { 'person.fatherName'	: 1	}	);
UserSchema.index( { 'person.motherName'	: 1	}	);
UserSchema.index( { 'person.email'			: 1	}	);
UserSchema.index( { 'person.genre'			: 1	}, { sparse: true }	);

// Compilar esquema

const User = mongoose.model('users', UserSchema);
module.exports = User;

// Funciones privadas

function properCase(obj) {
	var name = new String(obj);
	var newName = new String();
	var nameArray = name.split(' ');
	var arrayLength = nameArray.length - 1;
	nameArray.forEach(function(word,i) {
		word = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
		if(i === arrayLength) { newName += word; } else { newName += word + ' '; }
	});
	return newName;
}
