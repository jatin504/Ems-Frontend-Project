import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

const Row = ({ label, value }: { label: string; value: string }) => (
  <Flex justify="space-between" fontSize="8px">
    <Text opacity={0.8}>{label}</Text>
    <Text fontWeight="600">{value}</Text>
  </Flex>
);

export default function FaultDetailsPanel() {
  const bg = useColorModeValue("#FFFFFF", "#0B1220");
  const border = useColorModeValue(
    "rgba(0,0,0,0.06)",
    "rgba(255,255,255,0.08)"
  );
  const titleColor = useColorModeValue("#1A202C", "#E2E8F0");

  return (
    <Box
      bg={bg}
      border={`1px solid ${border}`}
      borderRadius="14px"                 
      p="12px"
      w="100%"
      boxShadow={useColorModeValue(
        "0 8px 22px rgba(0,0,0,0.06)",
        "0 10px 30px rgba(0,0,0,0.45)"
      )}
      transition="all 0.2s ease"
      _hover={{
        boxShadow: useColorModeValue(
          "0 10px 26px rgba(0,0,0,0.08)",
          "0 12px 36px rgba(0,0,0,0.6)"
        ),
      }}
    >
      {/* Header */}
      <Flex align="center" gap={2} mb={2}>
        <WarningIcon color="orange.400" boxSize={3} />
        <Text fontSize="9px" fontWeight="600" color={titleColor}>
          Fault Details
        </Text>
      </Flex>

      {/* Content (UNCHANGED) */}
      <Row label="Trip Time" value="11:41:02" />
      <Row label="Trip Cause" value="Phase Overcurrent" />

      <Box
        h="1px"
        my="6px"
        bg={useColorModeValue("#E6EDF6", "rgba(255,255,255,0.08)")}
      />

      <Row label="IA" value="764 A" />
      <Row label="IB" value="723 A" />
      <Row label="IC" value="698 A" />
    </Box>
  );
}
