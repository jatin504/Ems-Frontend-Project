import React from "react";
import { Group, Text } from "react-konva";
import { Blue, FONT, FONT_SIZE } from "../electrical/constants";

interface TransformerLabelProps {
  x: number;
  y: number;
  scale?: number;
}

/* Transformer annotation */
export default function TransformerLabel({
  x,
  y,
  scale=1,
}: TransformerLabelProps) {
  return (
    <Group x={x} y={y} scaleX={scale} scaleY={scale}>
      <Text
        text={
          "11.5 MVA Dyn11Dyn11Dyn11\n33 kV/0.690-0.690 kV-kV/0.690\n-0.690 kV"
        }
        fontSize={FONT_SIZE}
        fontFamily={FONT}
        fill={Blue}
        // lineHeight={1.15}
      />
    </Group>
  );
}
