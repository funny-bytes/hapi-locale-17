const parser = require('accept-language-parser');
const matcher = require('rind-locale');
const pkg = require('../package.json');

const register = (server, {
  locales = [],
  fallback = locales[0],
  query = 'locale',
  param = 'locale',
  method = 'getLocale',
}) => {
  server.decorate('request', method, function f() {
    const request = this;
    try {
      const queryValue = query ? request.query[query] : false;
      if (queryValue) {
        return matcher({ locales })(queryValue) || fallback;
      }
      const paramValue = param ? request.params[param] : false;
      if (paramValue) {
        return matcher({ locales })(paramValue) || fallback;
      }
      const headerValue = request.headers['accept-language'];
      if (headerValue) {
        return parser.pick(locales, headerValue) || fallback;
      }
    } catch (err) {
      request.log(['err', 'error'], err);
    }
    return fallback;
  });
};

module.exports = { register, pkg };
