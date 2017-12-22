[![build status](https://img.shields.io/travis/frankthelen/hapi-locale-17.svg)](http://travis-ci.org/frankthelen/hapi-locale-17)
[![Coverage Status](https://img.shields.io/coveralls/frankthelen/hapi-locale-17/dev.svg)](https://coveralls.io/r/frankthelen/hapi-locale-17)

# hapi-locale-17

Locale and language detection for Hapi Server v17.

Evaluates locale information from `accept-language` header and query or path parameter.
Decorates Hapi request object with `request.getLocale()` available in all route handlers.

Priority of evaluation:
(1) `locale` query parameter (if provided),
(2) `locale` path parameter (if provided),
(3) `accept-language` http request header,
(4) fallback locale (the first locale in `locales` list).

Decorated method `request.getLocale()` can be renamed.
Query and path parameters `locale` can be renamed or switched off.

## Install

```bash
npm install --save hapi-locale-17
```

## Usage

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

## Options

The plugin provides the following options:

| Option    | Default     | Description |
|-----------|-------------|-------------|
| `locales` | `[]`        | Your list of supported locales, e.g., `['de', 'en']` or `['en-US', 'es-ES']`. |
| `query`   | `locale`    | Name of query parameter to evaluate. Set to `false` to switch off. |
| `path`    | `locale`    | Name of path parameter to evaluate. Set to `false` to switch off. |
| `method`  | `getLocale` | Name of method for request decoration, i.e., `request.getLocale()`. |
