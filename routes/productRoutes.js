const Validate = require('../middleware/validateProduct');
const ProductController = require('../controllers/productController');

module.exports = (app) => {
	/** @api {post} /
		* @apiName create
		* @apiPermission sales
		* @apiGroup product
		*/
	app.post ('/api/v1/sales/product',
		Validate.create,
		Validate.results,
		ProductController.create);

	/** @api {patch} /
		* @apiName modify
		* @apiPermission sales
		* @apiGroup vendor
		*/
	app.patch ('/api/v1/sales/product',
		Validate.modify,
		Validate.results,
		ProductController.modify);

	/** @api {get} /
		* @apiName list
		* @apiPermission sales
		* @apiGroup vendors
		*/
	app.get ('/api/v1/sales/products',
		ProductController.list);
};
