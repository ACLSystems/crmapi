const StatusCodes	= require('http-status-codes');
const Org 				= require('../src/orgs');
const User				= require('../src/users');
const Err 				= require('../controllers/err500_controller');


module.exports = {
	async tagsList(req,res) {
		var tags = [];
		try {
			const userTags = await User.find({}).select('tags');
			if(Array.isArray(userTags) && userTags.length > 0) {
				userTags.forEach(e => {
					if(Array.isArray(e.tags) && e.tags.length > 0) {
						e.tags.forEach(t => {
							if(!tags.includes(t.toLowerCase())) {
								tags.push(t.toLowerCase());
							}
						});
					}
				});
			}
			const orgTags = await Org.find({}).select('tags');
			if(Array.isArray(orgTags) && orgTags.length > 0) {
				orgTags.forEach(e => {
					if(Array.isArray(e.tags) && e.tags.length > 0) {
						e.tags.forEach(t => {
							if(!tags.includes(t.toLowerCase())) {
								tags.push(t.toLowerCase());
							}
						});
					}
				});
			}
			res.status(StatusCodes.OK).json(tags);
		} catch (e) {
			Err.sendError(res,e,'generalController','tagsList -- getting tags--');
		}
	}
};
