const StatusCodes = require('http-status-codes');
const Opportunity	= require('../src/opportunities');
const Currency 		= require('../src/currencies');
const Err					= require('../controllers/err500_controller');

module.exports = {
	async create(req,res) {
		const key_user = res.locals.user;
		var oppTemp = Object.assign({},req.body);
		oppTemp.owner = req.body.owner || key_user._id;
		oppTemp.date = req.body.date || new Date();
		oppTemp.mod = [{
			by: `${key_user.person.name} ${key_user.person.fatherName}`,
			when: new Date(),
			what: 'Creación '
		}];
		var opportunity = new Opportunity(oppTemp);
		try {
			await opportunity.save();
			res.status(StatusCodes.OK).json({
				'message': `Oportunidad ${opportunity.name} creada correctamente`,
				'id': opportunity._id
			});
		} catch (e) {
			Err.sendError(res,e,'OpportunityController', 'create -- Creating opportunity--');
		}
	}, //create

	async listCurrencies(req,res) {
		try {
			const currencies = await Currency.find({isActive:true})
				.populate('base', 'name symbol')
				.lean();
			if(currencies && Array.isArray(currencies) && currencies.length > 0) {
				res.status(StatusCodes.OK).json(currencies);
			} else {
				res.status(StatusCodes.NOT_FOUND).json({
					'message': 'No existen monedas'
				});
			}
		} catch (e) {
			Err.sendError(res,e,'OpportunityController', 'listCurrencies -- Finding Currencies--');
		}
	}, //listCurrencies

	async createCurrency(req,res) {
		const key_user = res.locals.user;
		var currTemp = Object.assign({},req.body);
		currTemp.mod = [{
			by: `${key_user.person.name} ${key_user.person.fatherName}`,
			when: new Date(),
			what: 'Creación '
		}];
		var currency = new Currency(currTemp);
		try {
			await currency.save();
			res.status(StatusCodes.OK).json({
				'message': `${currency.name} creada correctamente`,
				'id': currency._id
			});
		} catch (e) {
			Err.sendError(res,e,'OpportunityController', 'createCurrency -- Saving Currency--');
		}
	}, //createCurrency

	async updatePrice(req,res) {
		const key_user = res.locals.user;
		try {
			var currency = await Currency.findOne({_id: req.params.currency});
			var base = await Currency.findOne({_id:req.params.base});
			if(currency && base) {
				currency.price = req.params.price;
				currency.base = base._id;
				currency.mod.unshift({
					by: `${key_user.person.name} ${key_user.person.fatherName}`,
					when: new Date(),
					what: 'Actualización de precio'
				});
				await currency.save();
				res.status(StatusCodes.OK).json({
					'message': `Moneda ${currency.symbol} actualizada con respecto a ${base.symbol}`
				});
			} else {
				res.status(StatusCodes.NOT_FOUND).json({
					'message': 'No se localizó la moneda o la base a actualizar'
				});
			}

		} catch (e) {
			Err.sendError(res,e,'OpportunityController', 'updateCurrency -- Saving Currencies--');
		}
	}, //updatePrice

	async modifyCurrency(req,res) {
		const key_user = res.locals.user;
		try {
			var currency = await Currency.findById(req.body.currency);
			if(currency) {
				currency = Object.assign(currency,req.body);
				currency.mod.unshift({
					by: `${key_user.person.name} ${key_user.person.fatherName}`,
					when: new Date(),
					what: 'Modificación'
				});
			}
			await currency.save();
			res.status(StatusCodes.OK).json({
				'message': `Moneda ${currency.name} actualizada`
			});
		} catch (e) {
			Err.sendError(res,e,'OpportunityController', 'updateCurrency -- Saving Currencies--');
		}
	}, //modifyCurrency

	async modify(req,res) {
		const key_user = res.locals.user;
		var updates = Object.keys(req.body);
		const addToArray = req.body.add || false;
		if(updates.length === 0 ){
			return res.status(StatusCodes.BAD_REQUEST).json({
				'message': 'No hay nada que modificar'
			});
		}
		updates = updates.filter(item => item !== 'oppid');
		updates = updates.filter(item => item !== 'mod');
		updates = updates.filter(item => item !== 'number');
		const allowedUpdates = [
			'name',
			'status',
			'type',
			'closed',
			'mainCurrency',
			'backCurrency',
			'value',
			'probability',
			'date',
			'expectedCloseDate',
			'closeDate',
			'relatedUsers',
			'owner',
			'org'
		];
		const allowedArrayAditions = [
			'business',
			'opportunities',
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
			var opportunity = await Opportunity.findById(req.body.oppid);
			if(opportunity) {
				if(addToArray && updates.length === 1 && isValidAditionOperation) {
					const key = updates[0];
					opportunity[key].push(req.body[key]);
					opportunity.mod.unshift({
						by: `${key_user.person.name} ${key_user.person.fatherName}`,
						when: new Date(),
						what: 'Adición ' + updates.join()
					});
				} else {
					opportunity.mod.unshift({
						by: `${key_user.person.name} ${key_user.person.fatherName}`,
						when: new Date(),
						what: 'Modificación ' + updates.join()
					});
				}
			} else {
				res.status(StatusCodes.NOT_FOUND).json({
					'message': `Oportunidad ${req.body.oppid} no se encuentra`
				});
				return;
			}
			await opportunity.save();
			res.status(StatusCodes.OK).json({
				'message': `Oportunidad -${opportunity.name}- actualizada`
			});
		} catch (e) {
			Err.sendError(res,e,'OpportunityController', 'updateCurrency -- Saving Currencies--');
		}
	}, //modify

	async list(req,res) {
		const key_user = res.locals.user;
		var query = {};
		if(!key_user.roles.isSales) {
			query = {
				org: key_user.org._id
			};
		}
		try {
			const opportunities = await Opportunity.find(query)
				.select('-__v')
				.populate('org', 'name')
				.populate('owner', 'person')
				.populate('mainCurrency', 'name displayName symbol price')
				.populate('backCurrency', 'name displayName symbol price')
				.populate({
					path: 'product',
					select: 'name plan vendor',
					populate: {
						path: 'vendor',
						select: 'name',
						match: { isActive: true }
					}
				})
				.lean();
			if(opportunities && Array.isArray(opportunities) && opportunities.length > 0) {
				opportunities.forEach(item => {
					item.mod = item.mod.slice(0,5);
				});
				res.status(StatusCodes.OK).json(opportunities);
			}  else {
				res.status(StatusCodes.NOT_FOUND).json({
					'message': 'No hay oportunidades que listar'
				});
			}
		} catch (e) {
			Err.sendError(res,e,'OpportunityController', 'list -- finding Opportunityes--');
		}

	}

};
