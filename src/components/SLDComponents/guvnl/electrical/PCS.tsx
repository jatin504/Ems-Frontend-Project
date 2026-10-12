import React, { useRef, useEffect, useState } from "react";
import { Group, Line, Rect, Text, Image as KonvaImage } from "react-konva";
import { Stroke } from "./constants";

/* =========================================================
   GLOBAL CACHES
   1. Image Cache: Stores the rendered canvas.
   2. Offset Cache: Stores the bounding box offset to prevent 
      position shifting when negative coordinates are used.
========================================================= */
const pcsImageCache = new Map<string, HTMLCanvasElement>();
const pcsOffsetCache = new Map<string, { x: number; y: number }>();

interface PCSProps {
  x: number;
  y: number;
  size?: number;
  scale?: number;
  label?: string;
  outlineColor?: string;
  rightFillColor?: string;
}

// Standard size for caching. Scaling this is much more efficient 
// than caching a new canvas for every possible 'size' value.
const BASE_SIZE = 100;

export default function PCS({
  x,
  y,
  size = 64,
  scale = 1,
  label = "5 MW",
  outlineColor = "#60A5FA",
  rightFillColor = "#AAF6EE",
}: PCSProps) {
  const cacheKey = `pcs-${outlineColor}-${rightFillColor}`;
  const cachedImage = pcsImageCache.get(cacheKey);
  const offset = pcsOffsetCache.get(cacheKey);
  
  const heavyGroupRef = useRef<any>(null);
  const [isCached, setIsCached] = useState(!!cachedImage);

  // Calculate the scale needed to transform the BASE_SIZE (100) to the requested 'size'
  const sizeScale = size / BASE_SIZE;

  /* =========================================================
     LAZY CACHING EFFECT
     Renders the heavy vectors once at BASE_SIZE, captures the 
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
      pcsImageCache.set(cacheKey, canvas);
      pcsOffsetCache.set(cacheKey, { x: offsetX, y: offsetY });
      
      // 4. Trigger re-render to use the lightweight image
      setIsCached(true);
    }
  }, [isCached, cacheKey]);

  return (
    /* 
      OUTER GROUP: 
      Handles the parent's x, y, and the user's 'scale' prop.

      x = -7
      y = -20
    */
    <Group x={x - 8} y={y - 20} scaleX={scale} scaleY={scale}>
      {isCached && cachedImage ? (
        /* 
          LIGHTWEIGHT RENDER: 
          Applies the saved offset to prevent position shifting, 
          and sizeScale to match the requested dimensions.
        */
        <KonvaImage
          image={cachedImage}
          x={offset?.x ?? 0}
          y={offset?.y ?? 0}
          scaleX={sizeScale}
          scaleY={sizeScale}
        />
      ) : (
        /* 
          HEAVY RENDER (Fallback): 
          Runs exactly once per color variant at BASE_SIZE to generate the cache.
        */
        <Group ref={heavyGroupRef}>
          <PCSInner 
            size={BASE_SIZE} 
            outlineColor={outlineColor} 
            rightFillColor={rightFillColor} 
          />
        </Group>
      )}

      {/* 
        DYNAMIC LABEL OVERLAY: 
        Rendered live so it can update without busting the cache.
        Its coordinates are calculated based on the requested 'size', 
        and it will be scaled by the outer Group's 'scale' prop, 
        perfectly matching the original behavior.
      */}
      {label && (
        <Text
          x={0}
          y={size + size * 0.12}
          width={size}
          text={label}
          fontSize={Math.max(7, size * 0.13)}
          fontFamily="Arial"
          fontStyle="bold"
          align="center"
          fill={Stroke}
          listening={false}
        />
      )}
    </Group>
  );
}

/* =========================================================
   INNER COMPONENT (Static Shapes Only)
   Contains no x, y, scale, or label logic. Purely for caching.
========================================================= */
function PCSInner({
  size,
  outlineColor,
  rightFillColor,
}: {
  size: number;
  outlineColor: string;
  rightFillColor: string;
}) {
  const radius = size * 0.10;
  const strokeWidth = Math.max(1.5, size * 0.035);
  const center = size / 2;
  const symbolSize = size * 0.32;

  return (
    <Group>
      {/* ==========================================
          AC connection - top
         ========================================== */}
      <Line
        points={[center, -size * 0.40, center, 0]}
        stroke={Stroke}
        strokeWidth={Math.max(1, size * 0.018)}
      />

      {/* ==========================================
          Right-side light fill (Polygon)
         ========================================== */}
      <Line
        points={[size, 0, size, size, 0, size]}
        closed
        fill={rightFillColor}
        strokeEnabled={false}
      />

      {/* ==========================================
          PCS outer body
         ========================================== */}
      <Rect
        x={0}
        y={0}
        width={size}
        height={size}
        cornerRadius={radius}
        fill="white"
        stroke={outlineColor}
        strokeWidth={strokeWidth}
      />

      {/* ==========================================
          Right region fill (inside border)
         ========================================== */}
      <Line
        points={[
          size - strokeWidth,
          strokeWidth,
          size - strokeWidth,
          size - strokeWidth,
          strokeWidth,
          size - strokeWidth,
        ]}
        closed
        fill={rightFillColor}
        strokeEnabled={false}
      />

      {/* ==========================================
          Diagonal: TOP-RIGHT → BOTTOM-LEFT
         ========================================== */}
      <Line
        points={[size, 0, 0, size]}
        stroke={outlineColor}
        strokeWidth={strokeWidth}
        lineCap="round"
        lineJoin="round"
      />

      {/* ==========================================
          AC "~" (Left / upper region)
         ========================================== */}
      <Text
        x={size * 0.10}
        y={size * 0.16}
        width={size * 0.38}
        text="~"
        fontSize={symbolSize}
        fontFamily="Arial"
        fontStyle="bold"
        align="center"
        fill={outlineColor}
      />

      {/* ==========================================
          DC "+" (Right / lower region)
         ========================================== */}
      <Text
        x={size * 0.55}
        y={size * 0.50}
        width={size * 0.30}
        text="+"
        fontSize={symbolSize * 0.85}
        fontFamily="Arial"
        fontStyle="bold"
        align="center"
        fill={outlineColor}
      />

      {/* ==========================================
          DC connection - bottom
         ========================================== */}
      <Line
        points={[center, size, center, size + size * 0.40]}
        stroke={Stroke}
        strokeWidth={Math.max(1, size * 0.018)}
      />
    </Group>
  );
}