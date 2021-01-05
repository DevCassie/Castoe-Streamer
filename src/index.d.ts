import * as CastoeTransports from './Transports/index';

declare namespace castoeStreamer {
  let Transports: CastoeTransports;
  
  let version: string;
  let author: string;
  let Transports: transports;
}

export = CastoeTransports;