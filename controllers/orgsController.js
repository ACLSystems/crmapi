const StatusCodes	= require('http-status-codes');
const Org 				= require('../src/orgs');
const Note				= require('../src/notes');
const Err 				= require('../controllers/err500_controller');

module.exports = {

	// crear ORG (crear cuenta)
	async create(req,res) {
		const key_user = res.locals.user;
		var orgTemp = Object.assign({},req.body);
		orgTemp.alias = req.body.alias && (typeof req.body.alias === 'string') ? JSON.parse(req.body.alias) : undefined;
		orgTemp.type = req.body.type || 'customer';
		orgTemp.address = req.body.address || {};
		orgTemp.social = req.body.social || {};
		orgTemp.mod = [{
			by: `${key_user.person.name} ${key_user.person.fatherName}`,
			when: new Date(),
			what: 'Creación '
		}];
		var org = new Org(orgTemp);
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
		const addToArray = req.body.add || false;
		if(updates.length === 0 ){
			return res.status(StatusCodes.BAD_REQUEST).json({
				'message': 'No hay nada que modificar'
			});
		}
		updates = updates.filter(item => item !== '_id');
		updates = updates.filter(item => item !== 'mod');
		updates = updates.filter(item => item !== 'add');
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
		const allowedArrayAditions = [
			'address',
			'social',
			'phone',
			'emails'
		];
		const isValidOperation = updates.every(update => allowedUpdates.includes(update));
		const isValidAditionOperation = updates.every(update => allowedArrayAditions.includes(update));
		if(!isValidOperation) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				'message': 'Existen datos inválidos o no permitidos en el JSON proporcionado'
			});
		}
		try {
			var org = await Org.findById(req.body._id);
			if(org) {
				if(addToArray && updates.length === 1 && isValidAditionOperation) {
					const key = updates[0];
					org[key].push(req.body[key]);
					org.mod.unshift({
						by: `${key_user.person.name} ${key_user.person.fatherName}`,
						when: new Date(),
						what: 'Adición ' + updates.join()
					});
				} else {
					org = Object.assign(org,req.body);
					org.mod.unshift({
						by: `${key_user.person.name} ${key_user.person.fatherName}`,
						when: new Date(),
						what: 'Modificación ' + updates.join()
					});
				}
				await org.save();
				res.status(StatusCodes.OK).json({
					'message': 'Cuenta modificada'
				});
			} else {
				res.status(StatusCodes.NOT_FOUND).json({
					'message': 'Cuenta no encontrada'
				});
				return;
			}
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
			mod: [{
				by: `${key_user.person.name} ${key_user.person.fatherName}`,
				when: new Date(),
				what: 'Creación '
			}]
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
				.select('-__v')
				.populate('owner','name person')
				.lean();
			if(orgs && Array.isArray(orgs) && orgs.length > 0) {
				orgs.forEach(item => {
					item.mod = item.mod.slice(0,5);
				});
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
				.select('-__v')
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
