import React, { useRef, useEffect, useState } from "react";
import { Group, Rect, Text, Image as KonvaImage } from "react-konva";
import { BLUE } from "../electrical/constants";

/* =========================================================
   GLOBAL CACHES
   Since this component is 100% static, we only need ONE 
   cache entry for the entire application.
========================================================= */
const annunciatorImageCache = new Map<string, HTMLCanvasElement>();
const annunciatorOffsetCache = new Map<string, { x: number; y: number }>();

interface AnnunciatorProps {
  x: number;
  y: number;
  scale?: number;
}

const Annunciator: React.FC<AnnunciatorProps> = ({
  x,
  y,
  scale = 1,
}) => {
  const cacheKey = "annunciator-static";
  const cachedImage = annunciatorImageCache.get(cacheKey);
  const offset = annunciatorOffsetCache.get(cacheKey);
  
  const heavyGroupRef = useRef<any>(null);
  const [isCached, setIsCached] = useState(!!cachedImage);

  /* =========================================================
     LAZY CACHING EFFECT
     Renders the 72 heavy nodes exactly once, captures the 
     canvas AND the bounding box offset, then swaps to image.
  ========================================================= */
  useEffect(() => {
    if (!isCached && heavyGroupRef.current) {
      // 1. Force Konva to calculate bounds and set offsetX/offsetY
      heavyGroupRef.current.cache();
      
      const node = heavyGroupRef.current;
      
      // 2. Extract canvas and exact offset
      const canvas = node.toCanvas();
      const offsetX = node.offsetX();
      const offsetY = node.offsetY();
      
      // 3. Save to global caches
      annunciatorImageCache.set(cacheKey, canvas);
      annunciatorOffsetCache.set(cacheKey, { x: offsetX, y: offsetY });
      
      // 4. Trigger re-render to use the lightweight image
      setIsCached(true);
    }
  }, [isCached, cacheKey]);

  return (
    /* 
      OUTER GROUP: 
      Handles the parent's x, y, and scale.

      scaled fixed to 1.5 instead 2.2 (in parent)
    */
    <Group x={x} y={y} scaleX={1.5} scaleY={1.5}>
      {isCached && cachedImage ? (
        /* 
          LIGHTWEIGHT RENDER: 
          Applies the saved offset to prevent position shifting.
          Replaces 72 nodes with 1 node.
        */
        <KonvaImage
          image={cachedImage}
          x={offset?.x ?? 0}
          y={offset?.y ?? 0}
        />
      ) : (
        /* 
          HEAVY RENDER (Fallback): 
          Runs exactly once globally to generate the cache.
        */
        <Group ref={heavyGroupRef}>
          <AnnunciatorInner />
        </Group>
      )}
    </Group>
  );
};

/* =========================================================
   INNER COMPONENT (Static Shapes Only)
   Contains no x, y, or scale logic. Purely for caching.
========================================================= */
function AnnunciatorInner() {
  // =========================
  // TABLE CONFIGURATION
  // =========================
  const rows = 3;
  const cols = 8;
  const cellWidth = 28;
  const cellHeight = 27;
  const cellGap = 3;
  const padding = 5;

  // =========================
  // WINDOW COLORS
  // =========================
  const windowColors = [
    "#4CAF50", "#4CAF50", "#FF9800", "#F44336", "#4CAF50", "#FF9800", "#4CAF50", "#F44336",
    "#4CAF50", "#F44336", "#FF9800", "#4CAF50", "#4CAF50", "#F44336", "#FF9800", "#4CAF50",
    "#F44336", "#4CAF50", "#FF9800", "#4CAF50", "#F44336", "#4CAF50", "#FF9800", "#4CAF50",
  ];

  const numbers = Array.from({ length: 24 }, (_, i) => i + 1);

  return (
    <Group>
      {/* =========================
          MAIN ANNUNCIATOR BOX
          (Kept commented out as in your original code)
          ========================= */}
      {/* <Rect
        x={0}
        y={0}
        width={cols * cellWidth + (cols - 1) * cellGap + padding * 2}
        height={rows * cellHeight + (rows - 1) * cellGap + padding * 2}
        cornerRadius={7}
        stroke={BLUE}
        strokeWidth={1.5}
        fill="#F8FAFC"
        shadowColor="#000000"
        shadowBlur={5}
        shadowOffset={{ x: 0, y: 2 }}
        shadowOpacity={0.15}
      /> */}

      {/* =========================
          WINDOWS 1 - 24
          3 ROWS × 8 COLUMNS
          ========================= */}
      {numbers.map((num, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;

        const cellX = padding + col * (cellWidth + cellGap);
        const cellY = padding + row * (cellHeight + cellGap);
        const color = windowColors[index];

        return (
          <Group key={num}>
            {/* Window */}
            <Rect
              x={cellX}
              y={cellY}
              width={cellWidth}
              height={cellHeight}
              cornerRadius={4}
              fill={color}
              stroke={BLUE}
              strokeWidth={0.8}
              shadowColor="#000000"
              shadowBlur={2}
              shadowOffset={{ x: 0, y: 1 }}
              shadowOpacity={0.2}
            />

            {/* Number */}
            <Text
              x={cellX}
              y={cellY + 7}
              width={cellWidth}
              text={String(num)}
              fontSize={11}
              fontFamily="Arial"
              fontStyle="bold"
              align="center"
              fill="#FFFFFF"
            />
          </Group>
        );
      })}
    </Group>
  );
}

export default Annunciator;