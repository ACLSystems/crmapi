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
		body('name', 'Nombre del producto es obligatorio').exists(),
		body('vendor', 'Fabricante es obligatorio y debe ser ObjectId válido').exists().isMongoId()
	],
	modify: [
		header('content-type','Encabezado incorrecto - solo application/json')
			.equals('application/json'),
		body('productid', 'ID del producto es obligatorio').exists()
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
