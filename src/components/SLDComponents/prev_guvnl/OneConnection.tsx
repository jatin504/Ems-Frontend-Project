import React, { useRef, useState } from "react";
import { Stage, Layer, Group, Rect, Text, Line } from "react-konva";
import Konva from "konva";

import ICOG from "./ICOG/ICOG";
import PCSFeeder from "./PCSFeeder/PCSFeeder";
import { PCSBlock } from "./PCSBlock/PCSBlock";
import Wire from "./PCSFeeder/Wire";
import { BLACK, RED } from "./electrical/constants";
import SingleLineDiagram from "./Auxilary/SingleLineDiagram";

// ============================================================
// MVR CLUSTER SIZE
// ============================================================

const MVR_CLUSTER_WIDTH = 1250;
const MVR_CLUSTER_HEIGHT = 1500;

// ============================================================
// MVR CLUSTER POSITIONS
//
// 6 MVR Clusters arranged horizontally.
// Same spacing between every cluster.
// ============================================================

const MVR_CLUSTER_GAP = 150;

const MVR_CLUSTER_POSITIONS = [
  {
    x: 0,
    y: 0,
  },
  {
    x: MVR_CLUSTER_WIDTH + MVR_CLUSTER_GAP,
    y: 0,
  },
  {
    x: (MVR_CLUSTER_WIDTH + MVR_CLUSTER_GAP) * 2,
    y: 0,
  },
  {
    x: (MVR_CLUSTER_WIDTH + MVR_CLUSTER_GAP) * 3,
    y: 0,
  },
  {
    x: (MVR_CLUSTER_WIDTH + MVR_CLUSTER_GAP) * 4,
    y: 0,
  },
  {
    x: (MVR_CLUSTER_WIDTH + MVR_CLUSTER_GAP) * 5,
    y: 0,
  },
];

// ============================================================
// FIXED COMPONENT POSITIONS
// ============================================================

const COMPONENT_POSITIONS = {
  pcsBlock1: {
    x: -39,
    y: 1214,
  },

  pcsBlock2: {
    x: 614,
    y: 1214,
  },

  pcsFeeder1: {
    x: 100,
    y: 430,
  },

  pcsFeeder2: {
    x: 750,
    y: 430,
  },

  threeFeeder: {
    pcsBlock1: {
    x: -129,
    y: 1214,
  },

  pcsBlock2: {
    x: 374,
    y: 1214,
  },

  pcsFeeder1: {
    x: 10,
    y: 430,
  },

  pcsFeeder2: {
    x: 500,
    y: 430,
  },
  // Third feeder close to feeder 1 and 2
  pcsFeeder3: {
    x: 780,
    y: 430,
  },
  },

  icog: {
    x: 182,
    y: -272,
  },
};

// ============================================================
// BLOCK BAY SIZE
//
// Change these values whenever you want the dashed bays
// to become larger/smaller.
// ============================================================

const BLOCK_BAY_WIDTH = 4200;
const BLOCK_BAY_HEIGHT = 2450;

// ============================================================
// BLOCK BAY POSITIONS
// ============================================================

const BLOCK_BAYS = {
  block1: {
    x: -200,
    y: -500,
  },

  block2: {
    x: 4050,
    y: -500,
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

const MVRCluster = ({
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
        x={-100}
        y={-400}
        width={MVR_CLUSTER_WIDTH}
        height={MVR_CLUSTER_HEIGHT}
        stroke="red"
        strokeWidth={1}
        listening={false}
      />

      <Text
        x={-100}
        y={-420}
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
          428,
          1130,
          428,
        ]}
        color={RED}
        width={1}
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
        strokeWidth={2}
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

      {/* MVR CLUSTER 1 */}
      <Group
        x={MVR_CLUSTER_POSITIONS[0].x}
        y={MVR_CLUSTER_POSITIONS[0].y}
      >
        <MVRCluster />
      </Group>

      {/* MVR CLUSTER 2 */}
      <Group
        x={MVR_CLUSTER_POSITIONS[1].x}
        y={MVR_CLUSTER_POSITIONS[1].y}
      >
        <MVRCluster />
      </Group>

      {/* MVR CLUSTER 3 - 3 PCS FEEDERS, NO PCS BLOCK */}
      <Group
        x={MVR_CLUSTER_POSITIONS[2].x}
        y={MVR_CLUSTER_POSITIONS[2].y}
      >
        <MVRCluster threeFeeders clusterNumber={3}/>
      </Group>

      {/* MVR CLUSTER 4 */}
      <Group
        x={MVR_CLUSTER_POSITIONS[3].x}
        y={MVR_CLUSTER_POSITIONS[3].y}
      >
        <MVRCluster />
      </Group>

      {/* MVR CLUSTER 5 */}
      <Group
        x={MVR_CLUSTER_POSITIONS[4].x}
        y={MVR_CLUSTER_POSITIONS[4].y}
      >
        <MVRCluster />
      </Group>

      {/* MVR CLUSTER 6 - 3 PCS FEEDERS, NO PCS BLOCK */}
      <Group
        x={MVR_CLUSTER_POSITIONS[5].x}
        y={MVR_CLUSTER_POSITIONS[5].y}
      >
        <MVRCluster threeFeeders />
      </Group>


      {/* ======================================================
          BLOCK 1
          ====================================================== */}

      <BlockBay
        x={BLOCK_BAYS.block1.x}
        y={BLOCK_BAYS.block1.y}
        width={BLOCK_BAY_WIDTH}
        height={BLOCK_BAY_HEIGHT}
        label="Block 1"
      />

      {/* ======================================================
          BLOCK 2
          ====================================================== */}

      <BlockBay
        x={BLOCK_BAYS.block2.x}
        y={BLOCK_BAYS.block2.y}
        width={BLOCK_BAY_WIDTH}
        height={BLOCK_BAY_HEIGHT}
        label="Block 2"
      />


      {/* Auxaliary */}
      <Group
            x={8500}
          >
            {/* Horizontal connection line */}

      <Group
        y={1600}
        x={-200}
      >
        <Line
          points={[-4565, 150, 791, 150]}
          stroke={BLACK}
          strokeWidth={1.2}
        />

        {/* Left vertical line */}
        <Line
          points={[100, -1600, 100, 150]}
          stroke={BLACK}
          strokeWidth={1.2}
        />
      </Group>

      {/* aux to side */}
      <Group
        x={-100}
        y={-150}
      >
        <Line
          points={[0, 150, 283, 150]}
          stroke={BLACK}
          strokeWidth={1.2}
        />
      </Group>
      <Group
        x={312}
        y={-150}
      >
        <Line
          points={[0, 150, 283, 150]}
          stroke={BLACK}
          strokeWidth={1.2}
        />
      </Group>

      {/* vertical aux to bus */}
      <Group
        y={1600}
        x={492}
      >
      <Line
          points={[100, -1600, 100, 150]}
          stroke={BLACK}
          strokeWidth={1.2}
        />
      </Group>
      

      {/* feeder 3 conn */}
      <Group
        y={1400}
        x={-4867}
      >
        <Line
          points={[100, 0, 100, 351]}
          stroke={BLACK}
          strokeWidth={1.2}
        />
      </Group>

        {/* feeder 6 conn */}
      <Group
        y={1400}
        x={-667}
      >
        <Line
          points={[100, 0, 100, 351]}
          stroke={BLACK}
          strokeWidth={1.2}
        />
      </Group>


      
      <SingleLineDiagram />
      

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