import * as NodeJS from 'stream';

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
	name?: string;
	filename?: string;
	file?: string;
	dirname?: string;
	options?: object;
	maxsize?: number;
	stream?: NodeJS.Writable;
	rotationFormat?: Function;
	zippedArchive?: boolean;
	maxFiles?: number;
	eol?: string;
	tailable?: boolean;
}

export interface CastoeStreamOptions {
	stream: NodeJS.Writable;
	eol?: string;
}