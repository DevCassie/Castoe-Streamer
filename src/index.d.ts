import * as CastoeTransports from './Transports/index';
import * as CastoeFunctions from './Functions/index';

declare namespace castoestreamer {
  let version: string;
  let author: string;

  let CastoeConsole: CastoeTransports.CastoeConsole;
  let CastoeFile: CastoeTransports.CastoeFile;
  let CastoeStream: CastoeTransports.CastoeStream;

  let Rename: CastoeFunctions.Rename
  let Delete: CastoeFunctions.Delete;
  let Clear: CastoeFunctions.Clear;
  let Clone: CastoeFunctions.Clone;
}

export = castoestreamer;