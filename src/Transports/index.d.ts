import * as Options from './Types';
import * as Transport from 'stream';

declare namespace castoeStreamer {
  interface CastoeConsole extends Transport {
    name: string;
    eol: string;
    
    new(options?: Options.CastoeConsoleOptions): CastoeConsole;

    send(input: any): CastoeConsole;
  }
  
  interface CastoeFile extends Transport {
    name: string;
    filename: string;
    dirname: string;
    options: object;
    maxsize: number | null;
    rotationFormat: Function | null;
    maxFiles: number;
    eol: string;
    tailable: boolean;
    
    new(options?: Options.CastoeFileOptions): CastoeFile;
  }
  
  interface CastoeStream extends Transport {
    eol: string;
    
    new(options?: Options.CastoeStreamOptions): CastoeStream;
  }
  
  interface Transports {
    CastoeConsole: CastoeConsole
    CastoeConsoleOptions: Options.CastoeConsoleOptions
    CastoeFile: CastoeFile
    CastoeFileOptions: Options.CastoeFileOptions
    CastoeStream: CastoeStream
    CastoeStreamOptions: Options.CastoeStreamOptions
  }
}

declare const castoeStreamer: castoeStreamer.Transports;
export = castoeStreamer;