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
  scale? : number;
}

const LinePT: React.FC<LinePTProps> = ({
  x,
  y,
  scale=1,
}) => (
  <Group x={x} y={y} scaleX={scale} scaleY={scale}>
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
      y={-18}
      text="____"
    />

    <BlueText
      x={-80}
      y={-18}
      text="____"
    />

    <BlueText
      x={-15}
      y={-18}
      text="____"
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

    {/* <Wire
      points={[-160, -5, -60, -5]}
    />

    <Wire
      points={[-120, -5, -60, -5]}
    />

    <Wire
      points={[-45, -5, 0, -5]}
    /> */}

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
  </Group>
);

export default LinePT;
