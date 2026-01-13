import { Plugin, Request } from '@hapi/hapi';

declare module '@hapi/hapi' {
  interface PluginSpecificConfiguration {
    'hapi-locale-17'?: hapilocale17.RouteOptions;
  }
  interface Request {
    getLocale(): string;
  }
  interface Server {
    setLocales(locales: string[]): void;
  }
}

export namespace hapilocale17 {

  interface RegisterOptions {
    locales?: string[];
    query?: string;
    path?: string;
  }

  interface RouteOptions {
    // nothing special yet
  }

}

// eslint-disable-next-line @typescript-eslint/no-redeclare
declare const hapilocale17: Plugin<hapilocale17.RegisterOptions>;

export default hapilocale17;
