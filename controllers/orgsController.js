const StatusCodes	= require('http-status-codes');
const Org 				= require('../src/orgs');
const Note				= require('../src/notes');
const Err 				= require('../controllers/err500_controller');

module.exports = {

	// crear ORG (crear cuenta)
	async create(req,res) {
		// console.log(res.locals);
		const key_user = res.locals.user;
		// console.log(req.body);
		var org = new Org({
			name: req.body.name,
			longName: req.body.longName,
			alias: req.body.alias && (typeof req.body.alias === 'string') ? JSON.parse(req.body.alias) : undefined,
			isActive: true,
			type: req.body.type ? req.body.type : 'customer',
			address: req.body.address ? req.body.address: {},
			social: req.body.social ? req.body.social: {},
			owner: key_user._id,
			phone: req.body.phone ? req.body.phone : undefined,
			emails: req.body.emails ? req.body.emails : undefined,
			emailDomain: req.body.emailDomain || undefined,
			tags: req.body.tags ? req.body.tags : undefined,
			mod: [generateMod(`${key_user.person.name} ${key_user.person.fatherName}`,'Creación')]
		});
		try {
			await org.save();
			res.status(StatusCodes.OK).json({
				'message': `${org.name} creada correctamente`,
				'id': org._id
			});
		} catch (e) {
			Err.sendError(res,e,'orgsController', 'create -- Creating Org--');
		}
	}, // create

	async modify(req,res) {
		const key_user = res.locals.user;
		var updates = Object.keys(req.body);
		if(updates.length === 0 ){
			return res.status(StatusCodes.BAD_REQUEST).json({
				'message': 'No hay nada que modificar'
			});
		}
		updates = updates.filter(item => item !== '_id');
		updates = updates.filter(item => item !== 'mod');
		const allowedUpdates = [
			'name',
			'longName',
			'type',
			'isActive',
			'owner',
			'phone',
			'emails',
			'emailDomain',
			'tags',
			'social',
			'happiness',
			'address'
		];
		// console.log(updates);
		// console.log(allowedUpdates);
		const isValidOperation = updates.every(update => allowedUpdates.includes(update));
		if(!isValidOperation) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				'message': 'Existen datos inválidos o no permitidos en el JSON proporcionado'
			});
		}
		try {
			var org = await Org.findById(req.body._id);
			if(!org) {
				return res.status(StatusCodes.NOT_FOUND).json({
					'message': 'Cuenta no encontrada'
				});
			}
			org = Object.assign(org,req.body);
			org.mod.push(generateMod(`${key_user.person.name} ${key_user.person.fatherName}`,'Modificando cuenta'));
			await org.save();
			res.status(StatusCodes.OK).json({
				'message': 'Cuenta modificada'
			});
		} catch (e) {
			Err.sendError(res,e,'orgController','modify -- Saving Org--');
		}
	}, // modify

	async checkOrgExistence(req,res) {
		const org = req.params.org;
		// console.log(org);
		try {
			const orgFound = await Org.findOne({name: org}).select('name');
			if(orgFound) {
				res.status(StatusCodes.OK).json({
					'message': `Cuenta ${orgFound.name} ya existe`
				});
			} else {
				res.status(StatusCodes.NOT_FOUND).json({
					'message': `Cuenta ${org} no existe`
				});
			}
		} catch (e) {
			Err.sendError(res,e,'orgsController','checkOrgExistence -- Finding Org --');
		}
	}, //checkUserExistence

	async createNote(req,res){
		const key_user = res.locals.user;
		const note = new Note({
			org: req.body.id,
			text: req.body.text,
			mod: [generateMod(`${key_user.person.name} ${key_user.person.fatherName}`,'Creación de nota')]
		});
		try {
			await note.save();
			res.status(StatusCodes.OK).json({
				'message': 'Nota creada'
			});
		} catch (e) {
			Err.sendError(res,e,'orgsController','createNote -- Saving Note --');
		}
	}, //createNote

	async list(req,res) {
		try {
			const orgs = await Org.find({isActive: true})
				.select('name longName type owner tags')
				.populate('owner','name person')
				.lean();
			if(orgs && Array.isArray(orgs) && orgs.length > 0) {
				res.status(StatusCodes.OK).json(orgs);
			} else {
				res.status(StatusCodes.NOT_FOUND).json({
					'message': 'No hay cuentas'
				});
			}
		} catch (e) {
			Err.sendError(res,e,'orgsController','list -- find Orgs --');
		}
	}, //list

	async get(req,res) {
		try {
			const org = await Org.findById(req.params.orgid)
				.select('name longName isActive type address social mod owner phone emails emailDomain happiness tags')
				.populate('owner', 'person');
			const notes = await Note.find({org: org._id})
				.select('text mod').lean();
			if(org) {
				if(Array.isArray(notes) && notes.length > 0) {
					org.notes = [...notes];
					res.status(StatusCodes.OK).json(org);
				}
			} else {
				res.status(StatusCodes.NOT_FOUND).json({
					'message': 'No existe la cuenta solicitada'
				});
			}
		} catch (e) {
			Err.sendError(res,e,'orgsController', 'get -- Finding Org--');
		}
	}, //get

};

function generateMod(by, desc) {
	const date = new Date();
	return {by: by, when: date, what: desc};
}
