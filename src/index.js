const parser = require('accept-language-parser');
const matcher = require('rind-locale');
const pkg = require('../package.json');

const register = (server, {
  locales = [],
  query = 'locale',
  path = 'locale',
  method = 'getLocale',
}) => {
  let localesSupported = locales;
  // eslint-disable-next-line prefer-arrow-callback
  server.decorate('server', 'setLocales', function f(localesChange = []) {
    localesSupported = localesChange;
  });
  server.decorate('request', method, function f() {
    const fallback = localesSupported[0];
    const request = this;
    try {
      const queryValue = query ? request.query[query] : false;
      if (queryValue) {
        return matcher({ locales: localesSupported })(queryValue) || fallback;
      }
      const pathValue = path ? request.params[path] : false;
      if (pathValue) {
        return matcher({ locales: localesSupported })(pathValue) || fallback;
      }
      const headerValue = request.headers['accept-language'];
      if (headerValue) {
        return parser.pick(localesSupported, headerValue) || fallback;
      }
    } catch (error) {
      request.log(['error'], error);
    }
    return fallback;
  });
};

module.exports = { register, pkg };
