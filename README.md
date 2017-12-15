# hapi-locale-17

Locale and language detection for HAPI v17+.

Attaches locale information from accept-language http request header
or query parameter to request object in any hapi route.

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

await server.register({
  plugin: HapiLocale,
  options: {
    locales: ['de', 'en'], // supported locales
    fallback: 'en',        // defaults to locales[0]
    query: 'lang',         // defaults to 'locale'
    attribute: 'lang',     // defaults to 'locale'
  }
});
...
```
The selected locale is available as `request.lang` (defaults to `request.locale`) in any Hapi route handler.
