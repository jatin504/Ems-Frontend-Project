import React from "react";
import { Group } from "react-konva";
import Busbar from "../components/SLDComponents/Busbar";
import VerticalSwitchLine from "../components/SLDComponents/VerticalSwitchLine";
import LoadBox from "../components/SLDComponents/LoadBox";

const LoadsBranch = ({ textColor = "white" }: { textColor?: string }) => {
  const arrowOffset = 150;
  const boxOffset = 5;

  return (
    <Group>
      {/* Locked horizontal Busbar */}
      <Group x={795} y={104}>
        <Busbar points={[0, 0, 500, 0]} />
      </Group>

      {/* Lights */}
      <Group x={925} y={104}>
        <VerticalSwitchLine x={0} y={0} textColor={textColor} />
        <Group x={-30} y={arrowOffset + boxOffset}>
          <LoadBox label="Lights" textColor={textColor} />
        </Group>
      </Group>

      {/* Control */}
      <Group x={990} y={103}>
        <VerticalSwitchLine x={0} y={0} textColor={textColor} />
        <Group x={-30} y={arrowOffset + boxOffset}>
          <LoadBox label="Control" textColor={textColor} />
        </Group>
      </Group>

      {/* BMS */}
      <Group x={1055} y={104}>
        <VerticalSwitchLine x={0} y={0} textColor={textColor} />
        <Group x={-30} y={arrowOffset + boxOffset}>
          <LoadBox label="BMS" textColor={textColor} />
        </Group>
      </Group>

      {/* HVAC */}
      <Group x={1120} y={104}>
        <VerticalSwitchLine x={0} y={0} textColor={textColor} />
        <Group x={-30} y={arrowOffset + boxOffset}>
          <LoadBox label="HVAC" textColor={textColor} />
        </Group>
      </Group>

      {/* FSS */}
      <Group x={1185} y={104}>
        <VerticalSwitchLine x={0} y={0} textColor={textColor} />
        <Group x={-30} y={arrowOffset + boxOffset}>
          <LoadBox label="FSS" textColor={textColor} />
        </Group>
      </Group>
    </Group>
  );
};

export default LoadsBranch;
