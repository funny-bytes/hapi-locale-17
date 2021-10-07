import { Plugin, Request } from '@hapi/hapi';

declare module '@hapi/hapi' {
  // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/hapi__hapi/index.d.ts#L97
  interface PluginSpecificConfiguration {
    'hapi-locale-17'?: hapilocale17.RouteOptions;
  }

  interface Request {
    getLocale: () => string;
  }
}

declare namespace hapilocale17 {

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

export = hapilocale17;
