const Validate = require('../middleware/validateVendor');
const VendorController = require('../controllers/vendorController');

module.exports = (app) => {
	/** @api {post} /
		* @apiName create
		* @apiPermission sales
		* @apiGroup vendor
		*/
	app.post ('/api/v1/sales/vendor',
		Validate.create,
		Validate.results,
		VendorController.create);

	/** @api {patch} /
		* @apiName modify
		* @apiPermission sales
		* @apiGroup vendor
		*/
	app.patch ('/api/v1/sales/vendor',
		Validate.modify,
		Validate.results,
		VendorController.modify);

	/** @api {get} /
		* @apiName list
		* @apiPermission sales
		* @apiGroup vendors
		*/
	app.get ('/api/v1/sales/vendors',
		VendorController.list);
};
