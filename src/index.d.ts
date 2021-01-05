import * as CastoeTransports from './Transports/index';

namespace CastoeStreamer {
  let version: string;
  let author: string;

  let CastoeConsole: CastoeTransports.CastoeConsole;
  let CastoeFile: CastoeTransports.CastoeFile;
  let CastoeStream: CastoeTransports.CastoeStream;
}

export = CastoeStreamer;