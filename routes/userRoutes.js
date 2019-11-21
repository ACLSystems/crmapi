const Validate				= require('../middleware/validateUser');
// const UserController		= require('../controllers/user_controller'		);
const UserController	= require('../controllers/usersController');

module.exports = (app) => {

	/** @api {post} /
		* @apiName create
		* @apiPermission admin
		* @apiGroup user
		*/
	app.post ('/api/v1/sales/user',
		Validate.userCreate,
		Validate.results,
		UserController.create);

	/** @api {patch} /
		* @apiName modify
		* @apiPermission user
		* @apiGroup user
		*/
	app.patch ('/api/v1/sales/user',
		Validate.userModify,
		Validate.results,
		UserController.modify);
};
