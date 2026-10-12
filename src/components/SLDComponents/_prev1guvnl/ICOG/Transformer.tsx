import React from "react";
import { Group, Circle, Line } from "react-konva";

interface TransformerProps {
  x: number;
  y: number;
  scale?:number;
}

const Transformer: React.FC<TransformerProps> = ({ x, y, scale=1 }) => {
  const stroke = "#222";
  const radius = 37;

  return (
    <Group
      x={x}
      y={y}
      rotation={270}
      scaleX={scale}
      scaleY={scale}
    >
      {/* Top phase */}
      <Circle
        x={0}
        y={-22}
        radius={radius}
        stroke={stroke}
        strokeWidth={2.5}
      />

      {/* Bottom-left phase */}
      <Circle
        x={-22}
        y={15}
        radius={radius}
        stroke={stroke}
        strokeWidth={2.5}
      />

      {/* Bottom-right phase */}
      <Circle
        x={22}
        y={15}
        radius={radius}
        stroke={stroke}
        strokeWidth={2.5}
      />

      {/* Top connection */}
      <Line
        points={[0, -59, 0, -100]}
        stroke={stroke}
        strokeWidth={2.5}
        lineCap="butt"
      />

      {/* Bottom-left connection */}
      <Line
        points={[-22, 52, -22, 93]}
        stroke={stroke}
        strokeWidth={2.5}
        lineCap="butt"
      />

      {/* Bottom-right connection */}
      <Line
        points={[22, 52, 22, 93]}
        stroke={stroke}
        strokeWidth={2.5}
        lineCap="butt"
      />
    </Group>
  );
};

export default Transformer;
