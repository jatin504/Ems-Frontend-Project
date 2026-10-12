import React, { useState } from "react";
import Konva from "konva";
import { Group } from "react-konva";

import SubstationSLD from "../Substation1/SubstationSLD";
import Substation2 from "../Substation2/Substation2";
import SubstationSingleLine from "../Substation3/SubstationSingleLine";

/* =========================================================
   TYPES
========================================================= */

export interface ComponentPosition {
  x: number;
  y: number;
}

export interface ComponentPositions {
  SubstationSLD: ComponentPosition;
  Substation2: ComponentPosition;
  SubstationSingleLine: ComponentPosition;
}

interface FinalSubstationLayoutProps {
  id: string;

  x?: number;
  y?: number;

  initialPositions?: ComponentPositions;
}

/* =========================================================
   DEFAULT POSITIONS
========================================================= */

export const DEFAULT_SUBSTATION_POSITIONS: ComponentPositions = {
  SubstationSingleLine: {
    x: -0.3,
    y: -1306,
  },

  Substation2: {
    x: 115.43,
    y: -521.29,
  },

  SubstationSLD: {
    x: 92.28,
    y: -61.72,
  },
};

/* =========================================================
   FINAL SUBSTATION LAYOUT
========================================================= */

export default function FinalSubstationLayout({
  id,
  x = 0,
  y = 0,
  initialPositions = DEFAULT_SUBSTATION_POSITIONS,
}: FinalSubstationLayoutProps) {
  const [componentPositions, setComponentPositions] =
    useState<ComponentPositions>(initialPositions);

  /* =========================================================
     COMPONENT DRAG
  ========================================================= */

  const handleComponentDragEnd = (
    componentId:
      | "SubstationSLD"
      | "Substation2"
      | "SubstationSingleLine",
    e: Konva.KonvaEventObject<DragEvent>
  ) => {
    e.cancelBubble = true;

    const node = e.target;

    const componentX = node.x();
    const componentY = node.y();

    setComponentPositions((previous) => ({
      ...previous,
      [componentId]: {
        x: componentX,
        y: componentY,
      },
    }));

    console.log(
      `[${id}/${componentId}] position:`,
      {
        x: componentX,
        y: componentY,
      }
    );

    console.log(
      `${id}/${componentId}: { x: ${componentX}, y: ${componentY} }`
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <Group
      id={id}
      x={x}
      y={y}
    >
      {/* =====================================================
          SUBSTATION SINGLE LINE
      ===================================================== */}

      <Group
        id={`${id}-SubstationSingleLine`}
        x={componentPositions.SubstationSingleLine.x}
        y={componentPositions.SubstationSingleLine.y}
        // draggable
        // onDragEnd={(e) =>
        //   handleComponentDragEnd(
        //     "SubstationSingleLine",
        //     e
        //   )
        // }
      >
        <SubstationSingleLine />
      </Group>

      {/* =====================================================
          SUBSTATION 2
      ===================================================== */}

      <Group
        id={`${id}-Substation2`}
        x={componentPositions.Substation2.x}
        y={componentPositions.Substation2.y}
        // draggable
        // onDragEnd={(e) =>
        //   handleComponentDragEnd(
        //     "Substation2",
        //     e
        //   )
        // }
      >
        <Substation2 />
      </Group>

      {/* =====================================================
          SUBSTATION SLD
      ===================================================== */}

      <Group
        id={`${id}-SubstationSLD`}
        x={componentPositions.SubstationSLD.x}
        y={componentPositions.SubstationSLD.y}
        // draggable
        // onDragEnd={(e) => {
        //   e.cancelBubble = true;

        //   handleComponentDragEnd(
        //     "SubstationSLD",
        //     e
        //   );
        // }}
      >
        <SubstationSLD mainX={316} />
      </Group>
    </Group>
  );
}
