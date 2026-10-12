import React from "react";
import {
  Group,
  Circle,
} from "react-konva";

import BlueText from "./BlueText";
import Wire from "./Wire";

interface LinePTProps {
  x: number;
  y: number;
}

const LinePT: React.FC<LinePTProps> = ({
  x,
  y,
}) => (
  <Group x={x} y={y}>
    <BlueText
      x={-155}
      y={-45}
      text="33 kV LINE PT"
    />

    <BlueText
      x={-155}
      y={-20}
      text="33kV"
    />

    <BlueText
      x={-80}
      y={-20}
      text="110V"
    />

    <BlueText
      x={-15}
      y={-20}
      text="110V"
    />

    <BlueText
      x={-155}
      y={2}
      text="√3"
    />

    <BlueText
      x={-80}
      y={2}
      text="√3"
    />

    <BlueText
      x={-15}
      y={2}
      text="√3"
    />

    <Wire
      points={[-120, -5, -60, -5]}
    />

    <Wire
      points={[-45, -5, 0, -5]}
    />

    <BlueText
      x={-155}
      y={28}
      text="CL: 3P, 50VA"
      fontSize={12}
    />

    <BlueText
      x={-155}
      y={47}
      text="CL: 0.2, 50VA"
      fontSize={12}
    />

    {/* PT symbol */}
    <Circle
      x={0}
      y={95}
      radius={16}
      stroke="#222"
    />

    <Circle
      x={28}
      y={95}
      radius={16}
      stroke="#222"
    />

    <Wire
      points={[-15, 95, 44, 95]}
    />

    <Wire
      points={[14, 79, 14, 111]}
    />

    <Wire
      points={[14, 95, 28, 95]}
    />

    {/* Connection to relay */}
    <Wire
      points={[44, 95, 44, 70, 95, 70]}
    />

    <Wire
      points={[95, 70, 95, 50]}
    />
  </Group>
);

export default LinePT;
