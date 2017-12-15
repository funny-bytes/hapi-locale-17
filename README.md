# hapi-locale-17

Locale and language detection for Hapi Server v17.

Evaluates locale information from `accept-language` query parameter and attaches locale to `request.locale` available in all Hapi route handlers.

If a `locale` query parameter is privided, it has highest priority. Second priority is the `accept-language` http request parameter. Final priority is a fallback locale.

Target attribute `request.locale` and query parameter `locale` are configurable.

## Install

```bash
npm install --save hapi-locale-17
```

## Example

```js
const Hapi = require('hapi');
const HapiLocale = require('hapi-locale-17');

const server = new Hapi.Server({
  port: 3000,
});

const provision = async () => {
  await server.register({
    plugin: HapiLocale,
    options: {
      locales: ['de', 'en'], // your supported locales
      query: 'lang',         // name of query param, defaults to 'locale'
      attribute: 'lang',     // name of target attribute, defaults to 'locale'
    }
  });
  await server.start();
};

provision();
```
