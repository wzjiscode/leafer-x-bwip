import { LeaferPluginRegister } from 'leafer-ui';
import { BwipNode } from './node/bwip-node';

export default function register(Leafer: any) {
  Leafer.registerNode('Bwip', BwipNode);
}

export { BwipNode };