declare module 'bwip-js' {
  const anyExport: any;
  export default anyExport;
  export function toBuffer(opts: any, cb: (err: any, buf: Buffer) => void): void;
  export function toSVG(opts: any, cb: (err: any, svg: string) => void): void;
}