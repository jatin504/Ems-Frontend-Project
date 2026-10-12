import { Group, Line, Rect, Arrow } from "react-konva";

import { BLACK, BLUE, FONT_SIZE, RED } from "../electrical/constants";
import { Wire } from "./Wire";
import { Dot } from "./Dot";
import { Txt } from "./Txt";

import { BusIsolator } from "./BusIsolator";
import { VCB } from "./VCB";
import { CTAssembly } from "./CTAssembly";
import { LinePT } from "./LinePT";

import { Relay } from "./Relay";
import { RelayPanel } from "./RelayPanel";
import Annunciator from "./Annunciator";
import Breaker52 from "../PCSFeeder/Breaker52";
import ProtectionTable from "../PCSFeeder/ProtectionTable";


export const ExistingSLD = ({ mainX }: { mainX: number }) => {
  return (
    <Group>

      {/* TOP BUS */}

      <BusIsolator x={mainX} y={11} />

      <Wire points={[mainX, 58, mainX, 136]} strokeWidth={3} />

      <Txt
        x={-123}
        y={22}
        text="BUS ISOLATOR / ES"
        fontSize={FONT_SIZE}
        fill={BLUE}
        bold
      />

      {/* <VCB x={mainX} y={136} /> */}
      <Annunciator
        x={350}
        y={70}
        scale={2.2}
      />


      {/* MAIN CONDUCTOR */}
      <Wire points={[mainX, 136, mainX, 190]} strokeWidth={3} />


      {/* RELAY MEASUREMENTS */}

      <Breaker52
        x={315}
        y={330}
        scale={3}
      />

      <ProtectionTable 
        x={370}
        y={300}
      />


      {/* CONTINUE FEEDER */}

      <Wire
        points={[mainX, 187, mainX, 445]}
        strokeWidth={3}
      />

      {/* <Dot x={mainX} y={347} r={4} /> */}


      {/* METER DATA */}



      {/* MAIN FEEDER */}

      <Wire
        points={[mainX, 445, mainX, 585]}
        strokeWidth={3}
      />

      {/* SECOND BUS ISOLATOR */}

      <BusIsolator x={mainX} y={586} />

      <Txt
        x={-123}
        y={583}
        text="BUS ISOLATOR / ES"
        fontSize={FONT_SIZE}
        fill={BLUE}
        bold
      />

      {/* FEEDER AFTER LOWER ISOLATOR */}

      <Wire
        points={[mainX, 634, mainX, 692]}
        strokeWidth={3}
      />

      {/* FINAL FEEDER */}

      <Arrow
        points={[mainX, 692, mainX, 750]}
        stroke={BLACK}
        fill={BLACK}
        strokeWidth={3}
        pointerLength={14}
        pointerWidth={11}
      />

      <Rect
        x={262}
        y={755}
        width={110}
        height={2}
        stroke={BLACK}
        strokeWidth={6}
        fill="#fff"
      />

      {/* <Txt
        x={263}
        y={809}
        text="Cable to Line"
        fontSize={12}
        fill={BLACK}
        width={108}
        align="center"
      /> */}

    </Group>
  );
};
