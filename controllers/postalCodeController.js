const StatusCodes	= require('http-status-codes');
const PostalCode 	= require('../src/postalCode');
const Err 				= require('./err500_controller');
const modEntryLimit = 15;

module.exports = {
	async create(req,res) {
		const key_user = res.locals.user;
		try {
			var findCP = await PostalCode.findOne({code: req.body.code, suburb: req.body.suburb});
			if(findCP) {
				findCP = Object.assign(findCP,req.body);
				if(findCP.mod.length > modEntryLimit) {
					let mod = [...findCP.mod];
					findCP.mod = mod.slice(0,1).concat(mod(2,mod.length));
				}
				findCP.mod.push(generateMod(`${key_user.person.name} ${key_user.person.fatherName}`,'Actualización'));
				await findCP.save();
				res.status(StatusCodes.OK).json({
					'message': `${findCP.code} - ${findCP.suburb} actualizado correctamente`
				});
			} else {
				const cp = new PostalCode({
					code: req.body.code,
					suburb: req.body.suburb,
					locality: req.body.locality,
					city: req.body.city,
					state: req.body.state,
					stateCode: req.body.stateCode,
					mod: [generateMod(`${key_user.person.name} ${key_user.person.fatherName}`,'Creación')]
				});
				await cp.save();
				res.status(StatusCodes.OK).json({
					'message': `${cp.code} - ${cp.suburb} < creado correctamente`
				});
			}
		} catch (e) {
			Err.sendError(res,e,'PostalCodeController','create/modify -- finding/saving Code--');
		}
	}, //create

	async search(req,res) {
		try {
			const codes = await PostalCode.find({code: req.params.code}).lean();
			if(codes && Array.isArray(codes) && codes.length > 0) {
				const result = {
					cp: req.params.code,
					colonias: codes.map(({suburb}) => suburb),
					municipio: codes[0].locality,
					ciudad: codes[0].city,
					estado: codes[0].state
				};
				res.status(StatusCodes.OK).json(result);
			} else {
				res.status(StatusCodes.NOT_FOUND).json({
					'message': `${req.params.code} no fue encontrado`
				});
			}
		} catch (e) {
			Err.sendError(res,e,'PostalCodeController','search -- finding/saving Code--');
		}
	} //search
};

function generateMod(by, desc) {
	const date = new Date();
	return {by: by, when: date, what: desc};
}
