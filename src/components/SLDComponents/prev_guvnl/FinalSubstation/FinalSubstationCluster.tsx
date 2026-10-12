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
  x: 50,
  y: 0,
};

const SUBSTATION_2 = {
  x: 1450,
  y: 0,
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
        />
      </Group>

      {/* =================================================
          INTERCONNECTION
      ================================================= */}

      <Line
        points={[
          0,
          -521,
          2500,
          -521,
        ]}
        stroke="#ff0000"
        strokeWidth={2}
        listening={false}
      />

    </Group>
  );
}
