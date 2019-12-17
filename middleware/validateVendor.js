const {
	body,
	header,
	// param,
	// query,
	validationResult
} 	= require('express-validator');
const StatusCodes = require('http-status-codes');

module.exports = {
	create: [
		header('content-type','Encabezado incorrecto - solo application/json')
			.equals('application/json'),
		body('name', 'Nombre de la oportunidad es obligatorio').exists()
	],
	modify: [
		header('content-type','Encabezado incorrecto - solo application/json')
			.equals('application/json'),
		body('vendorid', 'ID del fabricante es obligatorio').exists()
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
