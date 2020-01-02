const {
	body,
	// header,
	param,
	query,
	validationResult
} 	= require('express-validator');
const StatusCodes = require('http-status-codes');

module.exports = {
	getRoles: [
		param('username').optional()
	],
	setRoles: [
		param('username', 'username en params es obligatorio').exists(),
		body('roles', 'el objeto roles es obligatorio y debe contener al menos un rol a definir').exists()
	],
	createLanguage: [
		body('code', 'Code es obligatorio').exists(),
		body('name', 'Name es requerido').exists()
	],
	modifyLanguage:[
		body('languageid', 'languageid is requerido').exists()
	],
	createEnum: [
		body('schemaName', 'schemaName es obligatorio').exists(),
		body('field', 'field es obligatorio').exists(),
		body('value', 'value es obligatorio').exists(),
		body('text', 'text es requerido').exists(),
		body('language', 'language es requerido').exists()
	],
	getEnums: [
		query('language', 'language es requerido').exists(),
		query('schemaName', 'schemaName es requerido').exists(),
		query('field', 'field es requerido').exists()
	],
	modifyEnum:[
		body('enumid', 'enumid is requerido').exists()
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
