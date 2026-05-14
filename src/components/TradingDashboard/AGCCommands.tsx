import { Box, Text, Badge, useColorModeValue } from "@chakra-ui/react";

const AGCCommands = () => {
  const bg = useColorModeValue("#ffffff", "#132a44");
  const border = useColorModeValue("#e2e8f0", "#1f3b5b");
  const innerBg = useColorModeValue("#edf2f7", "#1e3a5f");
  const textColor = useColorModeValue("#1a202c", "#e6e6e6");

  return (
    <Box bg={bg} p={3} borderRadius="md" border={`1px solid ${border}`}>
      <Text fontSize="sm" mb={2} color="gray.400">
        AGC Commands
      </Text>

      <Box bg={innerBg} p={2} borderRadius="md" mb={2}>
        <Text fontSize="sm" color={textColor}>
          Current Setpoint: <b>20 MW</b>
        </Text>
      </Box>

      <Box bg={innerBg} p={2} borderRadius="md">
        <Text fontSize="sm" color={textColor}>
          Frequency Response:{" "}
          <Badge colorScheme="green">ACTIVE</Badge>
        </Text>
      </Box>
    </Box>
  );
};

export default AGCCommands;