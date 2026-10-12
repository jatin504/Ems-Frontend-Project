import React from "react";
import {
  Group,
  Line,
  Text,
} from "react-konva";

import Breaker from "../electrical/Breaker";
import BatteryContainer from "../electrical/BatteryContainer";
import PCS from "../electrical/PCS";
import Wire from "../electrical/Wire";
import Busbar from "../electrical/Busbar";
import TransformerLabel from "../electrical/TransformerLabel";
import Transformer from "../electrical/transformer";
import { Blue, FONT, FONT_SIZE, ORANGE } from "../electrical/constants";
import DataValueTable from "./DataValueTable";

interface PCSItem {
  x: number;
  label: string;
}

interface PCSBlockProps {
  x?: number;
  y?: number;
  count?: number;
}

export const PCSBlock: React.FC<PCSBlockProps> = ({
  x = 0,
  y = 0,
  count = 4,
}) => {
  // =====================================================
  // SCALE
  // =====================================================

  const PCS_SCALE = 1.2;
  const BATTERY_SCALE = 1.2;

  // =====================================================
  // ORIGINAL COMPONENT DIMENSIONS
  // =====================================================

  const PCS_WIDTH = 100;
  const PCS_HEIGHT = 88;

  const BATTERY_WIDTH = 250;
  const BATTERY_HEIGHT = 145;

  const scaledPCSWidth = PCS_WIDTH * PCS_SCALE;
  const scaledPCSHeight = PCS_HEIGHT * PCS_SCALE;

  const scaledBatteryWidth =
    BATTERY_WIDTH * BATTERY_SCALE;

  const scaledBatteryHeight =
    BATTERY_HEIGHT * BATTERY_SCALE;

  // =====================================================
  // TRANSFORMER
  // =====================================================

  const transformerX = 170;
  const transformerY = 0;

  // =====================================================
  // MAIN BUS
  // =====================================================

  const busY = 195;

  // =====================================================
  // PCS LAYOUT
  // =====================================================

  const pcsStartX = 80;
  const pcsSpacing = 250;

  const pcsCount = Math.max(1, count);

  /*
   * item.x is the CENTER of each PCS/BESS column.
   */
  const pcsX: number[] = Array.from(
    { length: pcsCount },
    (_, index) =>
      pcsStartX + index * pcsSpacing
  );

  const pcs: PCSItem[] = pcsX.map(
    (centerX, index) => ({
      x: centerX,
      label: `PCS ${index + 1}`,
    })
  );

  // =====================================================
  // PCS / BATTERY VERTICAL LAYOUT
  // =====================================================

  const pcsY = 300;

  const pcsBatteryGap = 60;

  const batteryY =
    pcsY +
    scaledPCSHeight +
    pcsBatteryGap;

  // =====================================================
  // BUSBAR
  // =====================================================

  const busWidth =
    pcsCount > 1
      ? pcsX[pcsX.length - 1] - pcsX[0]
      : 0;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Group x={x} y={y}>

      {/* =================================================
          TRANSFORMER INFORMATION
      ================================================= */}

      {/* <TransformerLabel
        x={-30}
        y={30}
        scale={2}
      /> */}
      <Group
        x={-160}
        y={-30}
      >
        <Text
          text={
            "11.5 MVA\n Dyn11Dyn11\nDyn11\n33 kV/0.690-\n0.690 kV-kV\n/0.690-0.690 kV"
          }
          fontSize={30}
          fontFamily={FONT}
          fill={Blue}
          // lineHeight={1.15}
        />
      </Group>

      {/* =================================================
          TRANSFORMER
      ================================================= */}

      <Transformer
        x={transformerX}
        y={transformerY}
        scale={1.5}
      />

      <DataValueTable
        x={280}
        y={-50}
        title=""
        width={150}
        value={{
          OTI: "1°C",
          WTI: "23°C",
          // PRD: 45,
          // OLTC: 12,
          // TEMP: 67,
        }}
        scale={1.2}
      />

      {/* =================================================
          TRANSFORMER CONNECTIONS
      ================================================= */}

      <Wire
        points={[
          transformerX - 65,
          transformerY + 80,

          transformerX - 65,
          busY,

          pcsX[0],
          busY,
        ]}
      />

      <Wire
        points={[
          transformerX - 20,
          transformerY + 90,

          transformerX - 20,
          busY,
        ]}
      />

      <Wire
        points={[
          transformerX + 20,
          transformerY + 90,

          transformerX + 20,
          busY,
        ]}
      />

      <Wire
        points={[
          transformerX + 63,
          transformerY + 80,

          transformerX + 63,
          busY,

          pcsX[pcsX.length - 1],
          busY,
        ]}
      />

      {/* =================================================
          MAIN BUSBAR
      ================================================= */}
      <Group
        x={-80}
      >
        <Busbar
          x={pcsX[0]}
          y={busY}
          width={busWidth}
        />
      </Group>

      {/* =================================================
          PCS + BESS
      ================================================= */}

      {pcs.map((item, index) => {

        /*
         * Alternate vertical position:
         *
         * PCS 1 -> UP
         * PCS 2 -> DOWN
         * PCS 3 -> UP
         * PCS 4 -> DOWN
         */

        const verticalOffset =
          index % 2 === 0 ? -30 : 320;

        const currentPcsY =
          pcsY + verticalOffset;

        const currentBatteryY =
          currentPcsY +
          scaledPCSHeight +
          pcsBatteryGap;

        const pcsLeft =
          item.x - scaledPCSWidth / 1;

        const batteryX =
          item.x - scaledBatteryWidth / 1.5;

        return (
          <Group key={index}>

            {/* BUSBAR -> BREAKER */}

            <Group
              x={-80}
            >
              <Wire
                points={[
                  item.x,
                  busY,

                  item.x,
                  busY + 62,
                ]}
              />

              {/* <Breaker
                x={item.x}
                y={busY + 22}
              /> */}

              {/* BREAKER -> PCS */}

              <Wire
                points={[
                  item.x,
                  busY + 57,

                  item.x,
                  currentPcsY,
                ]}
              />
            </Group>


            {/* PCS */}

            <PCS
              x={pcsLeft}
              y={currentPcsY}
              label={item.label}
              scale={PCS_SCALE}
            />
            <BatteryContainer
              x={batteryX}
              y={currentBatteryY}
              width={BATTERY_WIDTH}
              height={BATTERY_HEIGHT}
              scale={BATTERY_SCALE}
            />


          </Group>
        );
      })}

    </Group>
  );
};
