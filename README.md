# @wzjiscode/leafer-x-bwip

Leafer 插件：支持所有 bwip-js 条码/二维码渲染，文本分层，PNG/SVG 导出，支持全部参数和独立文本样式控制。

## 安装

```sh
npm install @wzjiscode/leafer-x-bwip bwip-js
```

## 使用说明

```ts
import Leafer from 'leafer-ui';
import registerBwip from '@wzjiscode/leafer-x-bwip';

registerBwip(Leafer);

const node = new Leafer.Nodes.Bwip({
  bwip: { bcid: 'qrcode', text: 'https://leafer.dev', scale: 3, backgroundcolor: '#eee' },
  text: { value: '扫码访问\n多行支持', fontSize: 18, color: '#009', position: 'bottom', align: 'center', followStretch: false }
});
stage.add(node);

// PNG 导出
const pngUrl = await node.exportAs('png', true);

// SVG 导出（矢量，支持高清和裁剪）
const svgText = await node.exportAs('svg', true);
// svgText 可用于保存文件或 img src="data:image/svg+xml;base64,..."
```

### 参数说明

- **bwip**: 全部 bwip-js 支持选项，详见 [bwip-js 文档](https://github.com/metafloor/bwip-js)
- **text**: 独立文本层参数（value, fontSize, fontFamily, color, align, position, offset, followStretch）
- **exportAs**: 支持 `exportAs('png'|'svg', true|false)` — 第二个参数是否合成文本

### 特点

- 支持 bottom/top/center/left/right 五种相对码图的位置（自动偏移）
- 支持字体大小、位置/对齐、拉伸跟随
- 支持多行文本（用 \n 换行）
- SVG 导出时，文本以 <text> 元素合成，高清无损

---

如需更多自定义样式（如字体加粗/斜体、偏移等），或 Node.js 环境导出支持，可进一步扩展。