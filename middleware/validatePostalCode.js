const {
	body,
	header,
	param,
	// query,
	validationResult
} 	= require('express-validator');
const StatusCodes = require('http-status-codes');

module.exports = {
	create: [
		header('content-type','Encabezado incorrecto - solo application/json')
			.equals('application/json'),
		body('code', 'Código postal (code) es obligatorio').exists(),
		body('suburb', 'Asentamiento(suburb) es obligatorio').exists(),
		body('locality', 'Municipio/Delegación (locality) es obligatorio').exists(),
		body('state', 'Estado (state) es obligatorio').exists()
	],
	search:[
		param('code', 'Código postal (code) es obligatorio').exists()
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
