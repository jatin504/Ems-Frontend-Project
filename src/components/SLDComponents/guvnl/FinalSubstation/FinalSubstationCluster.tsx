import React, { useRef, useEffect, useState } from "react";
import { Group, Line, Image as KonvaImage } from "react-konva";
import FinalSubstationLayout from "./FinalSubtation";

/* =========================================================
   GLOBAL CACHE
   Since the internal layout never changes, we only need 
   one cache entry for the entire app. Survives navigation.
========================================================= */
const finalSubstationCache = new Map<string, HTMLCanvasElement>();

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
  const cacheKey = "final-substation-cluster";
  const cachedImage = finalSubstationCache.get(cacheKey);
  
  const groupRef = useRef<any>(null);
  const [isCached, setIsCached] = useState(!!cachedImage);

  /* =========================================================
     LAZY CACHING EFFECT
     Runs only ONCE globally. Caches the entire internal 
     arrangement, then swaps to a lightweight image.
  ========================================================= */
  useEffect(() => {
    if (!isCached && groupRef.current) {
      // 1. Cache the entire group with all its children
      groupRef.current.cache();
      
      // 2. Extract the canvas and store it globally
      const canvas = groupRef.current.toCanvas();
      finalSubstationCache.set(cacheKey, canvas);
      
      // 3. Trigger re-render to use the lightweight image
      setIsCached(true);
    }
  }, [isCached, cacheKey]);

  return (
    <Group id={id} x={x} y={y}>
      {isCached && cachedImage ? (
        /* 
          LIGHTWEIGHT RENDER: 
          A single image that perfectly matches the original arrangement.
          The parent Group still handles the x/y positioning and ID.
        */
        <KonvaImage image={cachedImage} />
      ) : (
        /* 
          HEAVY RENDER (Fallback): 
          Your EXACT original arrangement, untouched. 
          Runs only once globally to generate the cache.
        */
        <Group ref={groupRef}>
          {/* =================================================
              SUBSTATION 1
          ================================================= */}
          <Group id={`${id}-1`} x={SUBSTATION_1.x} y={SUBSTATION_1.y}>
            <FinalSubstationLayout id="Substation-1" lineNumber={1} />
          </Group>

          {/* =================================================
              SUBSTATION 2
          ================================================= */}
          <Group id={`${id}-2`} x={SUBSTATION_2.x} y={SUBSTATION_2.y}>
            <FinalSubstationLayout id="Substation-2" lineNumber={2} />
          </Group>

          {/* =================================================
              INTERCONNECTION
          ================================================= */}
          <Line
            points={[2500, -370, 7500, -370]}
            stroke="#ff0000"
            strokeWidth={5}
            listening={false}
          />
        </Group>
      )}
    </Group>
  );
}