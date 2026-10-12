import React, { useRef, useState } from "react";
import { Stage, Layer, Group, Rect, Text, Line } from "react-konva";
import Konva from "konva";

import ICOG from "./ICOG/ICOG";
import PCSFeeder from "./PCSFeeder/PCSFeeder";
import { PCSBlock } from "./PCSBlock/PCSBlock";
import Wire from "./PCSFeeder/Wire";
import { BLACK, RED } from "./electrical/constants";
import AuxSingleLineDiagram from "./Auxilary/AuxSingleLineDiagram";

// ============================================================
// MVR CLUSTER SIZE
// ============================================================

const MVR_CLUSTER_WIDTH = 2350 //3250;
const MVR_CLUSTER_HEIGHT = 1390;

// ============================================================
// MVR CLUSTER POSITIONS
//
// 6 MVR Clusters arranged horizontally.
// Same spacing between every cluster.
// ============================================================

const MVR_CLUSTER_GAP = 150;
const THREE_FEEDER_EXTRA_WIDTH = 900;
const MVR_CLUSTER_LEFT_OFFSET = -300;

const MVR_CLUSTER_POSITIONS = Array.from(
  { length: 6 },
  (_, index) => {
    if (index === 0) {
      return {
        x: 0,
        y: 0,
      };
    }

    let x = 0;

    for (let i = 0; i < index; i++) {
      const previousClusterNumber = i + 1;

      const previousClusterWidth =
        previousClusterNumber === 3 ||
        previousClusterNumber === 6
          ? MVR_CLUSTER_WIDTH + THREE_FEEDER_EXTRA_WIDTH
          : MVR_CLUSTER_WIDTH;

      x += previousClusterWidth + MVR_CLUSTER_GAP;
    }

    return {
      x,
      y: 0,
    };
  }
);



// ============================================================
// FIXED COMPONENT POSITIONS
// ============================================================

const COMPONENT_POSITIONS = {
  pcsBlock1: {
    x: -129,
    y: 985,
  },

  pcsBlock2: {
    x: 1014,
    y: 985,
  },

  pcsFeeder1: {
    x: 0,
    y: 203,
  },

  pcsFeeder2: {
    x: 1150,
    y: 203,
  },

  threeFeeder: {
    pcsBlock1: {
    x: -129,
    y: 985,
  },

  pcsBlock2: {
    x: 1014,
    y: 985,
  },

  pcsFeeder1: {
    x: 0,
    y: 203,
  },

  pcsFeeder2: {
    x: 1150,
    y: 203,
  },
  // Third feeder close to feeder 1 and 2
  pcsFeeder3: {
    x: 2100,
    y: 203,
  },
  },

  icog: {
    x: 582,
    y: -475,
  },
};

// ============================================================
// BLOCK BAY SIZE
//
// Change these values whenever you want the dashed bays
// to become larger/smaller.
// ============================================================

const BLOCK_BAY_WIDTH = 8350;
const BLOCK_BAY_HEIGHT = 2650;

// ============================================================
// BLOCK BAY POSITIONS
// ============================================================

const BLOCK_BAYS = {
  block1: {
    x: -350,
    y: -600,
  },

  block2: {
    x: 8100,
    y: -600,
  },
};

// ============================================================
// MVR CLUSTER
//
// IMPORTANT:
// This component is now FROZEN.
// Nothing inside the MVR cluster is draggable.
// ============================================================
interface MVRClusterProps {
  threeFeeders?: boolean;
  clusterNumber?: number;
}

