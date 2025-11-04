// Demo main: uses leafer-ui from CDN and local built plugin (adjust path if needed).
// If you are developing locally with source files, import your built ESM bundle: ../dist/index.esm.js
import Leafer from 'https://unpkg.com/leafer-ui@1.9.12/dist/web.min.js';
import registerBwip from './../dist/index.js'; // adjust if your built bundle path differs

// Register plugin
registerBwip(Leafer);

// Create a stage container
const container = document.createElement('div');
container.style.width = '980px';
container.style.margin = '16px';
document.getElementById('barcode-container').appendChild(container);

const stage = new Leafer.Stage({
  container,
  width: 980,
  height: 600,
  background: '#fff'
});

// Helper to create a Bwip node and show it in a demo card
function addDemoCard(title, opts) {
  const card = document.createElement('div');
  card.className = 'demo-card';
  card.innerHTML = `<div class="demo-title">${title}</div>
    <div class="demo-meta">bcid: ${opts.bwip.bcid} · followStretch: ${opts.text.followStretch}</div>`;
  document.getElementById('barcode-container').appendChild(card);

  // create node
  const node = new Leafer.Nodes.Bwip(opts);
  node.x = opts.x || 16;
  node.y = opts.y || 16;
  stage.add(node);

  // per-card export buttons
  const btnExportPng = document.createElement('button');
  btnExportPng.textContent = 'Export PNG';
  btnExportPng.onclick = async () => {
    try {
      const url = await node.exportAs('png', true);
      window.open(url, '_blank');
    } catch (e) {
      console.error(e);
      alert('Export PNG failed: ' + (e && e.message ? e.message : e));
    }
  };

  const btnExportSvg = document.createElement('button');
  btnExportSvg.textContent = 'Export SVG';
  btnExportSvg.onclick = async () => {
    try {
      const svg = await node.exportAs('svg', true);
      const uri = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
      window.open(uri, '_blank');
    } catch (e) {
      console.error(e);
      alert('Export SVG failed: ' + (e && e.message ? e.message : e));
    }
  };

  card.appendChild(btnExportPng);
  card.appendChild(btnExportSvg);

  return node;
}

const demos = [
  {
    title: 'QR Code (bottom text, not followStretch)',
    opts: {
      bwip: { bcid: 'qrcode', text: 'https://leafer.dev', scale: 4 },
      text: { value: '扫码访问 leafer.dev', fontSize: 14, color: '#111', position: 'bottom', align: 'center', followStretch: false },
      x: 16, y: 16
    }
  },
  {
    title: 'Code128 (top text, followStretch)',
    opts: {
      bwip: { bcid: 'code128', text: 'HELLO-128', scale: 3, includetext: false },
      text: { value: 'HELLO-128', fontSize: 12, color: '#000', position: 'top', align: 'center', followStretch: true },
      x: 360, y: 16
    }
  },
  {
    title: 'EAN-13 (bottom numeric text, followStretch)',
    opts: {
      bwip: { bcid: 'ean13', text: '5901234123457', scale: 3, includetext: false },
      text: { value: '5901234123457', fontSize: 12, color: '#000', position: 'bottom', align: 'center', followStretch: true },
      x: 16, y: 260
    }
  },
  {
    title: 'PDF417 (multi-line text, right, not followStretch)',
    opts: {
      bwip: { bcid: 'pdf417', text: 'PDF417 DEMO\nLine2', scale: 2 },
      text: { value: 'PDF417 示例\n多行支持', fontSize: 12, color: '#006', position: 'right', align: 'left', followStretch: false },
      x: 360, y: 260
    }
  },
  {
    title: 'DataMatrix (left text, followStretch)',
    opts: {
      bwip: { bcid: 'datamatrix', text: 'DM-12345', scale: 4 },
      text: { value: 'DM-12345', fontSize: 12, color: '#900', position: 'left', align: 'left', followStretch: true },
      x: 700, y: 16
    }
  }
];

const nodes = demos.map(d => addDemoCard(d.title, d.opts));

// Export all buttons behavior
document.getElementById('export-png').addEventListener('click', async () => {
  for (const n of nodes) {
    try {
      const url = await n.exportAs('png', true);
      window.open(url, '_blank');
    } catch (e) {
      console.error(e);
    }
  }
});

document.getElementById('export-svg').addEventListener('click', async () => {
  for (const n of nodes) {
    try {
      const svg = await n.exportAs('svg', true);
      const uri = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
      window.open(uri, '_blank');
    } catch (e) {
      console.error(e);
    }
  }
});