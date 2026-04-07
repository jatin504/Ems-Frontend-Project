import { Box, Text, VStack, HStack, useColorModeValue } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

const AlertsPanel = () => {
  const bg = useColorModeValue("white", "#161B1B");
  const headingColor = useColorModeValue("gray.700", "gray.100");
  const bodyColor = useColorModeValue("gray.600", "gray.300");
  const dotColor = useColorModeValue("gray.400", "gray.500");

  return (
    <Box
      bg={bg}
      borderRadius="10px"
      p="12px"
      boxShadow="sm"
      width="100%"
      minH="140px"
    >
      {/* Header */}
      <HStack justify="space-between" mb="8px">
        <Text fontSize="13px" fontWeight="600" color={headingColor}>
          Alerts & Exceptions
        </Text>

        {/* right small icons */}
        <HStack spacing="4px">
          <Box w="4px" h="4px" bg={dotColor} borderRadius="full" />
          <Box w="4px" h="4px" bg={dotColor} borderRadius="full" />
        </HStack>
      </HStack>

      {/* Alerts List */}
      <VStack align="start" spacing="10px">
        <HStack spacing="8px">
          <WarningIcon color="orange.400" boxSize="14px" />
          <Text fontSize="12px" color={bodyColor}>
            PR below threshold (65% vs 71%)
          </Text>
        </HStack>

        <HStack spacing="8px">
          <WarningIcon color="orange.400" boxSize="14px" />
          <Text fontSize="12px" color="gray.600">
            Curtailment overlap with inverter downtime
          </Text>
        </HStack>

        <HStack spacing="8px">
          <WarningIcon color="orange.400" boxSize="14px" />
          <Text fontSize="12px" color="gray.600">
            Missing irradiance data at 1:00 PM
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default AlertsPanel;