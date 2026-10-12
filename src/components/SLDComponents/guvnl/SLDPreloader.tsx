// SLDPreloader.tsx
import React from "react";
import { Stage, Layer, Group } from "react-konva";
import FinalSubstationCluster from "./FinalSubstation/FinalSubstationCluster";
import { MVRCluster } from "./AllMVRPannelsCluster";
import CachedAuxSingleLineDiagram from "./Auxilary/CachedAuxSingleLineDiagram";


export default function SLDPreloader() {
  return (
    /* 
      Completely hidden from the user. 
      Does not affect layout, scroll, or pointer events.
    */
    <div
      style={{
        position: "absolute",
        top: -9999,
        left: -9999,
        width: 1,
        height: 1,
        overflow: "hidden",
        visibility: "hidden",
        pointerEvents: "none",
      }}
    >
      <Stage width={100} height={100}>
        <Layer>
          {/* 1. Cache the Final Substation Cluster (Only 1 variant exists) */}
          <Group>
            <FinalSubstationCluster />
          </Group>

          {/* 2. Cache MVR Cluster Variants */}
          
          {/* Variant A: Standard Cluster (Used in Block 1 & 2) */}
          <Group x={200}>
            <MVRCluster threeFeeders={false} clusterNumber={1} />
          </Group>

          {/* Variant B: Three Feeder Cluster, Cluster 3 (Used in Block 1) */}
          <Group x={400}>
            <MVRCluster threeFeeders={true} clusterNumber={3} />
          </Group>

          {/* Variant C: Three Feeder Cluster, Default (Used in Block 2) */}
          <Group x={600}>
            <MVRCluster threeFeeders={true} clusterNumber={1} />
          </Group>
        
        {/* Aux to Grid */}
          <Group x={800}>
            <CachedAuxSingleLineDiagram />
          </Group>
        </Layer>
      </Stage>
    </div>
  );
}