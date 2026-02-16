import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";

const Row = ({ label, value }: { label: string; value: string }) => {
  const labelColor = useColorModeValue("#4A5568", "#CBD5E0");
  const valueColor = useColorModeValue("#1A202C", "#E2E8F0");

  return (
    <Flex justify="space-between" fontSize="9.5px">
      <Text color={labelColor}>{label}</Text>
      <Text fontWeight="600" color={valueColor}>
        {value}
      </Text>
    </Flex>
  );
};

export default function RelaySummaryCard() {
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
      <Flex align="center" gap={1.5}>
        <Box
          w="12px"
          h="12px"
          borderRadius="full"
          bg="green.400"
          boxShadow="0 0 0 3px rgba(72,187,120,0.15)"   
        />
        <Text fontSize="13px" fontWeight="600" color={titleColor}>
          Smacty
        </Text>
      </Flex>

      {/* Divider */}
      <Box
        h="1px"
        my="8px"
        bg={useColorModeValue("#E6EDF6", "rgba(255,255,255,0.08)")}
      />

      {/* Values (UNCHANGED) */}
      <Row label="User Voltage:" value="32.5 V" />
      <Row label="Frequency:" value="49.98 Hz" />
      <Row label="Power Factor:" value="0.99" />
      <Row label="Active Power:" value="3.64 MW" />
    </Box>
  );
}
