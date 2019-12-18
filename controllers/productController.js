const StatusCodes = require('http-status-codes');
const Product = require('../src/products');
const Err = require('../controllers/err500_controller');

module.exports = {
	async create(req,res) {
		const key_user = res.locals.user;
		var productTemp = Object.assign({},req.body);
		productTemp.mod = [{
			by: `${key_user.person.name} ${key_user.person.fatherName}`,
			when: new Date(),
			what: 'Creación '
		}];
		const product = new Product(productTemp);
		try {
			const productExists = await Product.findOne({name: productTemp.name, vendor: productTemp.vendor});
			if(productExists) {
				res.status(StatusCodes.CONFLICT).json({
					'message': `Producto -${productTemp.name}- ya existe con el mismo fabricante`
				});
				return;
			}
			await product.save();
			res.status(StatusCodes.OK).json({
				'message': `Producto -${product.name}- creado correctamente`,
				'id': product._id
			});
		} catch (e) {
			Err.sendError(res,e,'ProductController', 'create -- Saving product--');
		}
	}, //create

	async modify(req,res) {
		const key_user = res.locals.user;
		var updates = Object.keys(req.body);
		const addToArray = req.body.add || false;
		if(updates.length === 0 ){
			return res.status(StatusCodes.BAD_REQUEST).json({
				'message': 'No hay nada que modificar'
			});
		}
		updates = updates.filter(item => item !== 'productid');
		updates = updates.filter(item => item !== 'mod');
		updates = updates.filter(item => item !== 'add');
		const allowedUpdates = [
			'name',
			'version',
			'description',
			'catLevel1',
			'catLevel2',
			'catLevel3',
			'vendor',
			'plan',
			'features',
			'addOn',
			'addOnGeneralDescription',
			'terms',
			'type',
			'isActive'
		];
		const allowedArrayAditions = [
			'plan',
			'features',
			'addOn',
			'terms'
		];
		const isValidOperation = updates.every(update => allowedUpdates.includes(update));
		const isValidAditionOperation = updates.every(update => allowedArrayAditions.includes(update));
		if(!isValidOperation) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				'message': 'Existen datos inválidos o no permitidos en el JSON proporcionado'
			});
		}
		try {
			var product = await Product.findById(req.body.productid);
			if(product) {
				if(addToArray && updates.length === 1 && isValidAditionOperation) {
					const key = updates[0];
					product[key].push(req.body[key]);
					product.mod.unshift({
						by: `${key_user.person.name} ${key_user.person.fatherName}`,
						when: new Date(),
						what: 'Adición ' + updates.join()
					});
				} else {
					product = Object.assign(product,req.body);
					product.mod.unshift({
						by: `${key_user.person.name} ${key_user.person.fatherName}`,
						when: new Date(),
						what: 'Modificación ' + updates.join()
					});
				}
			} else {
				res.status(StatusCodes.NOT_FOUND).json({
					'message': `Producto ${req.body.productid} no se encuentra`
				});
				return;
			}
			await product.save();
			res.status(StatusCodes.OK).json({
				'message': `Producto -${product.name}- actualizado`
			});
		} catch (e) {
			Err.sendError(res,e,'ProductController', 'modify -- Saving product--');
		}
	}, // modify

	async list(req,res) {
		var query = Object.assign({isActive:true},req.query);
		if(query.name) {
			query.name = {$regex: query.name, $options: 'i'};
		}
		try {
			var products = await Product.find(query)
				.select('-__v')
				.populate('vendor', 'name')
				.lean();
			if(products && Array.isArray(products) && products.length > 0) {
				products.forEach(item => {
					item.mod = item.mod.slice(0,5);
				});
				res.status(StatusCodes.OK).json(products);
			} else {
				res.status(StatusCodes.NOT_FOUND).json({
					'message': 'No hay productos que listar'
				});
			}
		} catch (e) {
			Err.sendError(res,e,'ProductController', 'list -- finding Products--');
		}
	}
};
