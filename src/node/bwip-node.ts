import bwipjs from 'bwip-js';
import { NodeBase, Text as LeaferText, Image as LeaferImage } from 'leafer-ui';
import { renderBwipToDataURL, mergeExport } from '../utils/bwip-render';
import { TextOptions, BwipOptions, BwipNodeProps } from '../types';

export class BwipNode extends NodeBase {
  props: BwipNodeProps;
  barcodeLayer: any;
  textLayer: any;
  private cachedDataURL?: string;

  constructor(props: BwipNodeProps = {} as any) {
    super();
    this.props = Object.assign({
      bwip: { bcid: 'qrcode', text: '', scale: 3 },
      text: { value: '', fontSize: 12, color: '#000', followStretch: true, position: 'bottom' }
    }, props);

    this.barcodeLayer = new LeaferImage();
    this.textLayer = new LeaferText();

    this.add(this.barcodeLayer);
    this.add(this.textLayer);

    this.updateAll();
  }

  async updateAll() {
    await this.updateBarcode();
    this.updateText();
    this.layoutChildren();
  }

  async updateBarcode() {
    const dataUrl = await renderBwipToDataURL(this.props.bwip);
    this.cachedDataURL = dataUrl;
    this.barcodeLayer.setImageSource(dataUrl);
    if (this.props.bwip.width && this.props.bwip.height) {
      this.barcodeLayer.setSize(this.props.bwip.width, this.props.bwip.height);
    } else {
      this.barcodeLayer.setSize(200, 200);
    }
  }

  updateText() {
    const t = this.props.text || {};
    this.textLayer.text = t.value || '';
    this.textLayer.fontSize = t.fontSize || 12;
    this.textLayer.color = t.color || '#000';
    this.textLayer.fontFamily = t.fontFamily || 'sans-serif';
    this.textLayer.followStretch = !!t.followStretch;
  }

  layoutChildren() {
    const w = this.width || this.barcodeLayer.width;
    const h = this.height || this.barcodeLayer.height;
    const t = this.props.text || {};

    this.barcodeLayer.x = 0;
    this.barcodeLayer.y = 0;

    const pos = t.position || 'bottom';
    if (pos === 'bottom') {
      this.textLayer.x = w / 2;
      this.textLayer.y = h + (t.offset || 4);
      this.textLayer.align = t.align || 'center';
    } else if (pos === 'top') {
      this.textLayer.x = w / 2;
      this.textLayer.y = -(t.offset || 4);
      this.textLayer.align = t.align || 'center';
    } else {
      this.textLayer.x = w / 2;
      this.textLayer.y = h / 2;
      this.textLayer.align = t.align || 'center';
    }
  }

  async exportAs(type: 'png'|'svg' = 'png', withText = true) {
    const barcodeDataUrl = this.cachedDataURL || await renderBwipToDataURL(this.props.bwip);
    if (type === 'png') {
      return mergeExport(barcodeDataUrl, this.textLayer, this.props, withText);
    } else {
      return mergeExport(barcodeDataUrl, this.textLayer, this.props, withText, 'svg');
    }
  }

  async setProps(props: Partial<BwipNodeProps>) {
    Object.assign(this.props, props);
    await this.updateAll();
    this.invalidate();
  }
}