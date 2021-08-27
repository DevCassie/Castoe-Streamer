declare namespace castoestreamer {
  interface Clone {
    oldFile: string;
    newFile: string;

    Clone(oldFile: string, newFile: string): Clone;
  }

  interface Clear {
    stream: NodeJS.WriteableStream;

    Clear(stream: NodeJS.WriteableStream): Clear;
  }

  interface Delete {
    file: string;

    Delete(file: string): Delete;
  }

  interface Rename {
    oldName: string;
    newName: string;

    Rename(oldName: string, newName: string): Rename;
  }

  interface Functions {
    Rename: Rename;
    Clear: Clear;
    Clone: Clone;
    Delete: Delete;
  }
}

declare const castoestreamer: castoestreamer.Functions;
export = castoestreamer