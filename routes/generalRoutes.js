const GrlController = require('../controllers/generalControllers');

module.exports = (app) => {
	/** @api {get} /
		* @apiName taglist
		* @apiPermission sales
		* @apiGroup general
		*/
	app.get ('/api/v1/sales/tags',
		GrlController.tagsList);
};
