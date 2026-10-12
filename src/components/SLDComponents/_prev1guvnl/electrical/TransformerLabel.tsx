import React from "react";
import { Group, Text } from "react-konva";
import { Blue } from "./constants";

interface TransformerLabelProps {
  x: number;
  y: number;
}

/* Transformer annotation */
export default function TransformerLabel({
  x,
  y,
}: TransformerLabelProps) {
  return (
    <Group x={x} y={y}>
      <Text
        text={
          "11.5 MVA Dyn11Dyn11Dyn11\n33 kV/0.690-0.690 kV-kV/0.690\n-0.690 kV"
        }
        fontSize={8}
        fontFamily="Arial"
        fill={Blue}
        lineHeight={1.15}
      />
    </Group>
  );
}
