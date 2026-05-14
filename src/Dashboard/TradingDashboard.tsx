import { Box, Grid, useColorModeValue } from "@chakra-ui/react";
import AssetOverview from "../components/TradingDashboard/AssetOverview";
import MarketChartContainer from "../components/TradingDashboard/MarketChartContainer";
import RightPanel from "../components/TradingDashboard/RightPanel";
import ForecastSection from "../components/TradingDashboard/ForecastSection";
import UpcomingBids from "../components/TradingDashboard/UpcomingBids";

const TradingDashboard = () => {
  const bg = useColorModeValue("gray.50", "#0b1a2a");
  const textColor = useColorModeValue("gray.900", "white");

  return (
    <Box bg={bg} p={4} minH="100vh" color={textColor}>
      
      {/* 🔝 TOP SECTION */}
      <Grid templateColumns="300px 1fr 300px" gap={4} alignItems="start">
        
        {/* LEFT */}
        <AssetOverview />

        {/* CENTER */}
        <Box mt="-2px">
          <MarketChartContainer />
        </Box>

        {/* RIGHT */}
        <RightPanel />
      </Grid>

      {/* 🔻 FORECAST SECTION */}
      <Grid templateColumns="1fr 1fr 1fr" gap={4} mt={4}>
        
        <ForecastSection
          title="Price Forecast (RTM/DAM)"
          color="#22c55e" // 🟢 Green
        />

        <ForecastSection
          title="Solar Generation Forecast"
          color="#facc15" // 🟡 Yellow
        />

        <ForecastSection
          title="Load Forecast"
          color="#3b82f6" // 🔵 Blue
        />

      </Grid>

      {/* 🔻 BOTTOM TABLE */}
      <Box mt={4}>
        <UpcomingBids />
      </Box>
    </Box>
  );
};

export default TradingDashboard;