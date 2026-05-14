import { Box, Text, useColorModeValue } from "@chakra-ui/react";

const RealTimeMarket = () => {
  const bg = useColorModeValue("#ffffff", "#132a44");
  const border = useColorModeValue("#e2e8f0", "#1f3b5b");
  const innerBg = useColorModeValue("#edf2f7", "#1e3a5f");
  const textColor = useColorModeValue("#1a202c", "#e6e6e6");

  return (
    <Box bg={bg} p={3} borderRadius="md" border={`1px solid ${border}`}>
      <Text fontSize="sm" mb={2} color="gray.400">
        Real-Time Market
      </Text>

      <Box bg={innerBg} p={2} borderRadius="md" mb={2}>
        <Text fontSize="sm" color={textColor}>
          Buy: ₹4,500 / MWh
        </Text>
      </Box>

      <Box bg={innerBg} p={2} borderRadius="md">
        <Text fontSize="sm" color={textColor}>
          Sell: ₹6,200 / MWh
        </Text>
      </Box>
    </Box>
  );
};

export default RealTimeMarket;