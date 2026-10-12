import { Group, Ellipse, Line } from "react-konva";

import { Wire } from "./Wire";
import { Txt } from "./Txt";
import { PowerTransformer } from "./PowerTransformer";
import { TransformerCTPanel } from "./TransformerCTPanel";
import { BLUE, FONT_SIZE, RED } from "../electrical/constants";
import DataValueTable from "../PCSBlock/DataValueTable";


export const TransformerTopSection = ({ mainX, lineNumber=1 }: { mainX: number, lineNumber : number}) => {
  return (
    <Group>
      {/* ------------------------------------------------------------------ */}
      {/* Transformer                                                         */}
      {/* ------------------------------------------------------------------ */}

      <PowerTransformer x={218} y={145} scale={1.45} />

      {/* Transformer title */}
      <Txt
        x={-230}
        y={151}
        text={"POWER TRANSFORMER - " + lineNumber}
        fontSize={FONT_SIZE}
        fill={BLUE}
        bold
      />

      <Txt
        x={-70}
        y={191}
        text="66/33 kV, YNyn0"
        fontSize={FONT_SIZE}
        fill={BLUE}
        bold
      />

      <DataValueTable
        x={400}
        y={165}
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


      {/* Main vertical feeder */}
      <Wire
        points={[mainX, 265, mainX, 399]}
        strokeWidth={3}
      />
    

      {/* Continue main conductor */}
      <Wire
        points={[mainX, 399, mainX, 500]}
        strokeWidth={3}
      />
    </Group>
  );
};
