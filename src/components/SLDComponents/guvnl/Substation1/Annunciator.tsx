import React, { useRef, useEffect, useState } from "react";
import { Group, Rect, Text, Image as KonvaImage } from "react-konva";

import { BLUE } from "../electrical/constants";

/* =========================================================
   GLOBAL CACHES
   Since this 2x6 component is 100% static, we only need ONE 
   high-resolution cache entry for the entire application.
========================================================= */
const annunciator2x6ImageCache = new Map<string, HTMLCanvasElement>();
const annunciator2x6OffsetCache = new Map<string, { x: number; y: number }>();

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
  const cacheKey = "annunciator-2x6-static";
  const cachedImage = annunciator2x6ImageCache.get(cacheKey);
  const offset = annunciator2x6OffsetCache.get(cacheKey);
  
  const heavyGroupRef = useRef<any>(null);
  const [isCached, setIsCached] = useState(!!cachedImage);

  /* =========================================================
     HIGH-RES LAZY CACHING EFFECT
     Uses pixelRatio: 3 to ensure the 11px text and shadows 
     remain perfectly crisp and don't blur when scaled up.
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
      annunciator2x6ImageCache.set(cacheKey, canvas);
      annunciator2x6OffsetCache.set(cacheKey, { x: offsetX, y: offsetY });
      
      // 4. Trigger re-render to use the lightweight image
      setIsCached(true);
    }
  }, [isCached, cacheKey]);

  return (
    /* 
      OUTER GROUP: 
      Handles the parent's x, y, and scale.
    */
    <Group x={x} y={y} scaleX={scale} scaleY={scale}>
      {isCached && cachedImage ? (
        /* 
          LIGHTWEIGHT RENDER: 
          Applies the saved offset to prevent position shifting.
          Replaces 36 nodes with 1 high-res node.
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
  const rows = 2;
  const cols = 6;
  const cellWidth = 28;
  const cellHeight = 27;
  const cellGap = 3;
  const padding = 5;

  // =========================
  // WINDOW COLORS
  // =========================
  const windowColors = [
    "#4CAF50", // 1  Green
    "#4CAF50", // 2  Green
    "#FF9800", // 3  Orange
    "#F44336", // 4  Red
    "#4CAF50", // 5  Green
    "#FF9800", // 6  Orange
    "#4CAF50", // 7  Green
    "#F44336", // 8  Red
    "#FF9800", // 9  Orange
    "#4CAF50", // 10 Green
    "#F44336", // 11 Red
    "#4CAF50", // 12 Green
  ];

  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <Group>
      {/* =========================
          MAIN ANNUNCIATOR BOX
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
          WINDOWS 1 - 12
          2 ROWS × 6 COLUMNS
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