const {
	body,
	// header,
	param,
	// query,
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
