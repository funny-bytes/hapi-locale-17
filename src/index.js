const parser = require('accept-language-parser');
const matcher = require('rind-locale');
const pkg = require('../package.json');

const register = (server, {
  locales = [], fallback = locales[0], query = 'locale', method = 'getLocale',
}) => {
  server.decorate('request', method, function f() {
    const request = this;
    // 1. query parameter
    const queryParam = request.query[query];
    if (queryParam) {
      return matcher({ locales })(queryParam) || fallback;
    }
    // 2. http header
    const acceptLanguage = request.headers['accept-language'];
    if (acceptLanguage) {
      return parser.pick(locales, acceptLanguage) || fallback;
    }
    // 3. fallback
    return fallback;
  });
};

module.exports = { register, pkg };
