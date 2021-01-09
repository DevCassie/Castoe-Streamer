import * as NodeJS from 'stream';
import * as Buffer from 'buffer'

export interface CastoeConsoleOptions {
	eol?: string;
	name: string;
	date?: string;
	traceFile?: boolean;
	showType?: boolean;
	colors?: CastoeConsoleColorOptions;
}
	
export interface CastoeConsoleColorOptions {
	bigint: string;
	boolean: string;
	function: string;
	number: string;
	object: string;
	string: string;
	symbol: string;
}

export interface CastoeFileOptions {
  file: string;
  dirname?: string;
  automatic?: boolean;
  overwrite?: boolean;
  options?: CastoeFileStreamOptions
}

export interface CastoeFileStreamOptions {
  flags?: string;
  encoding?: string;
  fd?: number;
  mode: number;
  autoClose: boolean;
  emitClose: boolean;
  start: number;
  end: number;
  highWaterMark: number;
}

export interface CastoeStreamOptions {
	stream: NodeJS.Writable;
	eol?: string;
}