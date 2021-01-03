import * as NodeJSStream from 'stream';

declare namespace CastoeStreamer {
  interface CastoeConsoleOptions {
    name: String,
    date: String,
    traceFile: Boolean,
    showType: Boolean,
    colors: CastoeConsoleColorOptions
  }
  
  interface CastoeConsoleColorOptions {
    bigint: String,
    boolean: String,
    function: String,
    number: String,
    object: String,
    string: String,
    symbol: String
  }
  
  interface sendMethod {
    (info: any, callback: any): Logger;
  }
  
  interface Logger extends NodeJSStream.Transform {
    send: sendMethod;
    clear(): Logger;
    delete(): Logger;
  }
  
  let version: string;
  let clear: () => Logger;
  let stream: (options?: any) => NodeJS.ReadableStream;
  let send: sendMethod;
}

exports = CastoeStreamer;