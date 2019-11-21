const StatusCodes	= require('http-status-codes');
const Org 				= require('../src/orgs');
const Err 				= require('../controllers/err500_controller');

module.exports = {

	// crear ORG (crear cuenta)
	async create(req,res) {
		console.log(res.locals);
		const key_user = res.locals.user;
		var org = new Org({
			name: req.body.name,
			longName: req.body.longName,
			alias: req.body.alias && (typeof req.body.alias === 'string') ? JSON.parse(req.body.alias) : undefined,
			isActive: true,
			type: req.body.type ? req.body.type : 'customer',
			address: req.body.address ? req.body.address: {},
			social: req.body.social ? req.body.social: {},
			owner: key_user._id,
			phone: req.body.phone && (typeof req.body.phone === 'string') ? JSON.parse(req.body.phone) : undefined,
			email: req.body.email && (typeof req.body.email === 'string') ? JSON.parse(req.body.email) : undefined,
			emailDomain: req.body.emailDomain || undefined,
			tags: req.body.tags && (typeof req.body.tags === 'string') ? JSON.parse(req.body.tags) : undefined,
			mod: [generateMod(key_user.name,'Creación de cuenta')]
		});
		try {
			await org.save();
			res.status(StatusCodes.OK).json({
				'message': `${org.name} creada correctamente`
			});
		} catch (e) {
			Err.sendError(res,e,'orgsController', 'create -- Creating Org--');
		}
	} // create
};

function generateMod(by, desc) {
	const date = new Date();
	return {by: by, when: date, what: desc};
}
