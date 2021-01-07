declare namespace castoestreamer {
  interface Clone {
    oldFile: string;
    newFile: string;
    
    clone(oldFile: string, newFile: string): Clone;
  }
  
  interface Clear {
    stream: NodeJS.WritableStream;
  
    clear(stream: NodeJS.WritableStream): Clear;
  }
  
  interface Delete {
    file: string;
    
    delete(file: string): Delete;
  }
  
  interface Rename {
    oldName: string;
    newName: string;
    
    rename(oldName: string, newName: string): Rename;
  }
  
  interface Functions {
    Clone: Clone;
    Clear: Clear;
    Delete: Delete;
    Rename: Rename;
  }
}

declare const castoestreamer: castoestreamer.Functions;
export = castoestreamer;