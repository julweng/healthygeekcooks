// production database
exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/test-healthygeekcooks';
// test database
exports.TEST_DATABASE_URL = (
	process.env.TEST_DATABASE_URL ||
	'mongodb://localhost/test-healthygeekcooks');
exports.PORT = process.env.PORT || 8080;
