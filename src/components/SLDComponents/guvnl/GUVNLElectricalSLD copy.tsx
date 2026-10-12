import React, { useRef, useState } from "react";
import Konva from "konva";

import {
  Stage,
  Layer,
  Group,
  Line,
  Text,
  Rect,
} from "react-konva";
import FinalSubstationCluster from "./FinalSubstation/FinalSubstationCluster";
import MVRClusterCanvas, { MVRCluster } from "./AllMVRPannelsCluster";
import { BLACK, RED } from "./electrical/constants";


/* =========================================================
   TYPES
========================================================= */

interface Position {
  x: number;
  y: number;
}

/* =========================================================
   INITIAL POSITIONS
========================================================= */

const INITIAL_POSITIONS = {
  FinalSubstationCluster: {
    x: 2810,
    y: -643.33,
  },

  MVRCluster: {
    x: 100,
    y: 1400,
  }
};

/* =========================================================
   LINE SIZE
========================================================= */

const HORIZONTAL_LINE_LENGTH = 3200;

const VERTICAL_LINE_LENGTH = 2400;

/* =========================================================
   COMPONENT
========================================================= */

export default function GUVNLElectricalSLD() {
  const stageRef = useRef<Konva.Stage>(null);

  /* =======================================================
     ZOOM
  ======================================================= */

  const [scale, setScale] = useState(0.08);

  /* =======================================================
     STAGE POSITION
  ======================================================= */

  const [position, setPosition] = useState({
    x: 40,
    y: 40,
  });

  /* =======================================================
     ITEM POSITIONS
  ======================================================= */

  const [itemPositions, setItemPositions] =
    useState<Record<string, Position>>(
      INITIAL_POSITIONS
    );

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
      0.12,
      Math.min(2.5, newScale)
    );

    /* -----------------------------------------------
       World coordinate under mouse
    ------------------------------------------------ */

    const mousePointTo = {
      x:
        (pointer.x - stage.x()) /
        oldScale,

      y:
        (pointer.y - stage.y()) /
        oldScale,
    };

    /* -----------------------------------------------
       New stage position
    ------------------------------------------------ */

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
     DRAG ITEM
  ========================================================= */

  const handleItemDragEnd = (
    id: string,
    e: Konva.KonvaEventObject<DragEvent>
  ) => {
    /*
     * VERY IMPORTANT
     *
     * Prevent item drag from also
     * affecting the Stage.
     */

    e.cancelBubble = true;

    const node = e.target;

    const x = node.x();

    const y = node.y();

    setItemPositions((previous) => ({
      ...previous,

      [id]: {
        x,
        y,
      },
    }));

    console.log(
      `[${id}] position:`,
      {
        x,
        y,
      }
    );

    console.log(
      `${id}: { x: ${x}, y: ${y} }`
    );
  };

  /* =========================================================
     POSITION HELPER
  ========================================================= */

  const getPosition = (
    id: string
  ) => {
    return (
      itemPositions[id] ?? {
        x: 0,
        y: 0,
      }
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */
  const CANVAS_WIDTH = 5000;
  const CANVAS_HEIGHT = 3000;


  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        // background: "#ffffff",
      }}
    >
      <div
      style={{
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        position: "relative",
      }}
    >
        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          draggable
          onWheel={handleWheel}
          onDragEnd={(e) => {
            setPosition({
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
        >

          <Layer listening={false}>


            <Group
              x={6300}
              y={-100}
            >
              {/* =========================================================
        SINGLE LINE DIAGRAM - TITLE BLOCK
        ========================================================= */}

              {/* Main title block */}
              <Rect
                x={500}
                y={-2100}
                width={1900}
                height={200}
                fill="#FFFFFF"
                stroke="#172033"
                strokeWidth={6}
                cornerRadius={2}
                listening={false}
              />

              {/* Top navy header band */}
              <Rect
                x={503}
                y={-2097}
                width={1894}
                height={95}
                fill="#172033"
                listening={false}
              />

              {/* Main title */}
              <Text
                x={550}
                y={-2085}
                width={1800}
                height={75}
                text="SINGLE LINE DIAGRAM"
                fontFamily="Poppins"
                fontSize={62}
                fontStyle="bold"
                fill="#FFFFFF"
                align="center"
                verticalAlign="middle"
                letterSpacing={5}
                listening={false}
              />

              {/* Project / capacity information */}
              <Text
                x={550}
                y={-1975}
                width={1800}
                height={85}
                text="GUVNL  •  100 MW / 200 MWh"
                fontFamily="Poppins"
                fontSize={54}
                fontStyle="bold"
                fill="#172033"
                align="center"
                verticalAlign="middle"
                letterSpacing={2}
                listening={false}
              />

              {/* Subtle separator */}
              {/* <Line
                points={[650, -1885, 2250, -1885]}
                stroke="#94A3B8"
                strokeWidth={2}
                listening={false}
              /> */}

              
            </Group>




            <Line
              points={[
                868,
                724,
                5820,
                724,
              ]}
              stroke={BLACK}
              strokeWidth={2}
              listening={false}
            />

            <Group
              x={9320}
            >
              <Line
                points={[
                  0,
                  724,
                  4950,
                  724,
                ]}
                stroke={BLACK}
                strokeWidth={2}
                listening={false}
              />
            </Group>


            {/* =================================================
                FINAL SUBSTATION CLUSTER
            ================================================= */}

            <Group
              id="FinalSubstationCluster"
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
            // draggable
            // onDragEnd={(e) =>
            //   handleItemDragEnd(
            //     "FinalSubstationCluster",
            //     e
            //   )
            // }
            >
              <FinalSubstationCluster />
            </Group>

            {/* =================================================
                MVR CLUSTER
            ================================================= */}

            <Group
              id="MVRCluster"
              x={
                getPosition(
                  "MVRCluster"
                ).x
              }
              y={
                getPosition(
                  "MVRCluster"
                ).y
              }
            // draggable
            // onDragEnd={(e) =>
            //   handleItemDragEnd(
            //     "MVRCluster",
            //     e
            //   )
            // }
            >
              <MVRClusterCanvas />
              <MVRCluster />
            </Group>

          </Layer>

        </Stage>
    </div>
    </div>
  );
}
