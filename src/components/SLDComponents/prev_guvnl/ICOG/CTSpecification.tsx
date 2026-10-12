import React from "react";
import { Group } from "react-konva";

import BlueText from "./BlueText";

interface CTSpecificationProps {
  x: number;
  y: number;
}

const CTSpecification: React.FC<
  CTSpecificationProps
> = ({ x, y }) => (
  <Group x={x} y={y}>
    <BlueText
      x={0}
      y={0}
      text="33kV CT"
    />

    <BlueText
      x={0}
      y={18}
      text="700/1-1-1 A"
      fontSize={12}
    />

    <BlueText
      x={0}
      y={42}
      text="CORE-1"
      fontSize={12}
    />

    <BlueText
      x={0}
      y={60}
      text="CL 5P20, 20VA"
      fontSize={12}
    />

    <BlueText
      x={0}
      y={78}
      text="CORE-2"
      fontSize={12}
    />

    <BlueText
      x={0}
      y={96}
      text="CL 0.5S, 20VA"
      fontSize={12}
    />

    <BlueText
      x={0}
      y={114}
      text="CORE-3"
      fontSize={12}
    />

    <BlueText
      x={0}
      y={132}
      text="CL 5P20, 20VA"
      fontSize={12}
    />
  </Group>
);

export default CTSpecification;
