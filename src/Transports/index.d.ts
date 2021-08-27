import * as Options from './Types';
import * as Transport from 'stream';

declare namespace castoestreamer {
  interface CastoeConsole extends Transport {
    name?: string;
    eol: string;
    
    new(options?: Options.CastoeConsoleOptions): CastoeConsole;
    send(input: any): CastoeConsole;
    info(input: any): CastoeConsole;
    debug(input: any, referer: string): CastoeConsole;
    warn(input: any): CastoeConsole;
    error(input: any, name: string): CastoeConsole;
    clear(): CastoeConsole;
    createGzip(): CastoeConsole;
  }
  
  interface CastoeFile extends Transport {
    file: string;
    dirname?: string;
    automatic?: boolean;
    overwrite?: boolean;
    options: Options.CastoeFileStreamOptions;
    eol: string;
    
    new(options?: Options.CastoeFileOptions): CastoeFile;
    send(input: string): CastoeFile;
    clone(clonedFile: string): CastoeFile;
    delete(): CastoeFile;
    read(callback: Function): CastoeFile;
    createGzip(): CastoeFile;
  }
  
  interface CastoeStream extends Transport {
    eol: string;
    
    new(options?: Options.CastoeStreamOptions): CastoeStream;
    send(input: Object): CastoeStream;
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

declare const castoestreamer: castoestreamer.Transports;
export = castoestreamer;