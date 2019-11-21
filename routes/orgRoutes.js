const Validate				= require('../middleware/validateOrg');
// const UserController		= require('../controllers/user_controller'		);
const OrgsController	= require('../controllers/orgsController');

module.exports = (app) => {

	/** @api {post} /
		* @apiName create
		* @apiPermission admin
		* @apiGroup orgs
		*/
	app.post ('/api/v1/sales/org',
		Validate.orgCreate,
		Validate.results,
		OrgsController.create);
};
