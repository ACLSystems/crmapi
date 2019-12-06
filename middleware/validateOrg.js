const {
	body,
	header,
	param,
	// query,
	validationResult
} 	= require('express-validator');
const StatusCodes = require('http-status-codes');

module.exports = {
	orgCreate: [
		header('content-type','Encabezado incorrecto - solo application/json')
			.equals('application/json'),
		body('name','El nombre de la cuenta debe existir').exists()
	],
	orgModify: [
		header('content-type','Encabezado incorrecto - solo application/json')
			.equals('application/json'),
		body('_id','El id de la cuenta (_id) es obligatorio').exists()
	],
	noteCreate: [
		header('content-type','Encabezado incorrecto - solo application/json')
			.equals('application/json'),
		body('text','Ingresa el texto de la nota').exists(),
		body('id','Ingresa el id de la cuenta').exists()
	],
	getOrg: [
		param('orgid','Ingresa el id de la cuenta').exists()
	],
	results(req,res,next) {
		//console.log(req.headers);
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Error: Favor de revisar los errores siguientes',
				errors: errors.array()
			});
		} else {
			next();
		}
	}
};
