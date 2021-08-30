const parser = require('accept-language-parser'); // to be mocked
const semver = require('semver');
const locale = require('..');

const nodeVersion = process.version;
const hapiVersions = semver.satisfies(nodeVersion, '>=12.x.x')
  ? ['hapi18', 'hapi19', 'hapi20']
  : ['hapi18'];

hapiVersions.forEach((hapiVersion) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const Hapi = require(hapiVersion);

  describe(`${hapiVersion}`, () => {
    async function setup(options = {}) {
      const server = new Hapi.Server({
        port: 9001,
      });
      const route1 = {
        method: 'GET',
        path: '/test',
        handler: () => 'ok',
      };
      const route2 = {
        method: 'GET',
        path: '/media/{locale}',
        handler: () => 'ok',
      };
      const route3 = {
        method: 'GET',
        path: '/media2/{lang}',
        handler: () => 'ok',
      };
      await server.register({ plugin: locale, options });
      await server.route(route1);
      await server.route(route2);
      await server.route(route3);
      await server.start();
      return server;
    }

    describe('hapi-locale-17 with `locales` option', () => {
      let server;

      beforeEach(async () => {
        server = await setup({
          locales: ['es', 'de', 'en'],
        });
      });

      afterEach(async () => {
        await server.stop();
      });

      it('should provide `request.getLocale()` with supported `de`', async () => {
        const response = await server
          .inject({
            url: '/test',
            headers: {
              'Accept-Language': 'de-DE,de;q=0.9,en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
            },
          });
        const lcl = response.request.getLocale();
        expect(lcl).toEqual('de');
      });

      it('should provide `request.getLocale()` with supported `de` / query param', async () => {
        const response = await server
          .inject({
            url: '/test?locale=de',
            headers: {
              'Accept-Language': 'en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
            },
          });
        expect(response.request.getLocale()).toEqual('de');
      });

      it('should provide `request.getLocale()` with supported `de` / path param', async () => {
        const response = await server
          .inject({
            url: '/media/de',
            headers: {
              'Accept-Language': 'en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
            },
          });
        expect(response.request.getLocale()).toEqual('de');
      });

      it('should provide `request.getLocale()` with default `es` / query param with unsupported locale', async () => {
        const response = await server
          .inject({
            url: '/test?locale=tr',
            headers: {
              'Accept-Language': 'q=0.9,en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
            },
          });
        expect(response.request.getLocale()).toEqual('es');
      });

      it('should provide `request.getLocale()` with default `es` / path param with unsupported locale', async () => {
        const response = await server
          .inject({
            url: '/media/tr',
            headers: {
              'Accept-Language': 'q=0.9,en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
            },
          });
        expect(response.request.getLocale()).toEqual('es');
      });

      it('should provide `request.getLocale()` with default `es` / no indocation', async () => {
        const response = await server
          .inject({
            url: '/test',
          });
        expect(response.request.getLocale()).toEqual('es');
      });

      it('should provide `request.getLocale()` with default `es` / invalid header', async () => {
        const response = await server
          .inject({
            url: '/test',
            headers: {
              'Accept-Language': 'cq#brw/hdbjhfd,bkaq8ö?347r;z12lekw:vmcöar-fvic',
            },
          });
        expect(response.request.getLocale()).toEqual('es');
      });
    });

    describe('hapi-locale-17 with `method` option', () => {
      let server;

      beforeAll(async () => {
        server = await setup({
          locales: ['de', 'en'],
          method: 'getLang',
        });
      });

      afterAll(async () => {
        await server.stop();
      });

      it('should provide user-defined `request.getLang()`', async () => {
        const response = await server
          .inject({
            url: '/test',
            headers: {
              'Accept-Language': 'en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
            },
          });
        expect(response.request.getLang()).toEqual('en');
      });
    });

    describe('hapi-locale-17 with `query` option', () => {
      let server;

      beforeAll(async () => {
        server = await setup({
          locales: ['de', 'en'],
          query: 'lang',
          path: false,
          method: 'getLang',
        });
      });

      afterAll(async () => {
        await server.stop();
      });

      it('should accept user-defined query param `lang`', async () => {
        const response = await server
          .inject({
            url: '/test?lang=de',
            headers: {
              'Accept-Language': 'en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
            },
          });
        expect(response.request.getLang()).toEqual('de');
      });
    });

    describe('hapi-locale-17 with `path` option', () => {
      let server;

      beforeAll(async () => {
        server = await setup({
          locales: ['de', 'en'],
          query: false,
          path: 'lang',
          method: 'getLang',
        });
      });

      afterAll(async () => {
        await server.stop();
      });

      it('should accept user-defined path param `lang`', async () => {
        const response = await server
          .inject({
            url: '/media2/de',
            headers: {
              'Accept-Language': 'en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
            },
          });
        expect(response.request.getLang()).toEqual('de');
      });
    });

    describe('hapi-locale-17 with locale option `en-US`', () => {
      let server;

      beforeAll(async () => {
        server = await setup({
          locales: ['en-US', 'es'],
        });
      });

      afterAll(async () => {
        await server.stop();
      });

      it('should accept locale `en-US`', async () => {
        const response = await server
          .inject({
            url: '/test',
            headers: {
              'Accept-Language': 'en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
            },
          });
        expect(response.request.getLocale()).toEqual('en-US');
      });

      it('should accept locale `en-US` / query param', async () => {
        const response = await server
          .inject({
            url: '/test?locale=en',
            headers: {
              'Accept-Language': 'es-ES,es;q=0.9,en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
            },
          });
        expect(response.request.getLocale()).toEqual('en-US');
      });
    });

    describe('hapi-locale-17 with error thrown by `accept-language-parser`', () => {
      let server;

      beforeAll(async () => {
        server = await setup({
          locales: ['en', 'es'],
        });
        jest.spyOn(parser, 'pick').mockImplementation(() => {
          throw new Error('Error');
        });
      });

      afterAll(async () => {
        await server.stop();
        parser.pick.mockRestore();
      });

      it('should not fail and return default locale', async () => {
        const response = await server
          .inject({
            url: '/test',
            headers: {
              'Accept-Language': 'en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
            },
          });
        expect(response.request.getLocale()).toEqual('en');
      });
    });
  });
});
