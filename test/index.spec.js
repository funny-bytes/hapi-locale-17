const Hapi = require('hapi');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const locale = require('../src/index');

chai.use(chaiAsPromised);

global.chai = chai;
global.expect = chai.expect;
global.should = chai.should();

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

describe('hapi-locale-17 with `locales` option', async () => {
  let server;

  beforeEach(async () => {
    server = await setup({
      locales: ['es', 'de', 'en'],
    });
  });

  afterEach(async () => {
    server.stop();
  });

  it('should provide `request.getLocale()` with supported `de`', () => {
    return server
      .inject({
        url: '/test',
        headers: {
          'Accept-Language': 'de-DE,de;q=0.9,en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
        },
      })
      .should.be.fulfilled.then((response) => {
        expect(response.request.getLocale()).to.be.equal('de');
      });
  });

  it('should provide `request.getLocale()` with supported `de` / query param', () => {
    return server
      .inject({
        url: '/test?locale=de',
        headers: {
          'Accept-Language': 'en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
        },
      })
      .should.be.fulfilled.then((response) => {
        expect(response.request.getLocale()).to.be.equal('de');
      });
  });

  it('should provide `request.getLocale()` with supported `de` / path param', () => {
    return server
      .inject({
        url: '/media/de',
        headers: {
          'Accept-Language': 'en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
        },
      })
      .should.be.fulfilled.then((response) => {
        expect(response.request.getLocale()).to.be.equal('de');
      });
  });

  it('should provide `request.getLocale()` with default `es` / query param with unsupported locale', () => {
    return server
      .inject({
        url: '/test?locale=tr',
        headers: {
          'Accept-Language': 'q=0.9,en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
        },
      })
      .should.be.fulfilled.then((response) => {
        expect(response.request.getLocale()).to.be.equal('es');
      });
  });

  it('should provide `request.getLocale()` with default `es` / path param with unsupported locale', () => {
    return server
      .inject({
        url: '/media/tr',
        headers: {
          'Accept-Language': 'q=0.9,en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
        },
      })
      .should.be.fulfilled.then((response) => {
        expect(response.request.getLocale()).to.be.equal('es');
      });
  });
});

describe('hapi-locale-17 with `method` option', async () => {
  let server;

  before(async () => {
    server = await setup({
      locales: ['de', 'en'],
      method: 'getLang',
    });
  });

  after(async () => {
    server.stop();
  });

  it('should provide user-defined `request.getLang()`', () => {
    return server
      .inject({
        url: '/test',
        headers: {
          'Accept-Language': 'en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
        },
      })
      .should.be.fulfilled.then((response) => {
        expect(response.request.getLang()).to.be.equal('en');
      });
  });
});

describe('hapi-locale-17 with `query` option', async () => {
  let server;

  before(async () => {
    server = await setup({
      locales: ['de', 'en'],
      query: 'lang',
      path: false,
      method: 'getLang',
    });
  });

  after(async () => {
    server.stop();
  });

  it('should accept user-defined query param `lang`', () => {
    return server
      .inject({
        url: '/test?lang=de',
        headers: {
          'Accept-Language': 'en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
        },
      })
      .should.be.fulfilled.then((response) => {
        expect(response.request.getLang()).to.be.equal('de');
      });
  });
});

describe('hapi-locale-17 with `path` option', async () => {
  let server;

  before(async () => {
    server = await setup({
      locales: ['de', 'en'],
      query: false,
      path: 'lang',
      method: 'getLang',
    });
  });

  after(async () => {
    server.stop();
  });

  it('should accept user-defined path param `lang`', () => {
    return server
      .inject({
        url: '/media2/de',
        headers: {
          'Accept-Language': 'en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
        },
      })
      .should.be.fulfilled.then((response) => {
        expect(response.request.getLang()).to.be.equal('de');
      });
  });
});

describe('hapi-locale-17 with locale option `en-US`', async () => {
  let server;

  before(async () => {
    server = await setup({
      locales: ['en-US', 'es'],
    });
  });

  after(async () => {
    server.stop();
  });

  it('should accept locale `en-US`', () => {
    return server
      .inject({
        url: '/test',
        headers: {
          'Accept-Language': 'en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
        },
      })
      .should.be.fulfilled.then((response) => {
        expect(response.request.getLocale()).to.be.equal('en-US');
      });
  });

  it('should accept locale `en-US` / query param', () => {
    return server
      .inject({
        url: '/test?locale=en',
        headers: {
          'Accept-Language': 'es-ES,es;q=0.9,en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
        },
      })
      .should.be.fulfilled.then((response) => {
        expect(response.request.getLocale()).to.be.equal('en-US');
      });
  });
});
