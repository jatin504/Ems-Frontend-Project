import React, { useRef, useEffect, useState } from "react";
import { Group, Circle, Line, Image as KonvaImage } from "react-konva";
import StarSymbol from "./StarSymbol";

/* =========================================================
   GLOBAL CACHE
   Keys are based on colors. Survives page navigation, so 
   it only ever renders the heavy vectors once per color variant.
========================================================= */
const transformerCache = new Map<string, HTMLCanvasElement>();

interface TransformerProps {
  x: number;
  y: number;
  scale?: number;
  outlineColor?: string;
  fillColor?: string;
}

export default function Transformer({
  x,
  y,
  scale = 1,
  outlineColor = "#90B800",
  fillColor = "#D9EFBD",
}: TransformerProps) {
  // Unique key for this specific styling variant
  const cacheKey = `transformer-${outlineColor}-${fillColor}`;
  const cachedImage = transformerCache.get(cacheKey);
  
  const heavyGroupRef = useRef<any>(null);
  const [isCached, setIsCached] = useState(!!cachedImage);

  /* =========================================================
     LAZY CACHING EFFECT
     Runs only ONCE per color variant. Converts heavy vectors 
     (including nested StarSymbols) to a lightweight bitmap.
  ========================================================= */
  useEffect(() => {
    if (!isCached && heavyGroupRef.current) {
      // 1. Tell Konva to calculate the bounding box
      heavyGroupRef.current.cache();
      
      // 2. Extract the canvas and store it globally
      const canvas = heavyGroupRef.current.toCanvas();
      transformerCache.set(cacheKey, canvas);
      
      // 3. Trigger re-render to switch to the lightweight KonvaImage
      setIsCached(true);
    }
  }, [isCached, cacheKey]);

  return (
    /* 
      OUTER GROUP: 
      Handles positioning and scaling. This remains live and lightweight.

      As cached images positions are disturbed so we'll fix it
      x = -110
      y = -90
    */
    <Group x={x - 110} y={y - 90} scaleX={scale} scaleY={scale} zIndex={10}>
      {isCached && cachedImage ? (
        /* 
          LIGHTWEIGHT RENDER: 
          A single image node. Replaces 10+ Konva nodes.
        */
        <KonvaImage image={cachedImage} />
      ) : (
        /* 
          HEAVY RENDER (Fallback): 
          Runs exactly once per color variant to generate the cache.
        */
        <Group ref={heavyGroupRef}>
          <TransformerInner outlineColor={outlineColor} fillColor={fillColor} />
        </Group>
      )}
    </Group>
  );
}

/* =========================================================
   INNER COMPONENT (Static Shapes Only)
   Contains no x, y, or scale logic. Purely for caching.
========================================================= */
function TransformerInner({
  outlineColor,
  fillColor,
}: {
  outlineColor: string;
  fillColor: string;
}) {
  const outerRadius = 47;
  const outlineWidth = 1.6;
  const windingWidth = 1.3;

  return (
    <Group>
      {/* ==========================================
          Main transformer body
         ========================================== */}
      <Circle
        x={0}
        y={0}
        radius={outerRadius}
        fill={fillColor}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
      />

      {/* ==========================================
          HV winding circles
         ========================================== */}
      <Circle
        x={-42}
        y={35}
        radius={18}
        fill="white"
        stroke={outlineColor}
        strokeWidth={windingWidth}
      />

      <Circle
        x={42}
        y={35}
        radius={18}
        fill="white"
        stroke={outlineColor}
        strokeWidth={windingWidth}
      />

      {/* ==========================================
          LV winding circles
         ========================================== */}
      <Circle
        x={-14}
        y={40}
        radius={18}
        fill="white"
        stroke={outlineColor}
        strokeWidth={windingWidth}
      />

      <Circle
        x={14}
        y={40}
        radius={18}
        fill="white"
        stroke={outlineColor}
        strokeWidth={windingWidth}
      />

      {/* ==========================================
          HV Delta
         ========================================== */}
      <Line
        points={[-17, -4, 0, -28, 18, -4, -17, -4]}
        closed
        fill={outlineColor}
        stroke={outlineColor}
        strokeWidth={1.2}
        lineJoin="round"
      />

      {/* ==========================================
          Y / Star symbols
         ========================================== */}
      <StarSymbol x={-42} y={35} color={outlineColor} />
      <StarSymbol x={42} y={35} color={outlineColor} />
      <StarSymbol x={-14} y={40} color={outlineColor} />
      <StarSymbol x={14} y={40} color={outlineColor} />
    </Group>
  );
}