// src/Dashboard/PowerFlowDashboard.tsx
import { Box, Flex } from "@chakra-ui/react";
import ControlLayout from "../components/ControlLayout";
import LimitsBox from "../components/LimitsBox";

export default function PowerFlowDashboard() {
  return (
    <Box bg="gray.800" color="white" p={4} minH="100vh">
      <Flex gap={6} align="stretch">
        {/* Column 1 - Control Panel */}
        <Box flex="1">
          <Box h="100%" minH="100%" height="100%">
            <ControlLayout />
          </Box>
        </Box>

        {/* Column 2 - Limits */}
        <Box w="320px">
          <Box h="100%" minH="100%" height="100%">
            <LimitsBox />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
