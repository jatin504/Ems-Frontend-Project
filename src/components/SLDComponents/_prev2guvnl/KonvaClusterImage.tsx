import React from "react";

import {
  Image as KonvaImage,
} from "react-konva";

interface Props {
  x: number;
  y: number;

  canvas: HTMLCanvasElement;

  width: number;
  height: number;
}

export default function KonvaClusterImage({
  x,
  y,
  canvas,
  width,
  height,
}: Props) {
  return (
    <KonvaImage
      image={canvas}
      x={x}
      y={y}
      width={width}
      height={height}
      listening={false}
    />
  );
}
