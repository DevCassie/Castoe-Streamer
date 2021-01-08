import * as CastoeTransports from './Transports/index';
import * as CastoeFunctions from './Functions/index';

namespace castoestreamer {
  let version: string;
  let author: string;

  let CastoeConsole: CastoeTransports.CastoeConsole;
  // let CastoeFile: CastoeTransports.CastoeFile;
  let CastoeStream: CastoeTransports.CastoeStream;
  
  let Clone: CastoeFunctions.Clone;
  let Clear: CastoeFunctions.Clear;
  let Delete: CastoeFunctions.Delete;
  let Rename: CastoeFunctions.Rename;  
  
}

export = castoestreamer;