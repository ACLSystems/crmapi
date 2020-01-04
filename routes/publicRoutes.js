//const Validator 				= require('express-route-validator');
//const StatusCodes 			= require('http-status-codes');
const Validate					= require('../middleware/validatePublic'			);
const ValidateAdmin 		= require('../middleware/validateAdmin'				);
const AuthMiddleware 		= require('../middleware/auth'								);
// const ChangeParams			= require('../middleware/changeParams'				);
const GetNothing 				= require('../controllers/get_nothing'				);
const UserController		= require('../controllers/usersController'		);
const OrgController			= require('../controllers/orgsController'			);
const AdminController 	= require('../controllers/admin_controller'		);

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

	/** @api {get} /languages
		* @apiName languages
		* @apiPermission none
		* @apiGroup admin
		* @apiSuccess (200) {Object}
		*/
	app.get('/languages',
		AdminController.getLanguagesPublic
	);

	/** @api {get} /
		* @apiName get
		* @apiPermission admin
		* @apiGroup enum
		*/
	app.get('/enums',
		ValidateAdmin.getEnums,
		ValidateAdmin.results,
		AdminController.getEnum);
};
