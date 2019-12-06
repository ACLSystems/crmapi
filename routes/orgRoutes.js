const Validate				= require('../middleware/validateOrg');
// const UserController		= require('../controllers/user_controller'		);
const OrgsController	= require('../controllers/orgsController');

module.exports = (app) => {

	/** @api {post} /
		* @apiName create
		* @apiPermission sales
		* @apiGroup orgs
		*/
	app.post ('/api/v1/sales/org',
		Validate.orgCreate,
		Validate.results,
		OrgsController.create);

	/** @api {post} /
		* @apiName createNote
		* @apiPermission sales
		* @apiGroup orgs
		*/
	app.post ('/api/v1/sales/orgnote',
		Validate.noteCreate,
		Validate.results,
		OrgsController.createNote);

	/** @api {get} /
		* @apiName list
		* @apiPermission sales
		* @apiGroup orgs
		*/
	app.get ('/api/v1/sales/orgs',
		OrgsController.list);

	/** @api {get} /
		* @apiName orgs
		* @apiPermission sales
		* @apiGroup orgs
		*/
	app.get ('/api/v1/sales/org/:orgid',
		Validate.getOrg,
		Validate.results,
		OrgsController.get);

	/** @api {patch} /
		* @apiName modify
		* @apiPermission sales
		* @apiGroup org
		*/
	app.patch ('/api/v1/sales/org',
		Validate.orgModify,
		Validate.results,
		OrgsController.modify);
};
