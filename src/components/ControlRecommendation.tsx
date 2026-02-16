import { Box, Text } from "@chakra-ui/react";

export default function ControlRecommendation() {
  return (
    <Box bg="gray.800" borderRadius="md" p={4}>
      <Text fontSize="md" fontWeight="bold" mb={2}>
        Control Recommendations
      </Text>
      <Text fontSize="sm" color="gray.300">
        Decrease discharge by <b>3.5 MW</b> to stay within schedule
      </Text>
    </Box>
  );
}
