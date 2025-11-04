import Leafer from 'https://unpkg.com/leafer-ui@latest/dist/leafer-ui.esm.js';
import registerBwip from '../dist/index.js';

registerBwip(Leafer);

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

const demos = [
  {
    title: 'QR Code with text (followStretch: false)',
    opts: {
      x: 50,
      y: 50,
      bwip: { bcid: 'qrcode', text: 'https://leafer.dev', scale: 3 },
      text: { value: 'Scan me', fontSize: 14, position: 'bottom', align: 'center', followStretch: false }
    }
  },
  {
    title: 'Code128 (followStretch: true)',
    opts: {
      x: 250,
      y: 50,
      bwip: { bcid: 'code128', text: '12345678', scale: 2 },
      text: { value: 'Product Code', fontSize: 12, position: 'bottom', align: 'center', followStretch: true }
    }
  },
  {
    title: 'EAN-13',
    opts: {
      x: 450,
      y: 50,
      bwip: { bcid: 'ean13', text: '1234567890128', scale: 2 },
      text: { value: 'EAN-13', fontSize: 12, position: 'top', align: 'center', followStretch: false }
    }
  },
  {
    title: 'PDF417',
    opts: {
      x: 50,
      y: 250,
      bwip: { bcid: 'pdf417', text: 'PDF417 Example', scale: 2 },
      text: { value: '2D Barcode', fontSize: 12, position: 'bottom', align: 'center', followStretch: false }
    }
  },
  {
    title: 'DataMatrix',
    opts: {
      x: 350,
      y: 250,
      bwip: { bcid: 'datamatrix', text: 'DataMatrix Test', scale: 3 },
      text: { value: 'Data Matrix', fontSize: 12, position: 'bottom', align: 'center', followStretch: false }
    }
  }
];

const nodes = [];

demos.forEach((demo, i) => {
  const node = new Leafer.Nodes.Bwip(demo.opts);
  stage.add(node);
  nodes.push(node);
  
  // Create info card for each demo
  const card = document.createElement('div');
  card.className = 'demo-card';
  card.innerHTML = `
    <div class="demo-title">${demo.title}</div>
    <div class="demo-meta">bcid: ${demo.opts.bwip.bcid} · followStretch: ${demo.opts.text.followStretch}</div>
  `;
  document.getElementById('barcode-container').appendChild(card);
});

// Export buttons
document.getElementById('export-png').addEventListener('click', async () => {
  console.log('Exporting all as PNG...');
  for (let i = 0; i < nodes.length; i++) {
    try {
      const pngUrl = await nodes[i].exportAs('png', true);
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `barcode-${i}.png`;
      a.click();
    } catch (e) {
      console.error('PNG export error:', e);
    }
  }
});

document.getElementById('export-svg').addEventListener('click', async () => {
  console.log('Exporting all as SVG...');
  for (let i = 0; i < nodes.length; i++) {
    try {
      const svgText = await nodes[i].exportAs('svg', true);
      const blob = new Blob([svgText], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `barcode-${i}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('SVG export error:', e);
    }
  }
});
