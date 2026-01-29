declare module 'html-pdf-node' {
  interface IFile {
    content?: string;
    url?: string;
  }

  interface IOptions {
    format?: string;
    args?: string[];
    margin?: string;
    [key: string]: any;
  }

  function htmlPdf(file: IFile | string, options?: IOptions): Promise<Buffer>;
  export = htmlPdf;
}