import React from "react";
import { Stage, Layer, Group } from "react-konva";

import { TransformerTopSection } from "./TransformerTopSection";
import { ExistingSLD } from "./ExistingSLD";

export interface SubstationSLDProps {
  mainX?: number;
}

export default function SubstationSLD({
  mainX = 316,
}: SubstationSLDProps) {
  return (
    <Group>
      <TransformerTopSection
        mainX={mainX}
      />

      <Group y={500}>
        <ExistingSLD
          mainX={mainX}
        />
      </Group>
    </Group>
  );
}
