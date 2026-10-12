// SymbolPreloader.tsx
import React, { useEffect, useRef } from 'react';
import { Stage, Layer, Group } from 'react-konva';
import { registerSymbol } from './symbolManager';

// Import all your 9-10 BASE components here
import PCSBase from './Base/PCSBase';
// import BreakerBase from './BreakerBase';
// import TransformerBase from './TransformerBase';
// ... add the rest

export function SymbolPreloader() {
  const pcsRef = useRef<any>(null);
  // const breakerRef = useRef<any>(null);
  // const transformerRef = useRef<any>(null);

  useEffect(() => {
    // Register each component type exactly once on mount
    if (pcsRef.current) registerSymbol('PCS', pcsRef.current);
    // if (breakerRef.current) registerSymbol('Breaker', breakerRef.current);
    // if (transformerRef.current) registerSymbol('Transformer', transformerRef.current);
  }, []);

  // Render completely off-screen and hidden so it never affects your UI layout
  return (
    <div style={{ position: 'absolute', top: -9999, left: -9999, pointerEvents: 'none', visibility: 'hidden' }}>
      <Stage width={200} height={200}>
        <Layer>
          <Group ref={pcsRef}>
            <PCSBase />
          </Group>
          {/* <Group ref={breakerRef}><BreakerBase /></Group> */}
          {/* <Group ref={transformerRef}><TransformerBase /></Group> */}
        </Layer>
      </Stage>
    </div>
  );
}