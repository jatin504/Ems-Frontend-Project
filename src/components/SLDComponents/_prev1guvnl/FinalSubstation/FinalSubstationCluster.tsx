import React from "react";
import {
  Group,
  Line,
  Text,
} from "react-konva";

import FinalSubstationLayout from "./FinalSubtation";

/* =========================================================
   POSITIONS
========================================================= */

const SUBSTATION_1 = {
  x: 2650,
  y: 172,
};

const SUBSTATION_2 = {
  x: 6050,
  y: 172,
};

/* =========================================================
   PROPS
========================================================= */

interface FinalSubstationClusterProps {
  id?: string;
  x?: number;
  y?: number;
}

/* =========================================================
   FINAL SUBSTATION CLUSTER
========================================================= */

export default function FinalSubstationCluster({
  id = "FinalSubstationCluster",
  x = 0,
  y = 0,
}: FinalSubstationClusterProps) {
  return (
    <Group
      id={id}
      x={x}
      y={y}
    >

      {/* =================================================
          CLUSTER TITLE
      ================================================= */}

      {/* <Text
        x={50}
        y={-1250}
        text="132 kV SUBSTATION CLUSTER"
        fontSize={28}
        fontFamily="Arial"
        fontStyle="bold"
        fill="#0000ff"
        listening={false}
      /> */}

      {/* =================================================
          SUBSTATION 1
      ================================================= */}

      <Group
        id={`${id}-1`}
        x={SUBSTATION_1.x}
        y={SUBSTATION_1.y}
      >
        <FinalSubstationLayout
          id="Substation-1"
          lineNumber={1}
        />
      </Group>

      {/* =================================================
          SUBSTATION 2
      ================================================= */}

      <Group
        id={`${id}-2`}
        x={SUBSTATION_2.x}
        y={SUBSTATION_2.y}
      >
        <FinalSubstationLayout
          id="Substation-2"
          lineNumber={2}
        />
      </Group>

      {/* =================================================
          INTERCONNECTION
      ================================================= */}

      <Line
        points={[
          2500,
          -370,
          7500,
          -370,
        ]}
        stroke="#ff0000"
        strokeWidth={5}
        listening={false}
      />

    </Group>
  );
}
