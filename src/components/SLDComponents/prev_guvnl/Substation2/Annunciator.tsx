import React from "react";
import { Group, Rect } from "react-konva";
import RedLine from "./RedLine";
import { RED } from "../electrical/constants";

const Annunciator: React.FC = () => {
  const x = 611;
  const y = 168;
  const width = 93;
  const height = 42;

  const verticals = [0, 18, 36, 55, 73, 93];

  return (
    <Group>
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke={RED}
        strokeWidth={2}
      />

      {verticals.map((v, i) => (
        <RedLine
          key={`v-${i}`}
          points={[
            x + v,
            y,
            x + v,
            y + height,
          ]}
          strokeWidth={1.5}
        />
      ))}

      {[14, 28].map((offset, i) => (
        <RedLine
          key={`h-${i}`}
          points={[
            x,
            y + offset,
            x + width,
            y + offset,
          ]}
          strokeWidth={1.5}
        />
      ))}
    </Group>
  );
};

export default Annunciator;
