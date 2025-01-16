# hapi-locale-17

Locale and language detection for Hapi Server.

![main workflow](https://github.com/funny-bytes/hapi-locale-17/actions/workflows/main.yml/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/funny-bytes/hapi-locale-17/badge.svg)](https://coveralls.io/github/funny-bytes/hapi-locale-17)
[![dependencies Status](https://david-dm.org/funny-bytes/hapi-locale-17/status.svg)](https://david-dm.org/funny-bytes/hapi-locale-17)
[![Maintainability](https://api.codeclimate.com/v1/badges/2b21f79b2657870c146f/maintainability)](https://codeclimate.com/github/funny-bytes/hapi-locale-17/maintainability)
[![node](https://img.shields.io/node/v/hapi-locale-17.svg)]()
[![code style](https://img.shields.io/badge/code_style-airbnb-brightgreen.svg)](https://github.com/airbnb/javascript)
[![License Status](http://img.shields.io/npm/l/hapi-locale-17.svg)]()

Evaluates locale information from `accept-language` header and query or path parameter.
Decorates Hapi request object with `request.getLocale()` available in all route handlers.

Priority of evaluation:
(1) `locale` query parameter (if provided),
(2) `locale` path parameter (if provided),
(3) `accept-language` http request header,
(4) fallback locale (the first locale in `locales` list).

Decorated method `request.getLocale()` can be renamed.
Query and path parameters `locale` can be renamed or switched off.

Tested with

* Hapi 20/21 on Node 22

## Install

```bash
npm install hapi-locale-17
```

## Usage

Register the plugin with Hapi server like this:

```js
const Hapi = require('@hapi/hapi');
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
