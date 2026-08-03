import React from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";

export default function CellHealthIndicators() {
  const bg = useColorModeValue("#fff", "#071826");
  const color = useColorModeValue("#0F172A", "#fff");

  return (
    <Box bg={bg} borderRadius="10px" h="100%" p="12px" border="1px solid" borderColor={useColorModeValue("#E2E8F0","#15344D") }>
      <Text color={color} fontWeight={600} textAlign="center">Cell Health Indicators (placeholder)</Text>
    </Box>
  );
}
