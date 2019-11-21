const {
	body,
	header,
	// param,
	// query,
	validationResult
} 	= require('express-validator');
const StatusCodes = require('http-status-codes');

module.exports = {
	userCreate: [
		header('content-type','Encabezado incorrecto - solo application/json')
			.equals('application/json'),
		body('name','El usuario es obligatorio y debe ser un correo electrónico').exists().isEmail(),
		body('password','El password es obligatorio').exists()
	],
	userModify: [
		header('content-type','Encabezado incorrecto - solo application/json')
			.equals('application/json'),
		body('name','El usuario es obligatorio y debe ser un correo electrónico').exists().isEmail()
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
