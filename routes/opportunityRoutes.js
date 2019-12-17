const Validate 						= require('../middleware/validateOpportunity');
const OpportunityController	= require('../controllers/OpportunitiesController');

module.exports = (app) => {
	/** @api {post} /
		* @apiName create
		* @apiPermission admin
		* @apiGroup currencies
		*/
	app.post ('/api/v1/admin/currency',
		Validate.currencyCreate,
		Validate.results,
		OpportunityController.createCurrency);

	/** @api {post} /
		* @apiName create
		* @apiPermission admin
		* @apiGroup businesses
		*/
	app.post ('/api/v1/sales/opportunity',
		Validate.create,
		Validate.results,
		OpportunityController.create);

	/** @api {get} /
		* @apiName listCurrencies
		* @apiPermission sales
		* @apiGroup currencies
		*/
	app.get ('/api/v1/sales/currencies',
		OpportunityController.listCurrencies);

	/** @api {get} /
		* @apiName list
		* @apiPermission sales
		* @apiGroup businesses
		*/
	app.get ('/api/v1/sales/opportunities',
		OpportunityController.list);

	/** @api {patch} /
		* @apiName modifyCurrency
		* @apiPermission admin
		* @apiGroup currencies
		*/
	app.patch ('/api/v1/admin/currency',
		Validate.modifyCurrency,
		Validate.results,
		OpportunityController.modifyCurrency);

	/** @api {patch} /
		* @apiName updatePrice
		* @apiPermission admin
		* @apiGroup currencies
		*/
	app.patch ('/api/v1/admin/currency/:base/:currency/:price',
		Validate.updatePrice,
		Validate.results,
		OpportunityController.updatePrice);

	/** @api {patch} /
		* @apiName modify
		* @apiPermission sales
		* @apiGroup businesses
		*/
	app.patch ('/api/v1/sales/opportunity',
		Validate.modify,
		Validate.results,
		OpportunityController.modify);
};
