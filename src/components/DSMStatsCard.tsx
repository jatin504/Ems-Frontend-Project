import {
  Box,
  Text,
  VStack,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";

const DSMStatsCard = () => {
  return (
    <Box bg="gray.800" borderRadius="md" p={4}>
      <VStack spacing={4} align="center" textAlign="center" w="full">
        {/* Scheduled Power */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="gray.300">
            Scheduled Power
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="blue.400">
            20.0 <Text as="span" fontSize="lg">MW</Text>
          </Text>
        </Box>

        {/* Actual Power */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="gray.300">
            Actual Power
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="green.300">
            23.5 <Text as="span" fontSize="lg">MW</Text>
          </Text>
        </Box>

        {/* Deviation */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="gray.300">
            Deviation
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="red.400">
            +3.5 <Text as="span" fontSize="lg">MW</Text>
          </Text>
        </Box>

        {/* DSM Penalty */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="gray.300">
            DSM Penalty
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="white">
            ₹ 2,800
          </Text>
        </Box>

        {/* Circular Gauge */}
        <Box pt={2}>
          <Text fontSize="sm" fontWeight="medium" color="gray.300">
            SOC %
          </Text>
          <CircularProgress
            value={57}
            size="100px"
            color="green.300"
            thickness="10px"
            trackColor="gray.700"
          >
            <CircularProgressLabel>
              <Text fontSize="lg" fontWeight="bold">
                57 <Text as="span" fontSize="md">%</Text>
              </Text>
            </CircularProgressLabel>
          </CircularProgress>
        </Box>
      </VStack>
    </Box>
  );
};

export default DSMStatsCard;
