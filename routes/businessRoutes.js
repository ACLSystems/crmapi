const Validate 						= require('../middleware/validateBusiness');
const BusinessController	= require('../controllers/businessController');

module.exports = (app) => {
	/** @api {post} /
		* @apiName create
		* @apiPermission admin
		* @apiGroup currencies
		*/
	app.post ('/api/v1/admin/currency',
		Validate.currencyCreate,
		Validate.results,
		BusinessController.createCurrency);

	/** @api {post} /
		* @apiName create
		* @apiPermission admin
		* @apiGroup businesses
		*/
	app.post ('/api/v1/sales/business',
		Validate.create,
		Validate.results,
		BusinessController.create);

	/** @api {get} /
		* @apiName listCurrencies
		* @apiPermission sales
		* @apiGroup currencies
		*/
	app.get ('/api/v1/sales/currencies',
		BusinessController.listCurrencies);

	/** @api {get} /
		* @apiName list
		* @apiPermission sales
		* @apiGroup businesses
		*/
	app.get ('/api/v1/sales/businesses',
		BusinessController.list);

	/** @api {patch} /
		* @apiName modifyCurrency
		* @apiPermission admin
		* @apiGroup currencies
		*/
	app.patch ('/api/v1/admin/currency',
		Validate.modifyCurrency,
		Validate.results,
		BusinessController.modifyCurrency);

	/** @api {patch} /
		* @apiName updatePrice
		* @apiPermission admin
		* @apiGroup currencies
		*/
	app.patch ('/api/v1/admin/currency/:base/:currency/:price',
		Validate.updatePrice,
		Validate.results,
		BusinessController.updatePrice);

	/** @api {patch} /
		* @apiName modify
		* @apiPermission sales
		* @apiGroup businesses
		*/
	app.patch ('/api/v1/sales/business',
		Validate.modify,
		Validate.results,
		BusinessController.modify);
};
