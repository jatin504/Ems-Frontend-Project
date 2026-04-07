// src/components/DashboardComponents/PassDashboard/BillingSummary.tsx

import { Box, Text, HStack, VStack, useColorModeValue } from "@chakra-ui/react";

const BillingSummary = () => {
  const bg = useColorModeValue("white", "#161B1B");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const minorColor = useColorModeValue("gray.500", "gray.300");
  const borderColor = useColorModeValue("#eee", "rgba(255,255,255,0.15)");

  return (
    <Box bg={bg} borderRadius="12px" p="12px" boxShadow="sm">
      <VStack align="stretch" spacing={2}>
        
        <HStack justify="space-between">
          <Text fontSize="13px" color={textColor}>
            Deemed Energy
          </Text>
          <Text fontSize="13px" fontWeight="600" color={textColor}>
            104,676 kWh
          </Text>
        </HStack>

        <HStack justify="space-between">
          <Text fontSize="12px" color={minorColor}>
            Tariff: ₹9.25/kWh
          </Text>
          <Text fontSize="13px" fontWeight="600" color={textColor}>
            ₹ 3,40,197
          </Text>
        </HStack>

        <HStack justify="space-between" pt="6px" borderTop={`1px solid ${borderColor}`}>
          <Text fontSize="13px" fontWeight="600" color={textColor}>
            Total
          </Text>
          <Text fontSize="14px" fontWeight="700" color={textColor}>
            ₹ 3,40,197
          </Text>
        </HStack>

      </VStack>
    </Box>
  );
};

export default BillingSummary;