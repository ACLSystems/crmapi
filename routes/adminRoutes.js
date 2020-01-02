const Validate				= require('../middleware/validateAdmin');
const ValidateCP 			= require('../middleware/validatePostalCode');
const AdminController = require('../controllers/admin_controller');
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

	/** @api {post} /
		* @apiName create
		* @apiPermission admin
		* @apiGroup language
		*/
	app.post ('/api/v1/admin/language',
		Validate.createLanguage,
		Validate.results,
		AdminController.createLanguage);

	/** @api {get} /
		* @apiName get
		* @apiPermission admin
		* @apiGroup language
		*/
	app.get ('/api/v1/admin/languages',
		AdminController.getLanguages);

	/** @api {patch} /
		* @apiName patch
		* @apiPermission admin
		* @apiGroup language
		*/
	app.patch ('/api/v1/admin/language',
		Validate.modifyLanguage,
		Validate.results,
		AdminController.modifyLanguage);

	/** @api {post} /
		* @apiName create
		* @apiPermission admin
		* @apiGroup enum
		*/
	app.post ('/api/v1/admin/enum',
		Validate.createEnum,
		Validate.results,
		AdminController.createEnum);

	/** @api {get} /
		* @apiName get
		* @apiPermission admin
		* @apiGroup enum
		*/
	app.get ('/api/v1/admin/enums',
		Validate.getEnums,
		Validate.results,
		AdminController.getEnum);

	/** @api {patch} /
		* @apiName patch
		* @apiPermission admin
		* @apiGroup enum
		*/
	app.patch ('/api/v1/admin/enum',
		Validate.modifyEnum,
		Validate.results,
		AdminController.modifyEnum);
};
