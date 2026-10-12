import React from "react";
import { Group } from "react-konva";
import RedLine from "./RedLine";
import Label from "./Label";

const VTSection: React.FC = () => (
  <Group>
    <RedLine
      points={[418, 420, 420, 420]}
    />

    <Label
      x={760}
      y={400}
      text="FROM"
      fontSize={9}
    />

    <Label
      x={760}
      y={412}
      text="66 KV PT"
      fontSize={9}
    />
  </Group>
);

export default VTSection;
