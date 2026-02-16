// ElectricalParamsCard.tsx
import { Box, Flex, Text, VStack, useColorModeValue } from "@chakra-ui/react";

const ParamRow = ({ label, value }: { label: string; value: string }) => (
  <Flex justify="space-between">
    <Text fontSize="11px" color={useColorModeValue("#4A5568", "#CBD5E0")}>{label}</Text>
    <Text fontSize="11px" fontWeight="bold" color={useColorModeValue("#1A202C", "white")}>
      {value}
    </Text>
  </Flex>
);

export default function ElectricalParamsCard() {
  const bg = useColorModeValue("#FFFFFF", "#1A202C");
  const color = useColorModeValue("#1A202C", "white");
  const titleColor = useColorModeValue("#2D3748", "#E2E8F0");
  const borderColor = useColorModeValue("#E2E8F0", "#4A5568");

  return (
    <Box
      bg={bg}
      color={color}
      p={3}
      borderRadius="md"
      border={`1px solid ${borderColor}`}
      w="260px"
      h="120px"
    >
      <Text fontSize="12px" fontWeight="bold" mb={2} color={titleColor}>
        Key Electrical Parameters
      </Text>

      <VStack spacing={1.5} align="stretch">
        <ParamRow label="Voltage" value="32.5 kV" />
        <ParamRow label="Frequency" value="49.98 Hz" />
        <ParamRow label="Power Factor" value="0.99" />
      </VStack>
    </Box>
  );
}
