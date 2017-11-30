// production database
exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/healthy-geek-cooks-app';
// test database
exports.TEST_DATABASE_URL = (
	process.env.TEST_DATABASE_URL ||
	'mongodb://localhost/healthy-geek-cooks-app');
exports.PORT = process.env.PORT || 8080;
