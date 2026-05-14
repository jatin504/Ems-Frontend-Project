import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import MarketChart from "./MarketChart";
import BottomChart from "./BottomChart";

const MarketChartContainer = () => {
  const bg = useColorModeValue("#ffffff", "#0f2235");
  const border = useColorModeValue("#e2e8f0", "#1f3b5b");
  const titleColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Box
      bg={bg}
      border={`1px solid ${border}`}
      borderRadius="lg"
      p={3}
      boxShadow="0 4px 12px rgba(0,0,0,0.2)"
    >
      {/*  TITLE (wapas add) */}
      <Text
        mb={2}
        fontSize="sm"
        fontWeight="600"
        color={titleColor}
      >
        Dispatch Schedule & Market Integration
      </Text>

      {/* 🔝 TOP CHART */}
      <MarketChart />

      {/* 🔻 OVERLAP (tight look) */}
      <Box mt="-12px">
        <BottomChart />
      </Box>
    </Box>
  );
};

export default MarketChartContainer;