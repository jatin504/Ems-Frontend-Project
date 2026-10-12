import React, { useRef, useState } from "react";
import Konva from "konva";

import {
  Stage,
  Layer,
  Group,
  Line,
} from "react-konva";

import FinalSubstationCluster from "./FinalSubstation/FinalSubstationCluster";
import SLDFooter from "./SLDFooter";
import { MVRLayout } from "./AllMVRPannelsCluster";
import { BLACK } from "./electrical/constants";

/* =========================================================
   TYPES
========================================================= */

interface Position {
  x: number;
  y: number;
}

type ViewName =
  | "block1"
  | "block2"
  | "auxGrid"
  | "gridSubstation"
  | "full";

/* =========================================================
   INITIAL POSITIONS
========================================================= */

const INITIAL_POSITIONS: Record<string, Position> = {
  FinalSubstationCluster: {
    x: 2710,
    y: -2048.33,
  },

  MVRCluster: {
    x: 100,
    y: 1400,
  },
};

/* =========================================================
   VIEW SCALE
========================================================= */

const FULL_SLD_SCALE = 0.1;
const DETAIL_SCALE = 0.18;


/* =========================================================
   SLD VIEW CONFIGURATION
========================================================= */

const SLD_VIEWS = {
  full: {
    scale: 0.1,

    position: {
      x: 40,
      y: 350,
    },
  },

  block1: {
    scale: 0.2,

    viewport: {
      x: -1700,
      y: -1000,
      width: 11500,
      height: 4000,
    },
  },

  block2: {
    scale: 0.20,

    viewport: {
      x: 6850,
      y: -1000,
      width: 11500,
      height: 4000,
    },
  },

  auxGrid: {
    scale: 0.20,

    viewport: {
      x: 16500,
      y: -500,
      width: 5000,
      height: 4000,
    },
  },

  gridSubstation: {
    scale: 0.20,

    viewport: {
      x: 5000,
      y: -3100,
      width: 5000,
      height: 3000,
    },
  },
};


/* =========================================================
   COMPONENT
========================================================= */

