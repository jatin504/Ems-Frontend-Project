import React from "react";
import { Box, HStack, VStack, Text, useColorModeValue } from "@chakra-ui/react";

type Props = {
  deviation?: string;
  actualPower?: string;
  dsmPenaltyTop?: string;
  dsmPenaltyBottom?: string;
  chargeDischarge?: string;
};

// exact sizing per spec
const TILE_W = 144.3333282470703; // px
const TILE_H = 132.5;             // px
const GAP = 20;                   // px (between tiles/rows)

const StatTile: React.FC<{
  label: string;
  value: string;
  gradient: string;
  w?: number | string;
  h?: number | string;
  border? : string
}> = ({ label, value, gradient, w = TILE_W, h = TILE_H, border }) => {
  const borderColor = useColorModeValue("#fff", "#1F2733");
  const primaryColor = useColorModeValue("primaryText.light", "primaryText.dark");
  const secondaryColor = useColorModeValue("secondaryText.light", "secondaryText.dark");
  return (
    <Box
      w={w}
      h={h}
      borderRadius="12px"
      // border={`1px solid ${border || borderColor}`}
      bgGradient={gradient}
      position="relative"
      overflow="hidden"
      p="20px"
    >
    <VStack align="start" spacing="8px" mt={5}>   {/* gap: 8px inside tile */}
      <Text color={secondaryColor} fontSize="14px">{label}</Text>
      <Text fontSize={"20px"} fontWeight={600} color={primaryColor}>{value}</Text>
    </VStack>
  </Box>
  );
};

const PowerStats: React.FC<Props> = ({
  deviation = "+3.5 MW",
  actualPower = "23.5 MW",
  dsmPenaltyTop = "+3.5 MW",
  dsmPenaltyBottom = "+3.5 MW",
  chargeDischarge = "20.0 MW",
}) => {
  const deviationGradient = useColorModeValue(
    "radial-gradient(99.54% 120.38% at 99.77% 0%, rgba(255, 183, 0, 0.4) 0%, rgba(255, 255, 255, 0.5) 100%)",
    "radial-gradient(99.54% 120.38% at 99.77% 0%, rgba(255, 183, 0, 0.3) 0%, rgba(0, 0, 0, 0.3) 100%)"
  );
  const actualPowerGradient = useColorModeValue(
    "radial-gradient(99.54% 120.38% at 99.77% 0%, rgba(146, 91, 255, 0.4) 0%, rgba(255, 255, 255, 0.5) 100%)",
    "radial-gradient(99.54% 120.38% at 99.77% 0%, rgba(146, 91, 255, 0.3) 0%, rgba(0, 0, 0, 0.3) 100%)"
  );

  const dsmScheduleGradient = useColorModeValue(
    "radial-gradient(99.54% 120.38% at 99.77% 0%, rgba(85, 222, 217, 0.4) 0%, rgba(255, 255, 255, 0.5) 100%)",
    "radial-gradient(99.54% 120.38% at 99.77% 0%, rgba(30, 255, 247, 0.3) 0%, rgba(0, 0, 0, 0.3) 100%)"
  )

  const dsmPaneltyGradient = useColorModeValue(
    "radial-gradient(99.54% 120.38% at 99.77% 0%, rgba(255, 94, 0, 0.3) 0%, rgba(255, 255, 255, 0.5) 100%)",
    "radial-gradient(99.54% 120.38% at 99.77% 0%, rgba(255, 94, 0, 0.3) 0%, rgba(0, 0, 0, 0.3) 100%)"
  )

  const dsmChargeDischargeGradient = useColorModeValue(
    "radial-gradient(99.54% 120.38% at 99.77% 0%, rgba(255, 70, 203, 0.3) 0%, rgba(255, 255, 255, 0.5) 100%)",
    "radial-gradient(99.54% 120.38% at 99.77% 0%, rgba(255, 70, 203, 0.3) 0%, rgba(0, 0, 0, 0.3) 100%)"
  )
  return (
    <VStack
      w="473px"
      h="285px"
      spacing={`${GAP}px`}
      align="stretch"
      justify="space-between"
      borderRadius="12px"
      style={{ transform: "rotate(0deg)", opacity: 1 }}
    >
      {/* Top row: 3 equal small tiles */}
      <HStack spacing={`${GAP}px`} align="stretch">
        <StatTile
          label="Deviation"
          value={deviation}
          gradient={deviationGradient}
          border="rgba(255, 183, 0, 0.3)"
        />
        <StatTile
          label="Actual Power"
          value={actualPower}
          gradient={actualPowerGradient}
          border="rgba(146, 91, 255, 0.3)"
        />
        <StatTile
          label="Schedule Power"
          value={dsmPenaltyTop}
          gradient={dsmScheduleGradient}
          border="rgba(85, 222, 217, 0.3)"
        />
      </HStack>

      {/* Bottom row: left small, right double width */}
      <HStack spacing={`${GAP}px`} align="stretch">
        <StatTile
          label="DSM Penalty"
          value={dsmPenaltyBottom}
          gradient={dsmPaneltyGradient}
          border="rgba(255, 94, 0, 0.3)"
        />
        <StatTile
          label="Charge/Discharge Power"
          value={chargeDischarge}
          gradient={dsmChargeDischargeGradient}
          border="rgba(255, 70, 203, 0.3)"
          w={TILE_W * 2 + GAP}   // 308.6666px (two tiles + gap)
        />
      </HStack>
    </VStack>
  );
};

export default PowerStats;
