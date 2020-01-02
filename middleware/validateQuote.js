const {
	body,
	header,
	param,
	query,
	validationResult
} 	= require('express-validator');
const StatusCodes = require('http-status-codes');

module.exports = {
	create: [
		header('content-type','Encabezado incorrecto - solo application/json')
			.equals('application/json'),
		body('customer', 'El usuario cliente es requerido').isMongoId().exists(),
		body('org', 'La cuenta origen es requerida').isMongoId().exists(),
		body('customerOrg', 'La cuenta cliente es requerida').isMongoId().exists(),
	],
	modify: [
		header('content-type','Encabezado incorrecto - solo application/json')
			.equals('application/json'),
		body('quoteid', 'ID de cotización es obligatorio').exists()
	],
	list: [
		query('owner','El dueño debe ser un ObjectId válido').isMongoId().optional()
	],
	get: [
		param('quoteid','Ingresa el id de la cotización').exists()
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
