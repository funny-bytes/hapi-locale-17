# hapi-locale-17

Locale and language detection for Hapi Server v17.

Evaluates locale information from `accept-language` header and query parameter
and decorates Hapi request object with `request.getLocale()`
available in all route handlers.

If a `locale` query parameter is provided, it has highest priority.
Second priority is the `accept-language` http request header.
Final priority is a fallback locale.

Method `request.getLocale()` and query parameter `locale` can be renamed.

## Install

```bash
npm install --save hapi-locale-17
```

## Example

Register the plugin with Hapi server like this:

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
      method: 'getLang',     // name of method, defaults to 'getLocale'
    }
  });
  await server.start();
};

provision();
```

In your route handler, do something like this:

```js
server.route({
  method: 'GET',
  path: '/test',
  handler: function (request, h) {
    const locale = request.getLocale();
    // ...
  }
});
```
