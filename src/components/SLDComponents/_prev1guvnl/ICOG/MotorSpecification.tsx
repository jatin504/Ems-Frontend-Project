import React from "react";
import { Group } from "react-konva";

import BlueText from "./BlueText";

interface MotorSpecificationProps {
  x: number;
  y: number;
}

const MotorSpecification: React.FC<
  MotorSpecificationProps
> = ({ x, y }) => (
  <Group x={x} y={y}>
    <BlueText
      x={0}
      y={0}
      text="33kV,50Hz, 3P,"
      fontSize={12}
    />

    <BlueText
      x={0}
      y={17}
      text="VCB,1250 A"
      fontSize={12}
    />

    <BlueText
      x={0}
      y={34}
      text="26.3kA for 3 sec ,"
      fontSize={12}
    />

    <BlueText
      x={0}
      y={51}
      text="EDO type"
      fontSize={12}
    />
  </Group>
);

export default MotorSpecification;
