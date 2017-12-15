const parser = require('accept-language-parser');
const pkg = require('../package.json');

const register = (server, {
  locales = ['en'], fallback = locales[0], query = 'locale', attribute = 'locale',
}) => {
  server.ext({
    type: 'onRequest',
    method: (request, h) => {
      const setLocale = (value) => {
        request[attribute] = value;
      };
      // 1. query parameter
      const queryLocale = request.query[query];
      if (queryLocale && locales.includes(queryLocale)) {
        setLocale(queryLocale);
        return h.continue;
      }
      // 2. http header
      const acceptLanguage = request.headers['accept-language'];
      if (acceptLanguage) {
        setLocale(parser.pick(locales, acceptLanguage) || fallback);
        return h.continue;
      }
      // 3. fallback
      setLocale(fallback);
      return h.continue;
    },
  });
};

module.exports = { register, pkg };
