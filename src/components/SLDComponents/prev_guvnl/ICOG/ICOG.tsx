import React from "react";
import {
  Group,
  Text,
} from "react-konva";

import VerticalBus from "./VerticalBus";
import SurgeArrester from "./SurgeArrester";
import BlueText from "./BlueText";
import EquipmentSymbol from "./EquipmentSymbol";
import Annunciator from "./Annunciator";
import LinePT from "./LinePT";
import Transformer from "./Transformer";
import ProtectionFunctions from "./ProtectionFunctions";
import CT from "./CT";
import RelayBlock from "./RelayBlock";
import CTSpecification from "./CTSpecification";
import MultifunctionMeter from "./MultifunctionMeter";
import Wire from "./Wire";
import SpareCT from "./SpareCT";
import CircuitBreaker from "./CircuitBreaker";
import Motor from "./Motor";
import MotorSpecification from "./MotorSpecification";

interface ICOGProps {
  x?: number;
  y?: number;
}

const ICOG: React.FC<ICOGProps> = ({
  x = 0,
  y = 0,
}) => {
  const BUS_X = 188;

  return (
    <Group
      x={x}
      y={y}
    >

      {/* Main vertical conductor */}

      <Group
        y={-510}
      >
        <VerticalBus
          x={BUS_X}
          height={1210}
        />
      </Group>

      {/* Top section */}

      <SurgeArrester
        x={10}
        y={68}
      />

      <BlueText
        x={70}
        y={43}
        text="SA"
      />

      <BlueText
        x={70}
        y={61}
        text="30kV, 10 kA"
        fontSize={12}
      />

      <BlueText
        x={70}
        y={78}
        text="Class II"
        fontSize={12}
      />

      <EquipmentSymbol
        x={222}
        y={52}
      />

      <Annunciator
        x={350}
        y={40}
      />

      {/* PT section */}

      <LinePT
        x={218}
        y={70}
      />

      {/* Transformer */}

      <Transformer
        x={205}
        y={167}
      />

      {/* Transformer data */}

      <Group
        y={-20}
      >
        <Text
          x={270}
          y={170}
          text="33 kV"
          fontSize={12}
          fill="orange"
        />

        <Text
          x={270}
          y={186}
          text="500 kVA"
          fontSize={12}
          fill="orange"
        />

        <Text
          x={270}
          y={202}
          text="50 Hz"
          fontSize={12}
          fill="orange"
        />
      </Group>


      <ProtectionFunctions
        x={326}
        y={122}
      />

      {/* Relay data */}

      <Group
        x={60}
        y={10}
      >
        <Text
          x={275}
          y={285}
          text="50/51"
          fontSize={12}
          fill="orange"
        />

        <Text
          x={275}
          y={301}
          text="87T"
          fontSize={12}
          fill="orange"
        />

        <Text
          x={275}
          y={317}
          text="Trip"
          fontSize={12}
          fill="orange"
        />
      </Group>


      {/* CT + protection relay */}

      <CT
        x={188}
        y={310}
      />

      <RelayBlock
        x={220}
        y={300}
      />

      {/* CT specification */}

      <CTSpecification
        x={68}
        y={319}
      />

      {/* MFM */}

      <CT
        x={188}
        y={388}
      />

      <MultifunctionMeter
        x={230}
        y={378}
      />

      {/* Meter data */}

      <Group
        x={40}
      >
        <Text
          x={285}
          y={378}
          text="500 kW"
          fontSize={12}
          fill="orange"
        />

        <Text
          x={285}
          y={394}
          text="100 kVAR"
          fontSize={12}
          fill="orange"
        />

        <Text
          x={285}
          y={410}
          text="50 Hz"
          fontSize={12}
          fill="orange"
        />
      </Group>


      <Wire
        points={[
          233,
          207,
          323,
          207,
          323,
          388,
          270,
          388,
        ]}
      />

      {/* Spare */}

      <SpareCT
        x={188}
        y={474}
      />

      {/* Bottom breaker */}

      <CircuitBreaker
        x={188}
        y={595}
      />

      {/* Breaker data */}

      <Group
        y={-20}
      >
        <Text
          x={225}
          y={578}
          text="52"
          fontSize={12}
          fill="orange"
        />

        <Text
          x={225}
          y={594}
          text="CLOSED"
          fontSize={11}
          fill="orange"
        />

        <Text
          x={225}
          y={609}
          text="500 A"
          fontSize={11}
          fill="orange"
        />
      </Group>


      <Motor
        x={220}
        y={617}
      />

      <MotorSpecification
        x={70}
        y={592}
      />

    </Group>
  );
};

export default ICOG;
