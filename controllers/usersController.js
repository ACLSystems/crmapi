const StatusCodes	= require('http-status-codes');
const User				= require('../src/users');
const Org 				= require('../src/orgs');
const Err 				= require('../controllers/err500_controller');


module.exports = {

	async create(req,res) {
		const key_user = res.locals.user;
		var user = new User({
			name: req.body.name,
			password: req.body.password,
			org: req.body.org,
			char1: req.body.char1,
			char2: req.body.char2,
			flag1: req.body.flag1,
			flag2: req.body.flag2,
			person: req.body.person,
			type: req.body.type,
			contactRole: req.body.contactRole,
			hasAuthority: req.body.hasAuthority,
			unSubscribe: req.body.unSubscribe,
			owner: key_user._id,
			source: req.body.source,
			tags: req.body.tags ? req.body.tags : undefined,
			social: req.body.social,
			address: req.body.address,
			mod: [generateMod(key_user.name,'Creación de usuario')],
			admin: {
				isActive: true,
				isVerified: false,
				isDataVerified: false,
				recoverString: '',
				passwordSaved: '',
				validationString: '',
				adminCreate: false,
				initialPassword: req.body.password,
				tokens: []
			},
			roles: {
				isAdmin: false,
				isBusiness: false,
				isSales: false,
				isFinance: false,
				isCustomer: false,
				isAudit: false
			},
			preferences: {
				alwaysSendEmail: true
			}
		});
		user.person.email = req.body.name;
		try {
			if(user.org){
				var orgs;
				if(Array.isArray(user.org)){
					orgs = await Org.find({name: {$in: user.org}});
				} else {
					orgs = await Org.find({name: user.org});
				}
				user.org = orgs;
			}
			await user.save();
			res.status(StatusCodes.OK).json({
				'message': `${user.name} creado correctamente`
			});
		} catch (e) {
			Err.sendError(res,e,'usersController', 'create -- Creating User--');
		}
	}, //create

	async getRoles(req,res) {
		const key_user = res.locals.user;
		const username = req.params.username;
		if(key_user.roles.isAdmin) {
			try {
				const user = await User.findOne({ name: username})
					.populate('org', 'name')
					.select('name roles');
				if(user && user.roles) {
					res.status(StatusCodes.OK).json({
						'message': user
					});
				} else  {
					res.status(StatusCodes.NOT_FOUND).json({
						'message': `${username} no existe o no tiene roles`
					});
				}
			} catch (e) {
				Err.sendError(res,e,'user_controller','getRoles -- Finding User --');
			}

		} else {
			res.status(StatusCodes.FORBIDDEN).json({
				'message': 'Función solo para administradores'
			});
		}
	}, // getRoles

	async setRoles(req,res) {
		const key_user = res.locals.user;
		const roles = req.body.roles;
		if(key_user.roles.isAdmin) {
			try {
				var user = await User.findOne({ name: req.params.username });
				if(user) {
					user.roles.isAdmin = roles.isAdmin ? true : false;
					user.roles.isBusiness = roles.isBusiness ? true : false;
					user.roles.isSales = roles.isSales ? true : false;
					user.roles.isCustomer = roles.isCustomer ? true : false;
					user.roles.isFinance = roles.isFinance ? true : false;
					user.roles.isAudit = roles.isAudit ? true : false;
					await user.save();
					res.status(StatusCodes.OK).json({
						'message': `${user.name} modificado`
					});
				} else {
					res.status(StatusCodes.NOT_FOUND).json({
						'message': `${req.params.username} no fue encontrado`
					});
				}
			} catch (e) {
				Err.sendError(res,e,'user_controller','setRoles -- Saving User--');
			}
		} else {
			res.status(StatusCodes.FORBIDDEN).json({
				'message': 'Función solo para administradores'
			});
		}
	}, // setRoles

	async modify(req,res) {
		const key_user = res.locals.user;
		var updates = Object.keys(req.body);
		if(updates.length === 0 ){
			return res.status(StatusCodes.BAD_REQUEST).json({
				'message': 'No hay nada que modificar'
			});
		}
		const username = req.body.name;
		updates = updates.filter(item => item !== 'name');
		if(!username) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				'message': 'No se indicó usuario a modificar'
			});
		}
		const allowedUpdates = [
			'person',
			'org',
			'orgUnit',
			'char1',
			'char2',
			'flag1',
			'flag2',
			'type',
			'contactRole',
			'hasAuthority',
			'unSubscribe',
			'owner',
			'source',
			'notes',
			'tags',
			'social',
			'happiness',
			'address'
		];
		const isValidOperation = updates.every(update => allowedUpdates.includes(update));
		if(!isValidOperation) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				'message': 'Existen datos inválidos en el JSON proporcionado'
			});
		}
		if((key_user.roles.isSales && key_user.name !== username) || key_user.name === username) {
			try {
				var user = await User.findOne({ name: username });
				if(!user) {
					return res.status(StatusCodes.NOT_FOUND).json({
						'message': `${username} no encontrado`
					});
				}
				for(var i=0; i < updates.length; i++) {
					if(updates[i] === 'person' || updates[i] === 'address') {
						const properties = Object.keys(req.body[updates[i]]);
						properties.forEach(property => {
							user[updates[i]][property] = req.body[updates[i]][property];
						});
					} else if(updates[i] === 'owner') {
						const owner = await User.findOne({name: req.body[updates[i]]}).select('_id').lean();
						if(!owner) {
							return res.status(StatusCodes.BAD_REQUEST).json({
								'message': 'El owner indicado no existe'
							});
						}
						user[updates[i]] = owner._id; //eslint-disable-line
					} else {
						user[updates[i]] = req.body[updates[i]];
					}
				}
				user.mod.push(generateMod(key_user.name,'Modificando usuario'));
				await user.save();
				res.status(StatusCodes.OK).json({
					'message': `${username} modificado`
				});
			} catch (e) {
				Err.sendError(res,e,'user_controller','modify -- Saving User--');
			}
		} else {
			res.status(StatusCodes.FORBIDDEN).json({
				'message': 'Operación no permitida'
			});
		}

	} // modify
};

function generateMod(by, desc) {
	const date = new Date();
	return {by: by, when: date, what: desc};
}
