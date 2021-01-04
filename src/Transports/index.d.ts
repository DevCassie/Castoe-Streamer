import * as Transport from 'stream';

declare namespace CastoeStreamer {
	interface CastoeConsoleTransportOptions extends Transport.TransportStreamOptions {
		eol?: string;
		name: string;
		date?: string;
		traceFile?: boolean;
		showType?: boolean;
		colors?: CastoeConsoleColorOptions;
	}
	
	interface CastoeConsoleColorOptions extends Object {
		bigint: string;
		boolean: string;
		function: string;
		number: string;
		object: string;
		string: string;
		symbol: string;
	}
	
	interface CastoeConsoleTransportInstance extends Transport {
		name: string;
		traceFile: boolean;
		date: string;
		showType: boolean;
		colors: CastoeConsoleColorOptions;
		eol: string;
	
		new(options?: CastoeConsoleTransportOptions): CastoeConsoleTransportInstance;
	}
	
	interface CastoeFileTransportOptions extends Transport.TransportStreamOptions {
		name?: string;
		filename?: string;
		file?: string;
		dirname?: string;
		options?: object;
		maxsize?: number;
		stream?: NodeJS.WritableStream;
		rotationFormat?: Function;
		zippedArchive?: boolean;
		maxFiles?: number;
		eol?: string;
		tailable?: boolean;
	}
	
	interface CastoeFileTransportInstance extends Transport {
		name: string;
		filename: string;
		dirname: string;
		options: object;
		maxsize: number | null;
		rotationFormat: Function | boolean;
		zippedArchive: boolean;
		maxFiles: number | null;
		eol: string;
		tailable: boolean;
		
		new(options?: CastoeFileTransportOptions): CastoeFileTransportInstance;
	}
	
	interface CastoeStreamTransportOptions extends Transport.TransportStreamOptions {
		stream: NodeJS.WritableStream;
		eol?: string;
	}
	
	interface CastoeStreamTransportInstance extends Transport {
		eol: string;
		
		new(options?: CastoeStreamTransportOptions): CastoeStreamTransportInstance;
	}
	
	interface Transports {
		CastoeFile: CastoeFileTransportInstance;
		CastoeFileOptions: CastoeFileTransportOptions;
		CastoeConsole: CastoeConsoleTransportInstance;
		CastoeConsoleOptions: CastoeConsoleTransportOptions;
		CastoeStream: CastoeStreamTransportInstance;
		CastoeStreamOptions: CastoeStreamTransportOptions;
	}
}

declare const castoestreamer: CastoeStreamer.Transports;
export = castoestreamer;