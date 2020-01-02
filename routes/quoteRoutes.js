const Validate = require('../middleware/validateQuote');
const QuoteController = require('../controllers/quoteController');

module.exports = (app) => {
	/** @api {post} /
		* @apiName create
		* @apiPermission sales
		* @apiGroup quote
		*/
	app.post ('/api/v1/sales/quote',
		Validate.create,
		Validate.results,
		QuoteController.create);

	/** @api {patch} /
		* @apiName modify
		* @apiPermission sales
		* @apiGroup quote
		*/
	app.patch ('/api/v1/sales/quote',
		Validate.modify,
		Validate.results,
		QuoteController.modify);

	/** @api {get} /
		* @apiName get
		* @apiPermission sales
		* @apiGroup quote
		*/
	app.get ('/api/v1/sales/quotes',
		Validate.list,
		Validate.results,
		QuoteController.list);

	/** @api {get} /
		* @apiName list
		* @apiPermission sales
		* @apiGroup quote
		*/
	app.get ('/api/v1/sales/quote/:quoteid',
		Validate.get,
		Validate.results,
		QuoteController.get);
};
