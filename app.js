/* eslint no-unused-vars: "error" */
const express 						= require('express');
const bodyParser 					= require('body-parser');
const StatusCodes 				= require('http-status-codes');
const helmet 							= require('helmet');
const bodyParserJsonError = require('./shared/validatejson');
//const cors 								= require('cors');
const db 									= require('./shared/db'); // eslint-disable-line no-unused-vars
const publicRoutes				= require('./routes/publicRoutes');
const orgRoutes 					= require('./routes/orgRoutes');
const userRoutes 					= require('./routes/userRoutes');
const adminRoutes 				= require('./routes/adminRoutes');
const grlRoutes 					= require('./routes/generalRoutes');
const opportunityRoutes		= require('./routes/opportunityRoutes');
const vendorRoutes 				= require('./routes/vendorRoutes');
const productRoutes 			= require('./routes/productRoutes');
const quoteRoutes					= require('./routes/quoteRoutes');
const app 								= express();

app.disable('x-powered-by');
// Encabezados CORS
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH, DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-type,Accept,Authorization');
	if (req.method == 'OPTIONS') {
		res.status(200).end();
	} else {
		next();
	}
});



// Encabezados de seguridad
app.use(helmet());
// Requerimos validar la solicitud
app.all	('/api/v1/*', [require('./middleware/validateRequest')]);
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParserJsonError());

publicRoutes(app);
orgRoutes(app);
userRoutes(app);
adminRoutes(app);
grlRoutes(app);
vendorRoutes(app);
productRoutes(app);
opportunityRoutes(app);
quoteRoutes(app);

// If no route is matched by now, it must be a 404
//app.use(function(req, res, next) {
app.use(function(req, res) {
	res.status(StatusCodes.NOT_FOUND).json({
		'message': `Error: API solicitada no existe: ${req.method} ${req.url}`
	});
});


module.exports = app;
