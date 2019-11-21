const Validate				= require('../middleware/validateAdmin');
const UsersController	= require('../controllers/usersController');

module.exports = (app) => {

	/** @api {get} /
		* @apiName roles
		* @apiPermission admin
		* @apiGroup users
		*/
	app.get ('/api/v1/admin/:username/roles',
		Validate.getRoles,
		Validate.results,
		UsersController.getRoles);

	/** @api {patch} /
		* @apiName roles
		* @apiPermission admin
		* @apiGroup users
		*/
	app.patch ('/api/v1/admin/:username/roles',
		Validate.setRoles,
		Validate.results,
		UsersController.setRoles);
};