export const MVRCluster = ({
  threeFeeders = false,
  clusterNumber = 1,
}: MVRClusterProps) => {

  // Only MVR Cluster 3 has 2 PCS in PCS Block 2
  const pcsBlock2Count =
    clusterNumber === 3 ? 2 : 4;

  return (
    <Group>

      {/* ======================================================
          BIG RED OUTLINE
          ====================================================== */}

      <Rect
        x={-300}
        y={-500}
        width={threeFeeders ? MVR_CLUSTER_WIDTH + 900 : MVR_CLUSTER_WIDTH}
        height={MVR_CLUSTER_HEIGHT}
        stroke="red"
        strokeWidth={1}
        listening={false}
      />

      <Text
        x={-300}
        y={-520}
        text="33 kV PANNEL/CLUSTER SWITCHBOARD * 1 NOS"
        fontSize={12}
        fill={BLACK}
      />

      {/* ======================================================
          BUS / WIRE
          ====================================================== */}

      <Wire
        points={[
          -70,
          203,
          threeFeeders ? 1995 + 900 : 1995,
          203,
        ]}
        color={"#90B800"}
        width={6}
      />

      {/* ======================================================
          PCS BLOCK 1
          Always 4 PCS
          ====================================================== */}

      <Group
        x={
          threeFeeders
            ? COMPONENT_POSITIONS.threeFeeder.pcsBlock1.x
            : COMPONENT_POSITIONS.pcsBlock1.x
        }
        y={
          threeFeeders
            ? COMPONENT_POSITIONS.threeFeeder.pcsBlock1.y
            : COMPONENT_POSITIONS.pcsBlock1.y
        }
      >
        <PCSBlock
          x={0}
          y={0}
          count={4}
        />
      </Group>

      {/* ======================================================
          PCS BLOCK 2
          
          MVR Cluster 1 -> 4 PCS
          MVR Cluster 2 -> 4 PCS
          MVR Cluster 3 -> 2 PCS
          ====================================================== */}

      <Group
        x={
          threeFeeders
            ? COMPONENT_POSITIONS.threeFeeder.pcsBlock2.x
            : COMPONENT_POSITIONS.pcsBlock2.x
        }
        y={
          threeFeeders
            ? COMPONENT_POSITIONS.threeFeeder.pcsBlock2.y
            : COMPONENT_POSITIONS.pcsBlock2.y
        }
      >
        <PCSBlock
          x={0}
          y={0}
          count={pcsBlock2Count}
        />
      </Group>

      {/* ======================================================
          PCS FEEDER 1
          ====================================================== */}

      <Group
        x={
          threeFeeders
            ? COMPONENT_POSITIONS.threeFeeder.pcsFeeder1.x
            : COMPONENT_POSITIONS.pcsFeeder1.x
        }
        y={
          threeFeeders
            ? COMPONENT_POSITIONS.threeFeeder.pcsFeeder1.y
            : COMPONENT_POSITIONS.pcsFeeder1.y
        }
      >
        <PCSFeeder
          x={0}
          y={0}
        />
      </Group>

      {/* ======================================================
          PCS FEEDER 2
          ====================================================== */}

      <Group
        x={
          threeFeeders
            ? COMPONENT_POSITIONS.threeFeeder.pcsFeeder2.x
            : COMPONENT_POSITIONS.pcsFeeder2.x
        }
        y={
          threeFeeders
            ? COMPONENT_POSITIONS.threeFeeder.pcsFeeder2.y
            : COMPONENT_POSITIONS.pcsFeeder2.y
        }
      >

        <PCSFeeder
          x={0}
          y={0}
        />
      </Group>

      {/* ======================================================
          PCS FEEDER 3
          ====================================================== */}

      {threeFeeders && (
        <Group
          x={COMPONENT_POSITIONS.threeFeeder.pcsFeeder3.x}
          y={COMPONENT_POSITIONS.threeFeeder.pcsFeeder3.y}
        >
          <PCSFeeder
            x={0}
            y={0}
          />
        </Group>
      )}

      {/* ======================================================
          ICOG
          ====================================================== */}

      <Group
        x={COMPONENT_POSITIONS.icog.x}
        y={COMPONENT_POSITIONS.icog.y}
      >
        <ICOG
          x={0}
          y={0}
        />
      </Group>

    </Group>
  );
};


// ============================================================
// DASHED BLOCK BAY
// ============================================================

const BlockBay = ({
  x,
  y,
  width,
  height,
  label,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}) => {
  return (
    <Group
      x={x}
      y={y}
    >

      {/* Dashed rectangle */}

      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        stroke="#555"
        strokeWidth={4}
        dash={[12, 8]}
        // fill="rgba(200, 200, 200, 0.05)"
        listening={false}
      />

      {/* Label */}

      <Text
        x={15}
        y={15}
        text={label}
        fontSize={20}
        fontStyle="bold"
        fill="#555"
        listening={false}
      />

    </Group>
  );
};

// ============================================================
// SIX MVR CLUSTERS
// ============================================================

