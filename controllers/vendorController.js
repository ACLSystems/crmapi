const StatusCodes = require('http-status-codes');
const Vendor 			= require('../src/vendors');
const Err 				= require('../controllers/err500_controller');

module.exports = {
	async create(req,res) {
		const key_user = res.locals.user;
		var vendor = new Vendor({
			name: req.body.name,
			isActive: true,
			mod: [generateMod(`${key_user.person.name} ${key_user.person.fatherName}`, 'Creación')]
		});
		try {
			await vendor.save();
			res.status(StatusCodes.OK).json({
				'message': `Fabricante ${vendor.name} creado correctamente`,
				'id': vendor._id
			});
		} catch (e) {
			Err.sendError(res,e,'VendorController', 'create -- Creating vendor--');
		}
	}, //create

	async modify(req,res) {
		const key_user = res.locals.user;
		var updates = Object.keys(req.body);
		if(updates.length === 0 ){
			return res.status(StatusCodes.BAD_REQUEST).json({
				'message': 'No hay nada que modificar'
			});
		}
		updates = updates.filter(item => item !== 'vendorid');
		updates = updates.filter(item => item !== 'mod');
		const allowedUpdates = [
			'name',
			'isActive'
		];
		const isValidOperation = updates.every(update => allowedUpdates.includes(update));
		if(!isValidOperation) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				'message': 'Existen datos inválidos o no permitidos en el JSON proporcionado'
			});
		}
		try {
			var vendor = await Vendor.findById(req.body.vendorid);
			if(vendor) {
				vendor = Object.assign(vendor,req.body);
				vendor.mod.push([generateMod(`${key_user.person.name} ${key_user.person.fatherName}`, 'Modificación')],);
			} else {
				res.status(StatusCodes.NOT_FOUND).json({
					'message': `Fabricante ${req.body.vendorid} no se encuentra`
				});
			}
			await vendor.save();
			res.status(StatusCodes.OK).json({
				'message': `Fabricante -${vendor.name}- actualizado`
			});
		} catch (e) {
			Err.sendError(res,e,'VendorController', 'modify -- Saving vendor--');
		}
	}, // modify

	async list(req,res) {
		try {
			const vendors = await Vendor.find({isActive:true})
				.select('-__v')
				.lean();
			if(vendors && Array.isArray(vendors) && vendors.length > 0) {
				res.status(StatusCodes.OK).json(vendors);
			} else {
				res.status(StatusCodes.NOT_FOUND).json({
					'message': 'No hay fabricantes que listar'
				});
			}
		} catch (e) {
			Err.sendError(res,e,'VendorController', 'list -- finding Vendors--');
		}
	}
};

function generateMod(who, desc) {
	// console.log(who);
	const date = new Date();
	return {by: who, when: date, what: desc};
}
