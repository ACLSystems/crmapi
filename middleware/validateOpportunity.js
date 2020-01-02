const {
	body,
	header,
	param,
	// query,
	validationResult
} 	= require('express-validator');
const StatusCodes = require('http-status-codes');

module.exports = {
	currencyCreate: [
		header('content-type','Encabezado incorrecto - solo application/json')
			.equals('application/json'),
		body('name', 'Nombre de la moneda es obligatorio').exists(),
		body('displayName', 'Nombre para desplegar de la moneda es obligatorio').exists(),
		body('symbol', 'Símbolo de la moneda es obligatorio').exists(),
		body('base', 'Id de la moneda base es obligatorio').exists()
	],
	create: [
		header('content-type','Encabezado incorrecto - solo application/json')
			.equals('application/json'),
		body('name', 'Nombre de la oportunidad es obligatorio').exists(),
		body('mainCurrency', 'Moneda principal es obligatorio').exists(),
		body('owner', 'Vendedor(owner) es obligatorio').exists(),
		body('org', 'Cuenta(org) es obligatorio').exists()
	],
	modifyCurrency: [
		header('content-type','Encabezado incorrecto - solo application/json')
			.equals('application/json'),
		body('currency', 'ID de la moneda es obligatorio').exists()
	],
	updatePrice: [
		header('content-type','Encabezado incorrecto - solo application/json')
			.equals('application/json'),
		param('base', 'ID de moneda base es obligatorio').exists(),
		param('currency', 'ID de moneda es obligatorio').exists(),
		param('price','El precio es obligatorio').exists()
	],
	modify: [
		header('content-type','Encabezado incorrecto - solo application/json')
			.equals('application/json'),
		body('oppid', 'ID de la oportunidad es obligatorio').exists()
	],
	getEnums: [
		param('language', 'Language es requerido').exists(),
		param('field', 'Field es un campo requerido').exists()
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
