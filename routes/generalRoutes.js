const GrlController = require('../controllers/generalControllers');
const PostalCodeController = require('../controllers/postalCodeController');
const ValidateCP 			= require('../middleware/validatePostalCode');

module.exports = (app) => {
	/** @api {get} /
		* @apiName taglist
		* @apiPermission sales
		* @apiGroup general
		*/
	app.get ('/api/v1/sales/tags',
		GrlController.tagsList);

	/** @api {get} /
		* @apiName searchCP
		* @apiPermission sales
		* @apiGroup general
		*/
	app.get ('/api/v1/sales/cp/:code',
		ValidateCP.search,
		ValidateCP.results,
		PostalCodeController.search);
};
