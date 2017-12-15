const Hapi = require('hapi');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const locale = require('../src/index');

chai.use(chaiAsPromised);
chai.use(sinonChai);

global.chai = chai;
global.sinon = sinon;
global.expect = chai.expect;
global.should = chai.should();

async function setup(options = {}) {
  const server = new Hapi.Server({
    port: 9001,
  });
  const test = {
    method: 'GET',
    path: '/test',
    handler: () => 'ok',
  };
  await server.register({ plugin: locale, options });
  await server.route(test);
  await server.start();
  return server;
}

describe('hapi-locale-17 with default options', async () => {
  let server;

  before(async () => {
    server = await setup();
  });

  after(async () => {
    server.stop();
  });

  it('should add `locale` to request with default `en`', () => {
    return server
      .inject({
        url: '/test',
        headers: {
          'Accept-Language': 'de-DE,de;q=0.9,en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
        },
      })
      .should.be.fulfilled.then((response) => {
        expect(response.request.locale).to.be.equal('en');
      });
  });

  it('should add `locale` to request with default `en` / query param with unsupported value', () => {
    return server
      .inject({
        url: '/test?locale=de',
        headers: {
          'Accept-Language': 'de-DE,de;q=0.9,en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
        },
      })
      .should.be.fulfilled.then((response) => {
        expect(response.request.locale).to.be.equal('en');
      });
  });
});

describe('hapi-locale-17 with `locales` option', async () => {
  let server;

  before(async () => {
    server = await setup({
      locales: ['de', 'en']
    });
  });

  after(async () => {
    server.stop();
  });

  it('should add `locale` to request with supported `de`', () => {
    return server
      .inject({
        url: '/test',
        headers: {
          'Accept-Language': 'de-DE,de;q=0.9,en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
        },
      })
      .should.be.fulfilled.then((response) => {
        expect(response.request.locale).to.be.equal('de');
      });
  });

  it('should add `locale` to request with supported `de` / query param', () => {
    return server
      .inject({
        url: '/test?locale=de',
        headers: {
          'Accept-Language': 'en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
        },
      })
      .should.be.fulfilled.then((response) => {
        expect(response.request.locale).to.be.equal('de');
      });
  });
});

describe('hapi-locale-17 with `attribute` option', async () => {
  let server;

  before(async () => {
    server = await setup({
      locales: ['de', 'en'],
      attribute: 'lang',
    });
  });

  after(async () => {
    server.stop();
  });

  it('should add user-defined attribute', () => {
    return server
      .inject({
        url: '/test',
        headers: {
          'Accept-Language': 'en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
        },
      })
      .should.be.fulfilled.then((response) => {
        expect(response.request.lang).to.be.equal('en');
        expect(response.request.locale).to.be.undefined;
      });
  });
});

describe('hapi-locale-17 with `query` option', async () => {
  let server;

  before(async () => {
    server = await setup({
      locales: ['de', 'en'],
      query: 'lang',
      attribute: 'lang',
    });
  });

  after(async () => {
    server.stop();
  });

  it('should accept user-defined query param', () => {
    return server
      .inject({
        url: '/test?lang=de',
        headers: {
          'Accept-Language': 'en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
        },
      })
      .should.be.fulfilled.then((response) => {
        expect(response.request.lang).to.be.equal('de');
      });
  });
});
