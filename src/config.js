// Definir requerimientos
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.plugin(schema => { schema.options.usePushEach = true; });

// Definir esquema y subesquemas

const ConfigSchema = new Schema({
	server: {
		tz: {
			type: String
		}
	},
	fiscal: {
		defaultTag: {
			type: String
		},
		priceList: { //Colocar el default de la lista de precios
			id: {
				type: String
			},
			name: {
				type: String
			}
		},
		seller: { //Colocar el vendedor por default
			id: {
				type: String
			},
			name: {
				type: String
			},
			identification: {
				type: String
			}
		},
		term: { //Colocar el término de pago por default
			id: {
				type: String
			},
			name: {
				type: String
			},
			days: {
				type: String
			}
		},
		invoice: {
			paymentSystem : {
				type: String
			},
			observations: {
				type: String
			},
			anotation: {
				type: String
			},
			termsConditions: {
				type: String
			},
			status: {
				type: String,
				default: 'open'
			},
			numberTemplateInvoice: {
				id: {type: String}
			},
			numberTemplateSaleTicket: {
				id: {type: String}
			},
			paymentMethod: {
				type: Number,
				// enum: ['cash','debit-card','credit-card','service-card','transfer','check','electronic-wallet','electronic-money','grocery-voucher','other'],
				default: 9
			},
			cfdiUse: {
				type: String
			},
			stamp: {
				generate: {
					type: Boolean
				}
			},
			paymentType: {
				type: Number,
				// enum: ['PUE','PPD'],
				default: 1
			},
			tax: [{
				id: { type: Number}
			}]
		}
	},
	apiExternal: {
		uri: {
			type: String
		},
		username: {
			type: String
		},
		token: {
			type: String
		},
		enabled: {
			type: Boolean,
			default: false
		}
	},
	internalOrg: {
		type: Schema.Types.ObjectId,
		ref: 'orgs'
	},
	support: {
		uri: {
			type: String
		},
		apiKey: {
			type: String
		},
		cc_emails: {
			type: Array
		},
		enabled: {
			type: Boolean,
			default: false
		}
	},
	quote:{
		terms: [{
			type: String
		}],
		validDays: {
			type: Number
		},
		tax: {
			generateTax: {
				type: Boolean
			},
			taxes: [{
				name: {
					type: String
				},
				value: {
					type: Number
				}
			}]
		}
	},
	mainCurrency: {
		type: Schema.Types.ObjectId,
		ref: 'currencies'
	}
});

// Definir middleware

ConfigSchema.static('enumType' , function(language, field){
	const Enum = require('../src/enums');
	return Enum.find({language, field,schemaName: 'config'}).sort({value: 1});
});

// Definir índices

// Compilar esquema

const Config = mongoose.model('config', ConfigSchema, 'config');
module.exports = Config;