export const MVRLayout = () => {
  return (
    <Group>

      {/* ======================================================
          BLOCK 1
      ====================================================== */}

      <Group id="view-block-1">
        <Group
          x={MVR_CLUSTER_POSITIONS[0].x}
          y={MVR_CLUSTER_POSITIONS[0].y}
        >
          <MVRCluster />
        </Group>

        <Group
          x={MVR_CLUSTER_POSITIONS[1].x}
          y={MVR_CLUSTER_POSITIONS[1].y}
        >
          <MVRCluster />
        </Group>

        <Group
          x={MVR_CLUSTER_POSITIONS[2].x}
          y={MVR_CLUSTER_POSITIONS[2].y}
        >
          <MVRCluster
            threeFeeders
            clusterNumber={3}
          />
        </Group>

        <BlockBay
          x={BLOCK_BAYS.block1.x}
          y={BLOCK_BAYS.block1.y}
          width={BLOCK_BAY_WIDTH}
          height={BLOCK_BAY_HEIGHT}
          label="Block 1"
        />
      </Group>


      {/* ======================================================
          BLOCK 2
      ====================================================== */}

      <Group id="view-block-2">

        <Group
          x={MVR_CLUSTER_POSITIONS[3].x}
          y={MVR_CLUSTER_POSITIONS[3].y}
        >
          <MVRCluster />
        </Group>

        <Group
          x={MVR_CLUSTER_POSITIONS[4].x}
          y={MVR_CLUSTER_POSITIONS[4].y}
        >
          <MVRCluster />
        </Group>

        <Group
          x={MVR_CLUSTER_POSITIONS[5].x}
          y={MVR_CLUSTER_POSITIONS[5].y}
        >
          <MVRCluster
            threeFeeders
          />
        </Group>

        <BlockBay
          x={BLOCK_BAYS.block2.x}
          y={BLOCK_BAYS.block2.y}
          width={BLOCK_BAY_WIDTH}
          height={BLOCK_BAY_HEIGHT}
          label="Block 2"
        />
      </Group>


      {/* ======================================================
          AUX GRID
      ====================================================== */}

      <Group
        id="view-aux-grid"
        x={16700}
      >

        {/* Horizontal connection line */}

        <Group
          y={1600}
          x={-200}
        >
          <Line
            points={[
              -9365,
              500,
              1191,
              500,
            ]}
            stroke={BLACK}
            strokeWidth={2.2}
          />

          <Line
            points={[
              100,
              -1600,
              100,
              500,
            ]}
            stroke={BLACK}
            strokeWidth={2.2}
          />
        </Group>


        {/* Aux to side */}

        <Group
          x={-100}
          y={-150}
        >
          <Line
            points={[
              0,
              150,
              283,
              150,
            ]}
            stroke={BLACK}
            strokeWidth={2.2}
          />
        </Group>


        <Group
          x={312}
          y={-150}
        >
          <Line
            points={[
              0,
              150,
              683,
              150,
            ]}
            stroke={BLACK}
            strokeWidth={2.2}
          />
        </Group>


        {/* Vertical aux to bus */}

        <Group
          y={1600}
          x={894}
        >
          <Line
            points={[
              100,
              -1600,
              100,
              500,
            ]}
            stroke={BLACK}
            strokeWidth={2.2}
          />
        </Group>


        {/* Feeder 3 */}

        <Group
          y={1400}
          x={-4567}
        >
          <Line
            points={[
              -5000,
              -500,
              -5000,
              701,
            ]}
            stroke={BLACK}
            strokeWidth={2.2}
          />
        </Group>


        {/* Feeder 6 */}

        <Group
          y={1400}
          x={-367}
        >
          <Line
            points={[
              -800,
              -500,
              -800,
              701,
            ]}
            stroke={BLACK}
            strokeWidth={2.2}
          />
        </Group>


        <AuxSingleLineDiagram />

      </Group>

    </Group>
  );
};


/* =========================================================
   PROPS
========================================================= */

interface MVRClusterCanvasProps {
  id?: string;
  x?: number;
  y?: number;
}

/* =========================================================
   MVR CLUSTER
========================================================= */

export default function MVRClusterCanvas({
  id = "MVRCluster",
  x = 0,
  y = 0,
}: MVRClusterCanvasProps) {
  return (
    <Group
      id={id}
      x={x}
      y={y}
    >
      <MVRLayout />
    </Group>
  );
}