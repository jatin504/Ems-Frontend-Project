// CachedAuxSingleLineDiagram.tsx
import React, { useRef, useEffect, useState } from "react";
import { Group, Image as KonvaImage } from "react-konva";
import AuxSingleLineDiagram from "./AuxSingleLineDiagram"; // Adjust path if needed

/* =========================================================
   GLOBAL CACHE
========================================================= */
const auxDiagramCache = new Map<string, HTMLCanvasElement>();

export default function CachedAuxSingleLineDiagram() {
  const cacheKey = "aux-single-line-diagram";
  const cachedImage = auxDiagramCache.get(cacheKey);
  
  const groupRef = useRef<any>(null);
  const [isCached, setIsCached] = useState(!!cachedImage);

  /* =========================================================
     LAZY CACHING EFFECT
     Wraps the heavy component, caches it exactly as it renders, 
     and swaps it for a lightweight image.
  ========================================================= */
  useEffect(() => {
    if (!isCached && groupRef.current) {
      groupRef.current.cache();
      const canvas = groupRef.current.toCanvas();
      auxDiagramCache.set(cacheKey, canvas);
      setIsCached(true);
    }
  }, [isCached, cacheKey]);

  return (
    <Group>
      {isCached && cachedImage ? (
        <KonvaImage image={cachedImage} />
      ) : (
        /* 
          The original component is rendered exactly as-is 
          inside this ref group to generate the cache.
        */
        <Group ref={groupRef}>
          <AuxSingleLineDiagram />
        </Group>
      )}
    </Group>
  );
}