
const mongoose 	= require( 'mongoose' );
//const bcrypt 		= require('bcrypt-nodejs'			);
const logger 		= require('../shared/winston-logger');
const newpass 	= require('../config/newpass'	); //eslint-disable-line
const Control 	= require('../src/control'					);
const Config 		= require('../src/config'					);
const Users 		= require('../src/users'						);
const Orgs 			= require('../src/orgs'						);
const OrgUnits 	= require('../src/orgUnits'				);

module.exports = {
	initDB(version){
		// revisamos si tenemos inicializada la base
		var message = 'Database uninitialized detected. Begining initialization...';
		Control.findOne({})
			.then((control) => {
				if(!control)  {  // No... no está inicializada.
					logger.info(message);
					console.log(message); //eslint-disable-line
					// Comenzamos inicializacion de la base si la base no tiene datos

					// Inicializacion de la organizacion "ACL Systems"

					const orgACL = new Orgs({
						name: 'acl',
						longName: 'ACL Systems S.A. de C.V.',
						alias: ['acl systems', 'ACL', 'ACL Systems'],
						isActive: true,
						type: ['internal','support'],
						mod: [{
							by: 'init',
							when: new Date(),
							what: 'Org creation'
						}]
					});

					orgACL.save().catch((err) => {
						message = 'Trying to save ACL org';
						logger.error(message);
						console.log(message); //eslint-disable-line
						logger.error(err);
						console.log(err); //eslint-disable-line
					});

					// Unidad Organizacional "ACL Systems"

					const ouACL = new OrgUnits({
						name: 'acl',
						longName: 'ACL Systems S.A. de C.V.',
						alias: ['acl systems', 'ACL', 'ACL Systems'],
						org: orgACL._id,
						parent: 'acl',
						type: 'org',
						isActive: true,
						mod: [{
							by: 'init',
							when: new Date(),
							what: 'Org Unit creation'
						}]
					});
					ouACL.save().catch((err) => {
						message = 'Trying to save ACL org unit';
						logger.error(message);
						console.log(message); //eslint-disable-line
						logger.error(err);
						console.log(err); //eslint-disable-line
					});

					// Creacion del usuario admin

					const admin = new Users({
						name: 'admin@aclsystems.mx',
						password: newpass.admin(),
						org: orgACL._id,
						orgUnit: ouACL._id,
						roles: {
							isAdmin: true,
							isSales: true
						},
						mod: [{
							by: 'init',
							when: new Date(),
							what: 'User creation'
						}],
						admin: {
							isActive: true,
							isVerified: true,
							recoverString: '',
							passwordSaved: 'saved'
						}
					});
					admin.save().catch((err) => {
						message = 'Trying to save admin user';
						logger.error(message);
						console.log(message); //eslint-disable-line
						logger.error(err);
						console.log(err); //eslint-disable-line
					});

					// terminamos la inicializacion con el registro de control
					const control = new Control({
						version: version.version,
						name: version.app,
						schemas: mongoose.modelNames()
					});
					var mongooseAdmin = new mongoose.mongo.Admin(mongoose.connection.db);
					mongooseAdmin.buildInfo()
						.then((info) => {
							control.mongo = info.version;
							control.save().catch((err) => {
								message = 'Trying to save control document';
								logger.error(message);
								console.log(message); //eslint-disable-line
								logger.error(err);
								console.log(err); //eslint-disable-line
							}).catch((err) => {
								logger.error(err);
								console.log(err); //eslint-disable-line
							});
						}).catch((err) => {
							logger.error(err);
							console.log(err); //eslint-disable-line
						});
					// Listo, terminamos de inicializar
					message = 'Database initialized...';
					logger.info(message);
					console.log(message); //eslint-disable-line
				} else { // Ya existe el registro de control
					control.version = version.version;
					control.name = version.app;
					control.schemas = mongoose.modelNames();
					var admin = new mongoose.mongo.Admin(mongoose.connection.db);
					admin.buildInfo()
						.then((info) => {
							control.mongo = info.version;
							control.host	= mongoose.connection.host;
							control.mongoose = mongoose.version;
							control.save().catch((err) => {
								message = 'Trying to save control document';
								logger.error(message);
								console.log(message); //eslint-disable-line
								logger.error(err);
								console.log(err); //eslint-disable-line
							});
						}).catch((err) => {
							logger.error(err);
							console.log(err); //eslint-disable-line
						});
				}
			}).catch((err) => {
				logger.error(err);
				console.log(err); //eslint-disable-line
			});
	},
	initConfig(){
		Config.findOne({})
			.then((config) => {
				if(!config){
					Config.create({
						fiscal: {
							priceList: {
								id: '',name: ''
							},
							seller: {
								id: '', name: '', identification: ''
							},
							term: {
								id: '', name: '', days: ''
							}
						},
						apiExternal: {
							uri: '', username: '', token: '', enabled: false
						}
					}).catch((err) => {
						logger.error(err);
						console.log(err); //eslint-disable-line
					});
				}
			}).catch((err) => {
				logger.error(err);
				console.log(err); //eslint-disable-line
			});
	}
};
