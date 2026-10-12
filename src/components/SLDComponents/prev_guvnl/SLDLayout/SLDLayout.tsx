import React from "react";
import {
  Stage,
  Layer,
  Line,
  Group,
} from "react-konva";

import ICOG from "../ICOG/ICOG";
import PCSFeeder from "../PCSFeeder/PCSFeeder";
import { PCSBlock } from "../PCSBlock/PCSBlock";

const BLACK = "#111";

const SLDLayout: React.FC = () => {
  return (
    <Stage
      width={1200}
      height={2100}
    >
      <Layer>

        {/* =================================================
            ICOG
        ================================================= */}

        <Group
          x={325}
          y={20}
          scaleX={0.8}
          scaleY={0.8}
        >
          <ICOG />
        </Group>


        {/* =================================================
            MAIN CONNECTION FROM ICOG
        ================================================= */}

        <Line
          points={[
            475,
            580,
            475,
            630,
          ]}
          stroke={BLACK}
          strokeWidth={2}
        />


        {/* =================================================
            MAIN BUS
        ================================================= */}

        <Line
          points={[
            220,
            630,
            730,
            630,
          ]}
          stroke={BLACK}
          strokeWidth={3}
        />


        {/* =================================================
            LEFT FEEDER CONNECTION
        ================================================= */}

        <Line
          points={[
            330,
            630,
            330,
            670,
          ]}
          stroke={BLACK}
          strokeWidth={2}
        />


        {/* =================================================
            RIGHT FEEDER CONNECTION
        ================================================= */}

        <Line
          points={[
            620,
            630,
            620,
            670,
          ]}
          stroke={BLACK}
          strokeWidth={2}
        />


        {/* =================================================
            LEFT PCS FEEDER
        ================================================= */}

        <Group
          x={130}
          y={670}
          scaleX={0.45}
          scaleY={0.45}
        >
          <PCSFeeder />
        </Group>


        {/* =================================================
            RIGHT PCS FEEDER
        ================================================= */}

        <Group
          x={550}
          y={670}
          scaleX={0.45}
          scaleY={0.45}
        >
          <PCSFeeder />
        </Group>


        {/* =================================================
            LEFT PCS BLOCK
        ================================================= */}

        <Group
          x={120}
          y={1030}
          scaleX={0.4}
          scaleY={0.4}
        >
          <PCSBlock />
        </Group>


        {/* =================================================
            RIGHT PCS BLOCK
        ================================================= */}

        <Group
          x={540}
          y={1030}
          scaleX={0.4}
          scaleY={0.4}
        >
          <PCSBlock />
        </Group>

      </Layer>
    </Stage>
  );
};

export default SLDLayout;
