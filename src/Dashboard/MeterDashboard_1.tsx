import {
  Box,
  Grid,
  VStack,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { useEffect, useMemo, useState } from "react";

import SummaryCards from "../components/DashboardComponents/MeterComponents/SummaryCards";
import MeterTabs from "../components/DashboardComponents/MeterComponents/MeterTabs";
import OutgoingMeterDashboard from "./OutgoingMeterDashboard.tsx";
import AuxiliaryMeterDashboard from "./AuxiliaryMeterDashboard.tsx";
import LTMeterDashboard from "./LTMeterDashboard.tsx";
import MeterTables from "../components/DashboardComponents/MeterComponents/MeterTables";
import MeterCharts from "../components/DashboardComponents/MeterComponents/MeterCharts";
import MeterStatusSummary from "../components/DashboardComponents/MeterComponents/MeterStatusSummary";
import RecentMeterAlarms from "../components/DashboardComponents/MeterComponents/RecentMeterAlarms";

import { useDevices } from "../hooks/useDevices";

const MeterDashboard_1 = () => {

  
  const [activeTab, setActiveTab] = useState("Plant Meters Overview");

 

  const pageBg = useColorModeValue("#f3f7fb", "primary.dark");
  const topBarBg = useColorModeValue("white", "primary.dark");

  return (
  <Box
    w="100%"
    minH="100vh"
    bg={pageBg}
    p="12px"
  >
    <VStack spacing="8px" align="stretch">

      {/* TOP BAR */}
      <HStack
        justify="space-between"
        bg={topBarBg}
        p="10px 14px"
        borderRadius="10px"
      >
        <MeterTabs activeTab={activeTab} onChange={setActiveTab} />

        {/* Dropdown moved into OutgoingMeterDashboard */}
      </HStack>

      {/* DASHBOARD VIEWS */}
      {activeTab === "Outgoing Meters" ? (
        <OutgoingMeterDashboard />
      ) : activeTab === "Auxiliary Meters" ? (
        <AuxiliaryMeterDashboard />
      ) : activeTab === "LT Meters" ? (
        <LTMeterDashboard />
      ) : (
        <>
          <SummaryCards />

          <Box mb="6px">
            <MeterTables />
          </Box>

          <MeterCharts />

          <Grid
            templateColumns={{
              base: "1fr",
              xl: "320px 1fr",
            }}
            gap="12px"
          >
            <MeterStatusSummary />

            <RecentMeterAlarms />
          </Grid>
        </>
      )}

    </VStack>
  </Box>

  );
};

export default MeterDashboard_1;