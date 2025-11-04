import bwipjs from 'bwip-js';
import { BwipOptions } from '../types';

/**
 * 使用 bwip-js 渲染为 dataURL
 */
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

/**
 * SVG渲染条码，并插入文本节点
 */
export async function renderBwipSVG(options: BwipOptions, textLayer: any, withText = true): Promise<string> {
  return new Promise((resolve, reject) => {
    bwipjs.toSVG(Object.assign({}, options), function (err: any, svg: string) {
      if (err) {
        reject(err);
      } else {
        // 插入文本
        if (withText && textLayer.text) {
          // 提取 SVG 尺寸 viewBox="0 0 w h"
          const match = svg.match(/viewBox="\\s*0\\s*0\\s*(\\d+)\\s*(\\d+)"/);
          let w = 300, h = 120;
          if (match) {
            w = parseInt(match[1]);
            h = parseInt(match[2]);
          }
          // 计算文本布局
          let x = w / 2,
            y = h + (textLayer.offset || textLayer.fontSize || 12),
            textAnchor = "middle";
          if (textLayer.align === "left") {
            x = 4; textAnchor = "start";
          }
          if (textLayer.align === "right") {
            x = w - 4; textAnchor = "end";
          }
          if (textLayer.position === "top") y = -(textLayer.offset || textLayer.fontSize || 12);
          if (textLayer.position === "center") y = h / 2;
          // 支持多行文本
          const lines = (textLayer.text as string).split("\n");
          const fontSize = textLayer.fontSize || 12;
          const fontFamily = textLayer.fontFamily || "sans-serif";
          const fill = textLayer.color || "#222";
          let lineSvg = lines.map((line, idx) => {
            return `<tspan x="${x}" dy="${idx === 0 ? 0 : fontSize * 1.2}">${escapeSVG(line)}</tspan>`;
          }).join("");
          let textSVG = `<text x="${x}" y="${y}" font-size="${fontSize}" font-family="${fontFamily}" fill="${fill}" text-anchor="${textAnchor}">${lineSvg}</text>`;
          svg = svg.replace("</svg>", textSVG + "</svg>");
        }
        resolve(svg);
      }
    });
  });
}

export async function mergeExport(
  barcodeDataUrl: string, textLayer: any, props: any, withText = true, format: 'png'|'svg' = 'png'
) {
  if (format === 'svg') {
    const svg = await renderBwipSVG(props.bwip, textLayer, withText);
    return svg;
  }
  // PNG合成逻辑同之前
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
    // 多行支持
    const lines = (textLayer.text as string).split("\n");
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x, y + i * fontSize * 1.2);
    }
  }
  return canvas.toDataURL('image/png');
}

// helpers for browser/node canvas & image loading
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

function escapeSVG(text: string): string {
  return text.replace(/[&<>]/g, s =>
    s === "&" ? "&amp;" : s === "<" ? "&lt;" : s === ">" ? "&gt;" : s
  );
}