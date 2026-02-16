import React from 'react';
import { Box } from '@chakra-ui/react';
import { PiSolarPanelFill } from 'react-icons/pi';
import { AiFillThunderbolt } from 'react-icons/ai';
import { IconContext } from 'react-icons';
import { Stage, Layer, Line, Group, Rect, Text as KText } from 'react-konva';

type Pt = { x: number; y: number };

export default function EnergyFlowCardSVG(): React.ReactElement {
  const dummy = { solarKw: 2.4, gridKw: 1.2, battkW: 0 };

  // ---- FIXED POSITIONS (from your logs) ----
  const TITLE: Pt = { x: 17, y: 28 };

  const SOLAR_BOX: Pt   = { x: 49,  y: 125 };
  const GRID_BOX: Pt    = { x: 322, y: 125 };
  const BATTERY_BOX: Pt = { x: 175, y: 240 };

  const LINE_SOLAR_MID: Pt       = { x: 126, y: 159 };
  const LINE_DOWN_TO_BATT: Pt    = { x: 207, y: 161 };
  const LINE_MID_TO_GRID: Pt     = { x: 237, y: 158 };
  const LINE_VERTICAL_SUPPORT: Pt = { x: 236, y: 157 };

  // ---- Dimensions (slightly smaller height) ----
  const CARD_W = 450;
  const CARD_H = 350; // was 460 — "halkasa chhota"
  const SVG_H  = CARD_H;

  return (
    <Box
      bg="gray.900"
      p={4}
      borderRadius="xl"
      w={`${CARD_W}px`}
      h={`${CARD_H}px`}
      color="white"
      position="relative"
      sx={{ userSelect: 'none' }}
    >
      {/* ---------- Konva: Title + Lines (LOCKED) ---------- */}
      <Stage
        width={CARD_W}
        height={SVG_H}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
      >
        <Layer>
          {/* Title (fixed) */}
          <KText
            x={TITLE.x}
            y={TITLE.y}
            text="Energy Flow"
            fontSize={18}
            fontStyle="bold"
            fill="#fff"
            draggable={false}
          />

          {/* Solar → Mid (horizontal) */}
          <Group x={LINE_SOLAR_MID.x} y={LINE_SOLAR_MID.y} draggable={false}>
            <Rect x={-8} y={-8} width={96} height={16} fill="transparent" />
            <Line points={[0, 0, 80, 0]} stroke="orange" strokeWidth={3} />
          </Group>

          {/* Down → Battery (vertical + arrow) */}
          <Group x={LINE_DOWN_TO_BATT.x} y={LINE_DOWN_TO_BATT.y} draggable={false}>
            <Rect x={-8} y={-4} width={16} height={70} fill="transparent" />
            <Line points={[0, 0, 0, 65]} stroke="orange" strokeWidth={3} />
            <Line y={5} points={[0, 63, -6, 50, 6, 50]} fill="orange" closed />
          </Group>

          {/* Mid → Grid (horizontal + arrow) */}
          <Group x={LINE_MID_TO_GRID.x} y={LINE_MID_TO_GRID.y} draggable={false}>
            <Rect x={-8} y={-8} width={100} height={16} fill="transparent" />
            <Line points={[0, 0, 80, 0]} stroke="orange" strokeWidth={3} />
            <Line x={2} points={[80, 0, 70, -6, 70, 6]} fill="orange" closed />
          </Group>

          {/* Vertical support */}
          <Group x={LINE_VERTICAL_SUPPORT.x} y={LINE_VERTICAL_SUPPORT.y} draggable={false}>
            <Rect x={-8} y={-4} width={16} height={76} fill="transparent" />
            <Line x={2} points={[0, 0, 0, 68]} stroke="orange" strokeWidth={3} />
          </Group>
        </Layer>
      </Stage>

      {/* ---------- SVG: Boxes (LOCKED) ---------- */}
      <svg
        width="100%"
        height={`${SVG_H}px`}
        role="img"
        aria-label="Energy Flow Diagram"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 2,
          cursor: 'default',
          pointerEvents: 'none',
        }}
      >
        {/* SOLAR (fixed) */}
        <g transform={`translate(${SOLAR_BOX.x}, ${SOLAR_BOX.y})`}>
          <foreignObject x={0} y={0} width={90} height={90} pointerEvents="none">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <IconContext.Provider value={{ size: '40px' }}>
                <PiSolarPanelFill color="white" />
              </IconContext.Provider>
              <span style={{ fontSize: 12, color: '#A0AEC0' }}>SOLAR</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#FBBF24' }}>
                {dummy.solarKw.toFixed(1)} kW
              </span>
            </div>
          </foreignObject>
        </g>

        {/* GRID (fixed) */}
        <g transform={`translate(${GRID_BOX.x}, ${GRID_BOX.y})`}>
          <foreignObject x={0} y={0} width={90} height={110} pointerEvents="none">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div
                style={{
                  background: '#1F2937',
                  borderRadius: 8,
                  height: 60,
                  width: 60,
                  border: '2px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 22, fontWeight: 700 }}>-</span>
              </div>
              <span style={{ fontSize: 12, color: '#A0AEC0', marginTop: 2 }}>GRID</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#FBBF24' }}>
                {dummy.gridKw.toFixed(1)} kW
              </span>
            </div>
          </foreignObject>
        </g>

        {/* BATTERY (fixed) */}
        <g transform={`translate(${BATTERY_BOX.x}, ${BATTERY_BOX.y})`}>
          <foreignObject x={0} y={0} width={100} height={120} pointerEvents="none">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div
                style={{
                  background: '#1F2937',
                  borderRadius: 8,
                  height: 60,
                  width: 60,
                  position: 'relative',
                  border: '2px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 2,
                }}
              >
                <div style={{ position: 'absolute', top: 10, left: 0, right: 0, height: 2, background: 'white' }} />
                <IconContext.Provider value={{ size: '28px' }}>
                  <AiFillThunderbolt color="white" />
                </IconContext.Provider>
              </div>
              <span style={{ fontSize: 12, color: '#A0AEC0' }}>BATTERY</span>
              <span style={{ fontSize: 11, color: '#A7F3D0' }}>{dummy.battkW} kW</span>
            </div>
          </foreignObject>
        </g>
      </svg>
    </Box>
  );
}
