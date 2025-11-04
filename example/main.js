import Leafer from 'https://unpkg.com/leafer-ui@latest/dist/leafer-ui.esm.js';
import registerBwip from '../dist/index.esm.js';

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

function addDemoCard(title, opts) {
  const card = document.createElement('div');
  card.className = 'demo-card';
  card.innerHTML = `<div class="demo-title">${title}</div>\n    <div class="demo-meta">bcid: ${opts.bwip.bcid} · followStretch: ${opts.text.followStretch}</div>`;
document.getElementById('barcode-container').appendChild(card);

  const node = new Leafer.Nodes.Bwip(opts);
  node.x = opts.x || 16;
  node.y = opts.y || 16;
  stage.add(node);

  const btnExportPng = document.createElement('button');
  btnExportPng.textContent = 'Export PNG';
b...