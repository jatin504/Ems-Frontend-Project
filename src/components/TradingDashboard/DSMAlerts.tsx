import { Box, Text, useColorModeValue } from "@chakra-ui/react";

const DSMAlerts = () => {
  const bg = useColorModeValue("#ffffff", "#132a44");
  const border = useColorModeValue("#e2e8f0", "#1f3b5b");

  return (
    <Box
      bg={bg}
      p={4}
      borderRadius="md"
      border={`1px solid ${border}`}
      minH="250px"   // increased height
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <Text fontSize="sm" mb={3} color="gray.400">
        DSM Alerts
      </Text>

      <Box bg="#3b1f1f" p={3} borderRadius="md" mb={3}>
        <Text fontSize="sm" color="#f59e0b">
          ⚠ High Ramp Limit Warning
        </Text>
      </Box>

      <Box bg="#3b1f1f" p={3} borderRadius="md">
        <Text fontSize="sm" color="#ef4444">
          ⚠ SOC Below Threshold
        </Text>
      </Box>
    </Box>
  );
};

export default DSMAlerts;