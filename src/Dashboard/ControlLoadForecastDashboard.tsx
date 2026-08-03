import { Box, HStack, VStack } from "@chakra-ui/react";

import LoadForecastTopRibbon from "../components/DashboardComponents/Loadforcast/LoadForecastTopRibbon";
import LoadForecastVsTarget from "../components/DashboardComponents/Loadforcast/LoadForecastVsTarget";
import LoadClassificationStatus from "../components/DashboardComponents/Loadforcast/LoadClassificationStatus";
import { DSMControlMode } from "../components/DashboardComponents/Loadforcast/DSMControlMode";

import ControllableLoads from "../components/DashboardComponents/Loadforcast/ControllableLoads";
import DSMEventTimeline from "../components/DashboardComponents/Loadforcast/DSMEventTimeline";
import UpcomingDSMSchedule from "../components/DashboardComponents/Loadforcast/UpcomingDSMSchedule";

export default function ControlLoadForecastDashboard() {
  return (
    <Box p="14px">
      <VStack spacing="8px" align="stretch">
        {/* First Row */}
        <Box mt="8px">
          <LoadForecastTopRibbon />
        </Box>

        {/* Second Row */}
        <HStack spacing="4px" align="start">
          <Box flex="2" h="470px">
            <LoadForecastVsTarget />
          </Box>

          <Box flex="1" h="430px">
            <LoadClassificationStatus />
          </Box>

          <Box flex="0.9" h="430px">
            <DSMControlMode />
          </Box>
        </HStack>

        {/* Third Row */}
        <HStack spacing="12px" align="start" mt="-16px">
          {/* Left Table */}
          <Box flex="1.8" minW="300px" h="470px">
            <ControllableLoads />
          </Box>

          {/* Right Side */}
          <VStack flex="0.9" spacing="6px" align="stretch">
            <Box h="225px">
              <DSMEventTimeline />
            </Box>

            <Box h="225px">
              <UpcomingDSMSchedule />
            </Box>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
}