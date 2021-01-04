import * as NodeJSStream from 'stream';

import * as CastoeTransports from './Transports/index';

export declare namespace castoeStreamer {
  export import transports = Transports;
  
  let version: string;
  let author: string;
  let Transports: transports;
}