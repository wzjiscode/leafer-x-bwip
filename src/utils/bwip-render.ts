import bwipjs from 'bwip-js';
import { BwipOptions } from '../types';

export async function renderBwipToDataURL(options: BwipOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      bwipjs.toBuffer(Object.assign({}, options), function (err: any, png: Buffer) {
        if (err) {
          reject(err);
        } else {
          const base64 = png.toString('base64');
          resolve('data:image/png;base64,' + base64);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

export async function mergeExport(barcodeDataUrl: string, textLayer: any, props: any, withText = true, format: 'png'|'svg' = 'png') {
  if (format === 'svg') {
    return barcodeDataUrl;
  }

  const img = await loadImage(barcodeDataUrl);
  const width = img.width;
  const height = img.height + (withText ? (textLayer.fontSize + 8) : 0);

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = props.background || '#fff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0);

  if (withText && textLayer.text) {
    ctx.fillStyle = textLayer.color || '#000';
    const fontSize = textLayer.fontSize || 12;
    ctx.font = `${fontSize}px ${textLayer.fontFamily || 'sans-serif'}`;
    ctx.textAlign = textLayer.align || 'center';
    ctx.textBaseline = 'top';
    const x = width / 2;
    const y = img.height + 4;
    ctx.fillText(textLayer.text, x, y);
  }

  return canvas.toDataURL('image/png');
}

function loadImage(dataUrl: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function createCanvas(w: number, h: number): any {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return canvas;
}