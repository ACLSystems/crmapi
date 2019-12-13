const Validate				= require('../middleware/validateAdmin');
const ValidateCP 			= require('../middleware/validatePostalCode');
const UsersController	= require('../controllers/usersController');
const PostalCodeController = require('../controllers/postalCodeController');

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

	/** @api {post} /
		* @apiName create
		* @apiPermission admin
		* @apiGroup postalCode
		*/
	app.post ('/api/v1/admin/cp/upsert',
		ValidateCP.create,
		ValidateCP.results,
		PostalCodeController.create);
};
