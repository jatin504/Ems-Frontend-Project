import React from "react";
import { Group } from "react-konva";

import RedLine from "./RedLine";
import Label from "./Label";
import EquipmentBox from "./EquipmentBox";
import CurrentTransformer from "./CurrentTransformer";
import PotentialTransformer from "./PotentialTransformer";


export const CTSection: React.FC = () => (
  <Group>
    {/* CT symbols around conductor */}
    <CurrentTransformer x={293} y={264} />
    <CurrentTransformer x={293} y={313} />
    <CurrentTransformer x={293} y={363} />
    <CurrentTransformer x={293} y={423} />

    {/* Core 1 output */}
    <RedLine points={[301, 264, 418, 264]} />
    <Label x={430} y={252} text="DIRECTIONAL O/C & E/F PROTECTION RELAY" fontSize={10} />

    {/* Core 2 */}
    <RedLine points={[301, 313, 418, 313]} />

    {/* Core 3 */}
    <RedLine points={[301, 363, 418, 363]} />

    {/* Core 4 */}
    <RedLine points={[301, 423, 418, 423]} />

    {/* TVM */}
    <EquipmentBox x={420} y={417} width={37} height={14} text="TVM" />

    {/* ASS / VSS */}
    <PotentialTransformer x={465} y={420} />
    <PotentialTransformer x={498} y={420} />

    <Label x={451} y={437} text="ASS" fontSize={8} />
    <Label x={488} y={437} text="VSS" fontSize={8} />

    {/* connection to VT */}
    <RedLine points={[506, 420, 557, 420]} />
  </Group>
);
