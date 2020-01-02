const StatusCodes = require('http-status-codes');
const Enum 				= require('../src/enums');
const Language		= require('../src/languages');
const Err 				= require('../controllers/err500_controller');

module.exports = {
	async createEnum(req,res){
		const key_user = res.locals.user;
		var enumObj = new Enum(Object.assign({},req.body));
		enumObj.log(key_user.person.name, key_user.person.fatherName,'Creación');
		try {
			var findEnum;
			if(enumObj.text) {
				findEnum = await Enum.findOne({
					schemaName: enumObj.schemaName,
					field: enumObj.field,
					language: enumObj.language,
					text: enumObj.text
				}).lean();
			} else if(enumObj.value || enumObj.value === 0) {
				findEnum = await Enum.findOne({
					schemaName: enumObj.schemaName,
					field: enumObj.field,
					language: enumObj.language,
					value: enumObj.value
				}).lean();
			}
			if(findEnum) {
				res.status(StatusCodes.CONFLICT).json({
					message: `Enum ${enumObj.schemaName} - ${enumObj.field} - ${enumObj.value} - ${enumObj.text} ya existe`,
					mod: findEnum.mod
				});
				return;
			}
			await enumObj.save();
			res.status(StatusCodes.OK).json({
				message: `Enum ${enumObj.schemaName} - ${enumObj.field} - ${enumObj.value} - ${enumObj.text} creado`
			});
		} catch (e) {
			Err.sendError(res,e,'adminController', 'create -- Creating Enum--');
		}
	}, // createEnum

	async getEnum(req,res) {
		const simplified = req.query.simplified ? true:false;
		if(simplified) {
			delete req.query.simplified;
		}
		var query = Object.assign({}, req.query);
		try {
			var enumResult = await Enum.find(query).sort({value:1});
			if(enumResult && Array.isArray(enumResult)) {
				if(simplified) {
					let enums = enumResult.map(e => e.text);
					res.status(StatusCodes.OK).json(enums);
				} else {
					res.status(StatusCodes.OK).json(enumResult);
				}
			}
		} catch (e) {
			Err.sendError(res,e,'adminController', 'list -- list Enum--');
		}
	}, //getEnum

	async modifyEnum(req,res) {
		const key_user = res.locals.user;
		var updates = Object.keys(req.body);

		if(updates.length === 0 ){
			return res.status(StatusCodes.BAD_REQUEST).json({
				'message': 'No hay nada que modificar'
			});
		}
		updates = updates.filter(item => item !== 'enumid');

		const allowedUpdates = [
			'schemaName',
			'field',
			'value',
			'text',
			'language'
		];
		const isValidOperation = updates.every(update => allowedUpdates.includes(update));
		if(!isValidOperation) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				'message': 'Existen datos inválidos o no permitidos en el JSON proporcionado'
			});
		}
		try {
			var enumObj = await Enum.findById(req.body['enumid'])
				.sort('field');
			if(enumObj) {
				enumObj = Object.assign(enumObj,req.body);
				enumObj.log(key_user.person.name,key_user.person.fatherName, 'Modificación');
				await enumObj.save();
				res.status(StatusCodes.OK).json({
					'message': 'Enum actualizado'
				});
			} else {
				res.status(StatusCodes.NOT_FOUND).json({
					'message': `Enum ${req.body.enumid} no se encuentra`
				});
				return;
			}

		} catch (e) {
			Err.sendError(res,e,'adminController', 'modify -- Modifying Enum--');
		}
	}, // modifyEnum

	async createLanguage(req,res){
		const key_user = res.locals.user;
		var language = new Language(Object.assign({},req.body));
		language.log(key_user.person.name, key_user.person.fatherName,'Creación');
		try {
			await language.save();
			res.status(StatusCodes.OK).json({
				message: `Lenguaje ${language.code } - ${language.name} creado`
			});
		} catch (e) {
			Err.sendError(res,e,'adminController', 'create -- Creating Language--');
		}
	}, // createEnum

	async getLanguages(req,res) {
		const simplified = req.query.simplified ? true:false;
		if(simplified) {
			delete req.query.simplified;
		}
		var query = Object.assign({}, req.query);
		try {
			var languages = await Language.find(query)
				.select('-__v');
			if(languages && Array.isArray(languages)) {
				if(simplified){
					let langs = languages.map(l => `${l.code} => ${l.name}`);
					res.status(StatusCodes.OK).json(langs);
				} else {
					res.status(StatusCodes.OK).json(languages);
				}

			}
		} catch (e) {
			Err.sendError(res,e,'adminController', 'list -- list Enum--');
		}
	}, //getLanguage

	async modifyLanguage(req,res) {
		const key_user = res.locals.user;
		var updates = Object.keys(req.body);

		if(updates.length === 0 ){
			return res.status(StatusCodes.BAD_REQUEST).json({
				'message': 'No hay nada que modificar'
			});
		}
		updates = updates.filter(item => item !== 'languageid');

		const allowedUpdates = [
			'code',
			'name',
			'default'
		];
		const isValidOperation = updates.every(update => allowedUpdates.includes(update));
		if(!isValidOperation) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				'message': 'Existen datos inválidos o no permitidos en el JSON proporcionado'
			});
		}
		try {
			var language = await Language.findById(req.body['languageid']);
			if(language) {
				language = Object.assign(language,req.body);
				language.log(key_user.person.name,key_user.person.fatherName, 'Modificación');
				await language.save();
				res.status(StatusCodes.OK).json({
					'message': `Language -${language.name}- actualizada`
				});
			} else {
				res.status(StatusCodes.NOT_FOUND).json({
					'message': `Lenguaje ${req.body.languageid} no se encuentra`
				});
				return;
			}

		} catch (e) {
			Err.sendError(res,e,'adminController', 'modify -- Saving Language--');
		}
	}, // modifyLanguage
};
