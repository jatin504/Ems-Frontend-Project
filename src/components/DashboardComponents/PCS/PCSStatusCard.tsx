import React from "react";
import { Box, Grid, Text, useColorModeValue } from "@chakra-ui/react";

interface PCSStatusCardProps {
  pcs: {
    dcPower: number | string;
    acPower: number | string;
    prActual: number | string;
    prEst: number | string;
    qKvar: number | string;
    setpointP: number | string;
    setpointQ: number | string;
    performancePct: number | string;
  };
}

const PCSStatusCard: React.FC<PCSStatusCardProps> = ({ pcs }) => {
  const bg = useColorModeValue("white", "#1A202C");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const dividerColor = useColorModeValue("gray.200", "gray.700");
  const labelColor = useColorModeValue("gray.500", "gray.400");

  const stats = [
    [
      { label: "DC Power", value: pcs.dcPower, unit: "kW" },
      { label: "PR Actual", value: pcs.prActual, unit: "%" },
      { label: "Setpoint P", value: pcs.setpointP, unit: "kW" },
    ],
    [
      { label: "AC Power", value: pcs.acPower, unit: "kW" },
      { label: "PR Estimated", value: pcs.prEst, unit: "%" },
      { label: "Setpoint Q", value: pcs.setpointQ, unit: "kVAR" },
    ],
    [
      { label: "Reactive Power (Q)", value: pcs.qKvar, unit: "kVAR" },
      { label: "Sp. Power", value: pcs.performancePct, unit: "" },
      null,
    ],
  ];

  return (
    <Box
      bg={bg}
      borderRadius="md"
      border="1px solid"
      borderColor={borderColor}
      p={4}
    >
      <Grid templateColumns="repeat(3, 1fr)" columnGap={8}>
        {stats.map((column, colIndex) => (
          <Box
            key={colIndex}
            pl={colIndex !== 0 ? 6 : 0}
            borderLeft={colIndex !== 0 ? "1px solid" : "none"}
            borderColor={dividerColor}
          >
            <Grid rowGap={4}>
              {column.map(
                (stat, idx) =>
                  stat && (
                    <Box key={idx}>
                      <Text
                        fontSize="sm"
                        color={labelColor}
                        fontWeight="medium"
                        mb="2px"
                      >
                        {stat.label}
                      </Text>
                      <Text fontSize="lg" fontWeight="bold">
                        {stat.value ?? "--"} {stat.unit}
                      </Text>
                    </Box>
                  )
              )}
            </Grid>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default PCSStatusCard;
