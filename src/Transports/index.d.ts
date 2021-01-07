import * as Options from './Types';
import * as Transport from 'stream';

declare namespace castoestreamer {
  interface CastoeConsole extends Transport {
    name: string;
    eol: string;
    
    new(options?: Options.CastoeConsoleOptions): CastoeConsole;

    send(input: any): CastoeConsole;
    
    clear(): CastoeConsole;
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

    send(input: any): CastoeFile;
    
    clone(file: string, clonedFile: string): CastoeFile;
    
    delete(): CastoeFile;
    
    close(callback: Function): CastoeFile;
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