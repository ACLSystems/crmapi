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
		* @apiPermission sales
		* @apiGroup user
		*/
	app.patch ('/api/v1/sales/user',
		Validate.userModify,
		Validate.results,
		UserController.modify);

	/** @api {post} /
		* @apiName createNote
		* @apiPermission sales
		* @apiGroup user
		*/
	app.post ('/api/v1/sales/usernote',
		Validate.noteCreate,
		Validate.results,
		UserController.createNote);

	/** @api {get} /
		* @apiName owners
		* @apiPermission sales
		* @apiGroup user
		*/
	app.get ('/api/v1/sales/owners',
		UserController.owners);

	/** @api {get} /
		* @apiName users
		* @apiPermission sales
		* @apiGroup user
		*/
	app.get ('/api/v1/sales/users',
		UserController.list);

	/** @api {get} /
		* @apiName user
		* @apiPermission sales
		* @apiGroup user
		*/
	app.get ('/api/v1/sales/user/:userid',
		Validate.getUser,
		Validate.results,
		UserController.get);
};