export default function GUVNLElectricalSLD({data} : {data : any}) {
  const stageRef = useRef<Konva.Stage>(null);

  const [scale, setScale] = useState(FULL_SLD_SCALE);

  const [position, setPosition] = useState({
    x: 40,
    y: 350,
  });

  const [activeView, setActiveView] =
    useState<ViewName>("full");

  const [itemPositions, setItemPositions] =
    useState<Record<string, Position>>(
      INITIAL_POSITIONS
    );

  /* =========================================================
     CANVAS
  ========================================================= */

  const CANVAS_WIDTH = 5000;
  const CANVAS_HEIGHT = 3000;

  /* =========================================================
     WHEEL ZOOM
  ========================================================= */

  const handleWheel = (
    e: Konva.KonvaEventObject<WheelEvent>
  ) => {
    e.evt.preventDefault();

    const stage = stageRef.current;

    if (!stage) return;

    const oldScale = stage.scaleX();

    const pointer =
      stage.getPointerPosition();

    if (!pointer) return;

    const scaleBy = 1.08;

    const newScale =
      e.evt.deltaY > 0
        ? oldScale / scaleBy
        : oldScale * scaleBy;

    const finalScale = Math.max(
      0.05,
      Math.min(2.5, newScale)
    );

    const mousePointTo = {
      x:
        (pointer.x - stage.x()) /
        oldScale,

      y:
        (pointer.y - stage.y()) /
        oldScale,
    };

    const newPosition = {
      x:
        pointer.x -
        mousePointTo.x *
        finalScale,

      y:
        pointer.y -
        mousePointTo.y *
        finalScale,
    };

    setScale(finalScale);
    setPosition(newPosition);
  };

  /* =========================================================
     STAGE DRAG
  ========================================================= */

  const handleStageDragEnd = (
    e: Konva.KonvaEventObject<DragEvent>
  ) => {
    setPosition({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  /* =========================================================
     ITEM POSITION
  ========================================================= */

  const getPosition = (
    id: string
  ): Position => {
    return (
      itemPositions[id] ?? {
        x: 0,
        y: 0,
      }
    );
  };

  /* =========================================================
     VIEW BUTTON
  ========================================================= */

  const handleViewChange = (
    view: ViewName
  ) => {
    const stage = stageRef.current;

    if (!stage) return;

    if (view === "full") {
      setScale(
        SLD_VIEWS.full.scale
      );

      setPosition(
        SLD_VIEWS.full.position
      );

      setActiveView("full");

      return;
    }

    const config =
      SLD_VIEWS[view];

    const viewport =
      config.viewport;

    const stageWidth =
      stage.width();

    const stageHeight =
      stage.height();

    const centerX =
      viewport.x +
      viewport.width / 2;

    const centerY =
      viewport.y +
      viewport.height / 2;

    setScale(config.scale);

    setPosition({
      x:
        stageWidth / 2 -
        centerX * config.scale,

      y:
        stageHeight / 2 -
        centerY * config.scale,
    });

    setActiveView(view);
  };

  /* =========================================================
     BUTTON STYLE
  ========================================================= */

  const getButtonStyle = (
    view: ViewName
  ): React.CSSProperties => {
    const active =
      activeView === view;

    return {
      padding: "5px 10px",
      borderRadius: "6px",
      border: active
        ? "2px solid #172033"
        : "1px solid #CBD5E1",

      background: active
        ? "#172033"
        : "#FFFFFF",

      color: active
        ? "#FFFFFF"
        : "#172033",

      fontWeight: 600,
      fontSize: "8px",
      cursor: "pointer",

      transition:
        "all 0.15s ease",
    };
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight - 36,
  });

  React.useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;

      setStageSize({
        width: rect.width,
        height: rect.height,
      });
    });

    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        // background: "#F8FAFC",
      }}
    >
      {/* =====================================================
          VIEW BUTTONS
      ===================================================== */}

      <div
        style={{
          width: "100%",
          height: "36px",

          display: "flex",
          alignItems: "center",
          gap: "10px",

          padding:
            "8px 16px",

          boxSizing: "border-box",

          // background: "#FFFFFF",

          borderBottom:
            "1px solid #E2E8F0",

          position: "relative",
          zIndex: 100,
        }}
      >
        <button
          style={getButtonStyle(
            "block1"
          )}
          onClick={() =>
            handleViewChange(
              "block1"
            )
          }
        >
          Block-1
        </button>

        <button
          style={getButtonStyle(
            "block2"
          )}
          onClick={() =>
            handleViewChange(
              "block2"
            )
          }
        >
          Block-2
        </button>

        <button
          style={getButtonStyle(
            "auxGrid"
          )}
          onClick={() =>
            handleViewChange(
              "auxGrid"
            )
          }
        >
          Auxiliary
        </button>

        <button
          style={getButtonStyle(
            "gridSubstation"
          )}
          onClick={() =>
            handleViewChange(
              "gridSubstation"
            )
          }
        >
          Trafo/Line Bay
        </button>

        <button
          style={getButtonStyle(
            "full"
          )}
          onClick={() =>
            handleViewChange(
              "full"
            )
          }
        >
          Full SLD
        </button>

        {/* <div
          style={{
            marginLeft: "auto",
            fontSize: "13px",
            color: "#64748B",
          }}
        >
          GUVNL 100MW/200MWh
        </div> */}

        {/* Optional zoom indicator */}

        <div
          style={{
            marginLeft: "auto",
            fontSize: "13px",
            color: "#64748B",
          }}
        >
          {/* Zoom:{" "}
          {(scale * 100).toFixed(0)}% */}
        </div>
      </div>

      {/* =====================================================
          CANVAS
      ===================================================== */}

      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "calc(100% - 36px)",
          overflow: "hidden",
          // position: "relative",
        }}
      >
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          // draggable
          onWheel={handleWheel}
        // onDragEnd={handleStageDragEnd}
        >

          <Layer listening={false}>

            {/* =================================================
                  MAIN BUS
              ================================================= */}

            <Line
              points={[
                770,
                -677,
                5820,
                -677,
              ]}
              stroke={BLACK}
              strokeWidth={3}
              listening={false}
            />

            <Group x={9320}>
              <Line
                points={[
                  -95,
                  -677,
                  4852,
                  -677,
                ]}
                stroke={BLACK}
                strokeWidth={3}
                listening={false}
              />
            </Group>

            {/* =================================================
                  FINAL SUBSTATION
              ================================================= */}

            <Group
              id="view-grid-substation"
              x={
                getPosition(
                  "FinalSubstationCluster"
                ).x
              }
              y={
                getPosition(
                  "FinalSubstationCluster"
                ).y
              }
            >
              <FinalSubstationCluster
                x={2500}
                y={-1200}
              />
            </Group>

            {/* =================================================
                  MVR
              ================================================= */}

            <Group
              id="mvr-layout"
            >
              <MVRLayout data={data} />
            </Group>

          </Layer>
        </Stage>
        <SLDFooter />
      </div>
    </div>
  );
}