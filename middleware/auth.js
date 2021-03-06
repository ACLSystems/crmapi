const StatusCodes = require('http-status-codes');
//const jwt 				= require('jwt-simple');
const JWT = require('jsonwebtoken');
const Users 			= require('../src/users');
const Session			= require('../src/sessions');
const Time 				= require('../shared/time');
//const cache 			= require('../src/cache');
//const logger 			= require('../shared/winston-logger');
const version 		= require('../version/version');
const Err 				= require('../controllers/err500_controller');

/**
	* CONFIG
	* Todo se extrae de variables de Ambiente
	*/
/** @const {number} - Días de expiración
	* @default				- '7d'
*/
//const expires = parseInt(process.env.NODE_EXPIRES) || 7;
const expiresD = process.env.NODE_EXPIRES || '7d';
/** @const {string} - url de login */
const urlLogin = '/login';
/** @var {string} - Llaves públicas */
var privateKEY  = process.env.PRIV_KEY;
var publicKEY  = process.env.PUB_KEY;
const audience = process.env.SERVER_URI;
const issuer  = version.vendor;

if(!privateKEY || !publicKEY) {
	throw new Error('No hay llaves para generar tokens');
}

// Decodificamos las llaves... vienen en base64
var buff = Buffer.from(privateKEY,'base64');
privateKEY = buff.toString('utf-8');
buff = Buffer.from(publicKEY,'base64');
publicKEY = buff.toString('utf-8');

module.exports = {

	login(req, res) {

		var username = req.body.username || req.body.name || '';
		var password = req.body.password || '';

		if (username == '' || password == '') {
			res.status(StatusCodes.UNAUTHORIZED).json({
				'message': 'Error: Por favor, proporcione las credenciales para acceder'
			});
			return;
		}
		Users.findOne({$or: [{name: username},{'person.email': username}] })
			.populate([{
				path: 'orgUnit',
				select: 'name parent type longName',
				options: { lean: true }
			},{
				path: 'org',
				select: 'name longName',
				options: { lean: true }
			}])
			.then((user) => {
				if(!user) {
					res.status(StatusCodes.NOT_FOUND).json({
						'message': 'Error: el usuario o el password no son correctos'
					});
				} else {
					user.validatePassword(password, function(err, isOk) {
						if(isOk) {
							const payload = {
								admin: {
									isActive : user.admin.isActive,
									isVerified : user.admin.isVerified,
									isDataVerified : user.admin.isDataVerified
								},
								attachedToWShift: user.attachedToWShift,
								org: user.org,
								userid: user._id,
								person: user.person,
								orgUnit: user.orgUnit,
								preferences: user.preferences
							};
							const signOptions = {
								issuer,
								subject: user.name,
								audience,
								expiresIn: expiresD,
								algorithm: 'RS256'
							};
							const token = JWT.sign(payload, privateKEY, signOptions);
							const tokenDecoded = JWT.decode(token);
							var session = new Session({
								user: user._id,
								token,
								onlyDate: getToday(),
								date: new Date(),
								url: urlLogin
							});
							session.save()
								.then(() => {
									// cache.hmset('session:id:'+user._id,{
									// 	token,
									// 	url: urlLogin
									// });
									// cache.set('session:name:'+ user.name + ':' + user.orgUnit.name, 'session:id:'+user._id);
									// cache.expire('session:id:'+user._id,cache.ttlSessions);
									// cache.expire('session:name:'+ user.name + ':' + user.orgUnit.name,cache.ttlSessions);
									if(!user.admin.tokens || !Array.isArray(user.admin.tokens)){
										user.admin.tokens = [];
									}
									user.admin.tokens.push(token);
									user.save()
										.then(() => {
											res.status(StatusCodes.OK).json({
												token,
												iat: tokenDecoded.iat,
												exp: tokenDecoded.exp
											});
										}).catch((err) => {
											Err.sendError(res,err,'auth', 'login -- Saving user --');
										});
								})
								.catch((err) => {
									Err.sendError(res,err,'auth', 'login -- Saving session --');
								});

						} else {
							res.status(StatusCodes.UNAUTHORIZED).json({
								'message': 'Error: el usuario o el password no son correctos'
							});
						}
					});
				}
			})
			.catch((err) => {
				Err.sendError(res,err,'auth','login -- Finding User --');
			});
	}, //login

	logout(req,res) {
		Users.findOne({name: res.locals.user.name, 'admin.tokens': res.locals.token})
			.then(user => {
				if(user){
					user.admin.tokens = user.admin.tokens.filter(tok => {
						return tok !== res.locals.token;
					});
					user.save()
						.then(() => {
							res.status(StatusCodes.OK).json({
								'message': 'Se ha cerrado la sesión'
							});
						}).catch((err) => {
							Err.sendError(res,err,'auth','logout -- Finding User --');
						});
				} else {
					res.status(StatusCodes.NOT_FOUND).json({
						'message': 'Error: el usuario o la sesión no existen'
					});
				}
			})
			.catch((err) => {
				Err.sendError(res,err,'auth','logout -- Finding User --');
			});
	},

	logoutAll(req,res) {
		Users.findOne({name: res.locals.user.name, 'admin.tokens': res.locals.token})
			.then(user => {
				if(user){
					user.admin.tokens = [];
					user.save()
						.then(() => {
							res.status(StatusCodes.OK).json({
								'message': 'Se han cerrado todas las sesiones'
							});
						}).catch((err) => {
							Err.sendError(res,err,'auth','logout -- Finding User --');
						});
				} else {
					res.status(StatusCodes.NOT_FOUND).json({
						'message': 'Error: el usuario o la sesión no existen'
					});
				}
			})
			.catch((err) => {
				Err.sendError(res,err,'auth','logout -- Finding User --');
			});
	}
};

function getToday() {
	const now = new Date();
	let {date} = Time.displayLocalTime(now);
	return date;
}
