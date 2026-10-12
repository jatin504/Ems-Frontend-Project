import Konva from 'konva';

export const symbolCache = new Map<string, HTMLCanvasElement>();

export const registerSymbol = (name: string, node: Konva.Node) => {
  if (!symbolCache.has(name)) {
    node.cache(); // Tell Konva to calculate the bounding box
    symbolCache.set(name, node.toCanvas()); // Extract as a reusable canvas
  }
};

export const getSymbol = (name: string) => symbolCache.get(name);