import React, { useRef, useEffect, useState } from "react";
import { Group, Circle, Line, Image as KonvaImage } from "react-konva";

/* =========================================================
   GLOBAL CACHES
========================================================= */
const transformer3PhaseImageCache = new Map<string, HTMLCanvasElement>();
const transformer3PhaseOffsetCache = new Map<string, { x: number; y: number }>();

interface TransformerProps {
  x: number;
  y: number;
  scale?: number;
}

const Transformer: React.FC<TransformerProps> = ({ 
  x, 
  y, 
  scale = 1 
}) => {
  const cacheKey = "transformer-3phase-static";
  const cachedImage = transformer3PhaseImageCache.get(cacheKey);
  const offset = transformer3PhaseOffsetCache.get(cacheKey);
  
  const heavyGroupRef = useRef<any>(null);
  const [isCached, setIsCached] = useState(!!cachedImage);

  /* =========================================================
     HIGH-RES LAZY CACHING EFFECT
     Rotation is applied to the heavyGroupRef so it gets 
     permanently baked into the cached canvas.
  ========================================================= */
  useEffect(() => {
    if (!isCached && heavyGroupRef.current) {
      // 1. Cache at 3x resolution. Rotation is baked in here!
      heavyGroupRef.current.cache({ pixelRatio: 3 });
      
      const node = heavyGroupRef.current;
      
      // 2. Extract the high-res canvas and exact bounding box offset
      const canvas = node.toCanvas({ pixelRatio: 3 });
      const offsetX = node.offsetX();
      const offsetY = node.offsetY();
      
      // 3. Save to global caches
      transformer3PhaseImageCache.set(cacheKey, canvas);
      transformer3PhaseOffsetCache.set(cacheKey, { x: offsetX, y: offsetY });
      
      // 4. Trigger re-render to use the lightweight image
      setIsCached(true);
    }
  }, [isCached, cacheKey]);

  return (
    /* 
      OUTER GROUP: 
      Handles x, y, and dynamic scale. 
      Rotation is REMOVED from here to prevent transform conflicts.
    */
    <Group x={x - 100} y={y - 70} scaleX={0.6} scaleY={0.6}>
      {isCached && cachedImage ? (
        /* 
          LIGHTWEIGHT RENDER: 
          The image is already rotated. We just apply the offset 
          to align it perfectly with the parent's coordinate system.
        */
        <KonvaImage
          image={cachedImage}
          x={offset?.x ?? 0}
          y={offset?.y ?? 0}
        />
      ) : (
        /* 
          HEAVY RENDER (Fallback): 
          Rotation is applied HERE so it gets baked into the cached image.
        */
        <Group ref={heavyGroupRef} rotation={270}>
          <TransformerInner />
        </Group>
      )}
    </Group>
  );
};

/* =========================================================
   INNER COMPONENT (Static Shapes Only)
   Contains no transforms. Purely for caching.
========================================================= */
function TransformerInner() {
  const stroke = "#222";
  const radius = 37;

  return (
    <Group>
      {/* Top phase */}
      <Circle
        x={0}
        y={-22}
        radius={radius}
        stroke={stroke}
        strokeWidth={2.5}
      />

      {/* Bottom-left phase */}
      <Circle
        x={-22}
        y={15}
        radius={radius}
        stroke={stroke}
        strokeWidth={2.5}
      />

      {/* Bottom-right phase */}
      <Circle
        x={22}
        y={15}
        radius={radius}
        stroke={stroke}
        strokeWidth={2.5}
      />

      {/* Top connection */}
      <Line
        points={[0, -59, 0, -100]}
        stroke={stroke}
        strokeWidth={2.5}
        lineCap="butt"
      />

      {/* Bottom-left connection */}
      <Line
        points={[-22, 52, -22, 93]}
        stroke={stroke}
        strokeWidth={2.5}
        lineCap="butt"
      />

      {/* Bottom-right connection */}
      <Line
        points={[22, 52, 22, 93]}
        stroke={stroke}
        strokeWidth={2.5}
        lineCap="butt"
      />
    </Group>
  );
}

export default Transformer;