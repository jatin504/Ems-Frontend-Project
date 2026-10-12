import React, { useRef, useEffect, useState } from "react";
import { Group, Circle, Rect, Text, Image as KonvaImage } from "react-konva";

import Wire from "./Wire";
// import GroundSymbol from "./GroundSymbol";
import { BLACK, BLUE } from "../electrical/constants";

/* =========================================================
   GLOBAL CACHES
   Since this component is 100% static, we only need ONE 
   high-resolution cache entry for the entire application.
========================================================= */
const measurementBranchImageCache = new Map<string, HTMLCanvasElement>();
const measurementBranchOffsetCache = new Map<string, { x: number; y: number }>();

interface MeasurementBranchProps {
  x: number;
  y: number;
  scale?: number;
}

const MeasurementBranch: React.FC<MeasurementBranchProps> = ({ 
  x, 
  y, 
  scale = 1 
}) => {
  const cacheKey = "measurement-branch-static";
  const cachedImage = measurementBranchImageCache.get(cacheKey);
  const offset = measurementBranchOffsetCache.get(cacheKey);
  
  const heavyGroupRef = useRef<any>(null);
  const [isCached, setIsCached] = useState(!!cachedImage);

  /* =========================================================
     HIGH-RES LAZY CACHING EFFECT
     Uses pixelRatio: 3 to ensure the text and lines remain 
     perfectly crisp and don't blur when scaled up.
  ========================================================= */
  useEffect(() => {
    if (!isCached && heavyGroupRef.current) {
      // 1. Cache at 3x resolution for ultra-crisp scaling
      heavyGroupRef.current.cache({ pixelRatio: 3 });
      
      const node = heavyGroupRef.current;
      
      // 2. Extract the high-res canvas and exact bounding box offset
      const canvas = node.toCanvas({ pixelRatio: 3 });
      const offsetX = node.offsetX();
      const offsetY = node.offsetY();
      
      // 3. Save to global caches
      measurementBranchImageCache.set(cacheKey, canvas);
      measurementBranchOffsetCache.set(cacheKey, { x: offsetX, y: offsetY });
      
      // 4. Trigger re-render to use the lightweight image
      setIsCached(true);
    }
  }, [isCached, cacheKey]);

  return (
    /* 
      OUTER GROUP: 
      Handles the parent's x, y, and scale.

      scaled fix to 1 (in parent was 3)
      x = -20
      y = +120
    */
    <Group x={x - 20} y={y + 120} scaleX={1} scaleY={1}>
      {isCached && cachedImage ? (
        /* 
          LIGHTWEIGHT RENDER: 
          Applies the saved offset to prevent position shifting.
          The high pixelRatio ensures it stays sharp when scaled.
        */
        <KonvaImage
          image={cachedImage}
          x={offset?.x ?? 0}
          y={offset?.y ?? 0}
        />
      ) : (
        /* 
          HEAVY RENDER (Fallback): 
          Runs exactly once globally to generate the high-res cache.
        */
        <Group ref={heavyGroupRef}>
          <MeasurementBranchInner />
        </Group>
      )}
    </Group>
  );
};

/* =========================================================
   INNER COMPONENT (Static Shapes Only)
   Contains no x, y, or scale logic. Purely for caching.
========================================================= */
function MeasurementBranchInner() {
  return (
    <Group>
      {/* vertical */}
      {/* <Wire points={[0, 0, 0, 40]} /> */}

      {/* CT */}
      <Circle
        x={0}
        y={57}
        radius={6}
        stroke={BLACK}
        strokeWidth={1}
        fill="white"
      />

      {/* horizontal */}
      <Wire points={[0, 50, 100, 50]} />

      {/* ground */}
      {/* <GroundSymbol x={28} y={5} /> */}

      {/* TCP/IP */}
      {/* <Text x={85} y={5} text="TCP/IP" fontSize={13} fill={BLUE} /> */}

      {/* MFM */}
      <Rect
        x={68}
        y={40}
        width={36}
        height={15}
        stroke={BLUE}
        strokeWidth={1.5}
        fill="white"
      />

      <Text
        x={68}
        y={42}
        width={36}
        text="MFM"
        fontSize={11}
        align="center"
        fill={BLUE}
      />

      {/* BUS PT */}
      {/* <Rect
        x={105}
        y={47}
        width={58}
        height={15}
        stroke={BLUE}
        strokeWidth={1}
        fill="white"
      />

      <Text
        x={105}
        y={48}
        width={58}
        text="BUS PT"
        fontSize={11}
        align="center"
        fill={BLUE}
      /> */}
    </Group>
  );
}

export default MeasurementBranch;