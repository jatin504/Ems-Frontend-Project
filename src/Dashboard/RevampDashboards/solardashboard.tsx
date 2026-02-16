import React from "react";
import { Box, VStack, HStack, useColorModeValue } from "@chakra-ui/react";

/* SOLAR WIDGET IMPORTS */
import POIMeter from "../../components/DashboardComponents/SolarDashboardComponents/Widget/POIMeter";
import GlobalInfo from "../../components/DashboardComponents/SolarDashboardComponents/Widget/GlobalInfo";
import MeanAndPQ from "../../components/DashboardComponents/SolarDashboardComponents/Widget/MeanAndPQ";
// import ManualOverride from "../../components/DashboardComponents/SolarDashboardComponents/Widget/ManualOverride";
import CapacityAndStrategyCard from "../../components/DashboardComponents/SolarDashboardComponents/Widget/CapacityAndStrategyCard";
import AnalyticsChart from "../../components/DashboardComponents/SolarDashboardComponents/Widget/AnalyticsChart";
// import NewAnalyticsChart from "../../components/DashboardComponents/SolarDashboardComponents/Widget/EnergyBlockChart";
import ControlServices from "../../components/DashboardComponents/SolarDashboardComponents/Widget/ControlServices";
import ScheduledCommands from "../../components/DashboardComponents/SolarDashboardComponents/Widget/ScheduledCommands";
import ChargeDischargeChart from "../../components/DashboardComponents/SolarDashboardComponents/Widget/ChargeDischargeChart";
import SystemOverview from "../../components/DashboardComponents/SolarDashboardComponents/Widget/SystemOverview";
import SoCWithChargeCard from "../../components/DashboardComponents/SolarDashboardComponents/Widget/SoCWithChargeCard";

const GAP = 20;

export default function SolarDashboard() {
  const pageBg = useColorModeValue("gray.50", "#0B0F0F");
  const canvasBg = useColorModeValue("#FFFFFF", "#0F1414");

  return (
    <Box w="100%" minH="100%" bg={pageBg}>
      <Box w="100%" minH="100%" bg={canvasBg}>
        <VStack align="stretch" spacing="20px" pb="0" w="full" h="full">
          {/* ================= ROW 1 ================= */}
          <HStack align="stretch" w="full" h="260px" spacing="20px">
            <Box flex="0 0 447px" minW="447px" h="260px">
              <SystemOverview />
            </Box>
            <Box flex="0 0 327px" minW="327px" h="260px">
              <SoCWithChargeCard />
            </Box>
            <Box flex="0 0 362px" minW="362px" h="260px">
              <POIMeter />
            </Box>
            <Box flex="0 0 332px" minW="332px" h="260px">
              <GlobalInfo />
            </Box>
            <Box flex="0 0 332px" minW="332px" h="260px">
              <MeanAndPQ />
            </Box>
          </HStack>

          {/* ================= ROW 2 ================= */}
          <HStack align="stretch" w="full" h="619px" spacing="20px">
            {/* LEFT */}
            <VStack
              w="1176px"
              h="619px"
              spacing="0px"
              align="stretch"
              flex="0 0 1176px"
            >
              <HStack spacing="20px" align="stretch" h="214px" justify="flex-start">
                {/* <Box flex="0 0 578px" minW="578px" h="214px">
                  <ManualOverride />
                </Box> */}
                <Box flex="0 0 578px" minW="578px" h="214px" ml="470px">
                  <CapacityAndStrategyCard />
                </Box>
              </HStack>
              <HStack spacing="20px" align="stretch" h="385px">
                <Box flex="0 0 578px" minW="578px" h="385px">
                  <AnalyticsChart />
                </Box>
                <Box flex="0 0 578px" minW="578px" h="385px">
                  <ChargeDischargeChart />
                </Box>
              </HStack>
            </VStack>
            {/* RIGHT */}
            <HStack
              w="684px"
              h="619px"
              spacing="20px"
              align="stretch"
              flex="0 0 684px"
            >
              <Box flex="0 0 332px" minW="332px" h="619px">
                <ControlServices />
              </Box>
              <Box flex="0 0 332px" minW="332px" h="619px">
                <ScheduledCommands />
              </Box>
            </HStack>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}
