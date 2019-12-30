const StatusCodes = require('http-status-codes');
const Quote 			= require('../src/quotes');
const Err 				= require('../controllers/err500_controller');

module.exports = {
	async create(req,res) {
		const key_user = res.locals.user;
		const now = new Date();
		const thisYear = now.getFullYear();
		const thisMonth = now.getMonth();
		var quoteTemp = Object.assign({},req.body);
		if(!quoteTemp.owner) {
			quoteTemp.owner = key_user._id;
		}
		if(!quoteTemp.validDate) {
			quoteTemp.validDate = new Date(thisYear,thisMonth+1,0);
		}
		quoteTemp.mod = [{
			by: `${key_user.person.name} ${key_user.person.fatherName}`,
			when: new Date(),
			what: 'Creación '
		}];
		if(!quoteTemp.opportunities) {
			quoteTemp.opportunities = [];
		}
		const quote = new Quote(quoteTemp);
		try {
			await quote.save();
			const month = thisMonth + 1;
			const monthString = ('' + month).padStart(2,'0');
			const internalString = ('' + quote.numberInternal).padStart(3,'0');
			const quoteNumber = `${thisYear}${monthString}${internalString}`;
			quote.number = quoteNumber;
			await quote.save();
			res.status(StatusCodes.OK).json({
				'message': `Cotización -${quote.number}- creada correctamente`,
				'number': quote.number,
				'id': quote._id,
				'status': quote.status
			});
		} catch (e) {
			Err.sendError(res,e,'QuoteController', 'create -- Saving quote--');
		}
	}, // create

	async modify(req,res) {
		const key_user = res.locals.user;
		var updates = Object.keys(req.body);
		var addToArray = req.body.add || false;
		var popFromArray = req.body.pop || false;
		var shiftFromArray = req.body.shift || false;
		if(req.body.add) {
			addToArray = true;
			popFromArray = false;
			shiftFromArray = false;
		} else if(req.body.pop) {
			shiftFromArray = false;
		}

		if(updates.length === 0 ){
			return res.status(StatusCodes.BAD_REQUEST).json({
				'message': 'No hay nada que modificar'
			});
		}
		updates = updates.filter(item => item !== 'quoteid');
		updates = updates.filter(item => item !== 'mod');
		updates = updates.filter(item => item !== 'numberInternal');
		updates = updates.filter(item => item !== 'number');
		updates = updates.filter(item => item !== 'add');
		updates = updates.filter(item => item !== 'pop');
		updates = updates.filter(item => item !== 'shift');
		const allowedUpdates = [
			'validDate',
			'owner',
			'currency',
			'discount',
			'taxName',
			'tax',
			'terms',
			'version',
			'status',
			'business',
			'opportunities'
		];
		const allowedArrayOperations = [
			'business',
			'opportunities',
			'terms'
		];
		const isValidOperation = updates.every(update => allowedUpdates.includes(update));
		const isValidArrayOperation = updates.every(update => allowedArrayOperations.includes(update));
		if(!isValidOperation) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				'message': 'Existen datos inválidos o no permitidos en el JSON proporcionado'
			});
		}
		try {
			var quote = await Quote.findById(req.body.quoteid);
			if(quote) {
				if(addToArray && updates.length === 1 && isValidArrayOperation) {
					const key = updates[0];
					const elemExists = quote[key].find(elem => elem + '' === req.body[key] + '');
					if(elemExists){
						res.status(StatusCodes.CONFLICT).json({
							'message': 'Elemento ya existe'
						});
						return;
					}
					quote[key].push(req.body[key]);
					quote.mod.unshift({
						by: `${key_user.person.name} ${key_user.person.fatherName}`,
						when: new Date(),
						what: 'Adición ' + updates.join()
					});
					await quote.save();
					res.status(StatusCodes.OK).json({
						'message': `Cotización -${quote.number}- actualizada. Arreglo ${updates[0]} actualizado`
					});
				} else if(popFromArray && updates.length === 1 && isValidArrayOperation){
					const key = updates[0];
					let pop = quote[key].pop();
					quote.mod.unshift({
						by: `${key_user.person.name} ${key_user.person.fatherName}`,
						when: new Date(),
						what: 'Modificación remueve último ' + updates.join()
					});
					await quote.save();
					res.status(StatusCodes.OK).json({
						'message': `Cotización -${quote.number}- actualizada`,
						'pop': pop
					});
				} else if(shiftFromArray && updates.length === 1 && isValidArrayOperation){
					const key = updates[0];
					let shift = quote[key].shift();
					quote.mod.unshift({
						by: `${key_user.person.name} ${key_user.person.fatherName}`,
						when: new Date(),
						what: 'Modificación remueve primero ' + updates.join()
					});
					await quote.save();
					res.status(StatusCodes.OK).json({
						'message': `Cotización -${quote.number}- actualizada`,
						'shift': shift
					});
				} else {
					quote = Object.assign(quote,req.body);
					quote.mod.unshift({
						by: `${key_user.person.name} ${key_user.person.fatherName}`,
						when: new Date(),
						what: 'Modificación ' + updates.join()
					});
					await quote.save();
					res.status(StatusCodes.OK).json({
						'message': `Cotización -${quote.number}- actualizada`
					});
				}
			} else {
				res.status(StatusCodes.NOT_FOUND).json({
					'message': `Cotización ${req.body.quoteid} no se encuentra`
				});
				return;
			}

		} catch (e) {
			Err.sendError(res,e,'ProductController', 'modify -- Saving product--');
		}
	}, // modify

	async list(req,res) {
		var query = Object.assign({},req.query);
		if(query.dategte) {
			query.date = {$gte: new Date(query.dategte)};
			delete query.dategte;
			if(query.datelte) {
				query.date.$lte = new Date(query.datelte);
				delete query.datelte;
			}
		}
		if(query.datelte) {
			query.date = {$lte: new Date(query.datelte)};
			delete query.datelte;
		}
		try {
			const quotes = await Quote.find(query)
				.select('-__v')
				.populate('owner', 'person')
				.populate({
					path: 'opportunities',
					select: '-__v',
					populate: [{
						path: 'owner',
						select: 'person'
					},{
						path: 'product',
						select: '-__v'
					}
					]
				})
				.populate('customer','person')
				.populate('org', 'name longName type')
				.populate('customerOrg', 'name longName')
				.lean();
			if(quotes && Array.isArray(quotes) && quotes.length > 0) {
				quotes.forEach(item => {
					item.mod = item.mod.slice(0,5);
				});
				res.status(StatusCodes.OK).json(quotes);
			} else {
				res.status(StatusCodes.NOT_FOUND).json({
					'message': 'No hay cotizaciones que listar'
				});
			}
		} catch (e) {
			Err.sendError(res,e,'QuoteController', 'list -- finding Quotes--');
		}
	} //list
};
