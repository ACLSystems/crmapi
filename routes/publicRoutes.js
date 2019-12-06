//const Validator 				= require('express-route-validator');
//const StatusCodes 			= require('http-status-codes');
const Validate					= require('../middleware/validatePublic');
const AuthMiddleware 		= require('../middleware/auth'								);
// const ChangeParams			= require('../middleware/changeParams'				);
const GetNothing 				= require('../controllers/get_nothing'				);
const UserController		= require('../controllers/usersController'		);
const OrgController			= require('../controllers/orgsController'			);

module.exports = (app) => {

	/** @api {get} /
		* @apiName greeting
		* @apiPermission none
		* @apiGroup none
		*/
	app.get ('/', GetNothing.greeting);

	/** @api {post} /login
		* @apiName login
		* @apiPermission none
		* @apiGroup User
		* @apiParam {String} [username] username - en formato de email
		* @apiParam {String} [password] password
		* @apiSuccess (200) {Object} mixed regresa Token y Expiración
		*/
	app.post('/login',
		Validate.login,
		Validate.results,
		AuthMiddleware.login
	);

	/** @api {get} /user/:username
		* @apiName userexists
		* @apiPermission none
		* @apiGroup User
		* @apiParam {String} [username] username - en formato de email
		* @apiSuccess (200) {Object} mixed regresa Token y Expiración
		*/
	app.get('/user/:username',
		Validate.userExists,
		Validate.results,
		UserController.checkUserExistence
	);

	/** @api {get} /org/:org
		* @apiName orgexists
		* @apiPermission none
		* @apiGroup Org
		* @apiParam {String} [org] nombre de la cuenta
		* @apiSuccess (200) {Object}
		*/
	app.get('/org/:org',
		Validate.orgExists,
		Validate.results,
		OrgController.checkOrgExistence
	);



	// /** @api {get} /api/user/:name
	// 	* @apiName Detalles del usuario
	// 	* @apiPermission none
	// 	* @apiGroup User
	// 	* @apiParam {String} [name] Nombre de usuario
	// 	* @apiSuccess (200) {Object}
	// 	*/
	// app.get ('/api/user/:name',
	// 	Validate.getDetailsPublic,
	// 	Validate.results,
	// 	UserController.getDetailsPublic);
	//
	// /** @api {post} /api/user/confirm
	// 	* @apiName Confirmar cuenta del usuario
	// 	* @apiPermission none
	// 	* @apiGroup User
	// 	* @apiParam {String} [email] email de usuario
	// 	* @apiParam {String} [token] token temporal
	// 	* @apiParam {String} [name] Nombre de usuario
	// 	* @apiParam {String} [fatherName] Apellido paterno
	// 	* @apiParam {String} [motherName] Apellido materno
	// 	* @apiSuccess (200) {Object}
	// 	*/
	// app.post('/api/user/confirm',
	// 	ChangeParams.confirm,
	// 	Validate.confirm,
	// 	Validate.results,
	// 	UserController.confirm);
	//
	// /** @api {post} /api/user/validateemail
	// 	* @apiName Validar cuenta de correo del usuario
	// 	* @apiPermission none
	// 	* @apiGroup User
	// 	* @apiParam {String} [email] email de usuario
	// 	* @apiSuccess (200) {Object}
	// 	*/
	// app.post('/api/user/validateemail',
	// 	Validate.validateEmail,
	// 	Validate.results,
	// 	UserController.validateEmail);
	//
	// /** @api {post} /api/user/passwordrecovery
	// 	* @apiName Validar cuenta de correo para recuperar password del usuario
	// 	* @apiPermission none
	// 	* @apiGroup User
	// 	* @apiParam {String} [email] email de usuario
	// 	* @apiParam {String} [emailID] token temporal
	// 	* @apiParam {String} [password] password de usuario
	// 	* @apiSuccess (200) {Object}
	// 	*/
	// app.post('/api/user/passwordrecovery',
	// 	Validate.passwordRecovery,
	// 	Validate.results,
	// 	UserController.passwordRecovery);
	//
	// /** @api {get} /api/help
	// 	* @apiName Ayuda y documentación (desaparecerá)
	// 	* @apiPermission none
	// 	* @apiGroup Public
	// 	* @apiSuccess (200) {Object}
	// 	*/
};
