import React, { useEffect } from "react";
import { Box, HStack, VStack } from "@chakra-ui/react";

import PlantCard from "../components/DashboardComponents/BessOverview/PlantCard";
import MeterCard from "../components/DashboardComponents/BessOverview/MeterCard";
import PCSLifetimeThroughput from "../components/DashboardComponents/BessOverview/PCSLifetimeThroughput";
import SOCSummary from "../components/DashboardComponents/BessOverview/SOCSummary";
import PCSOverview from "../components/DashboardComponents/BessOverview/PCSOverview";
import EnergyOverview from "../components/DashboardComponents/BessOverview/EnergyOverview";
import Banksummary from "../components/DashboardComponents/BessOverview/Banksummary";
import EnergyPowerTrend from "../components/DashboardComponents/BessOverview/EnergyPowerTrend";
import Flow from "../components/DashboardComponents/BessOverview/Flow";
import MeterWidget from "../components/DashboardComponents/BessOverview/MeterWidget";
// import MeterWidget from "./SolarviewDashboard/Widgets/MeterWidget";

const BessDashboard = () => {
  useEffect(() => {
    const logLayout = () => {
      const getBox = (id: string) => {
        const el = document.getElementById(id);

        if (!el) {
          console.log(`${id}: NOT FOUND`);
          return;
        }

        const rect = el.getBoundingClientRect();

        console.log(`${id}:`, {
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
          bottom: rect.bottom,
          right: rect.right,
        });
      };

      console.log("========== BESS DASHBOARD ==========");
      console.log("Window:", {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      });

      console.log("Document:", {
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        clientWidth: document.documentElement.clientWidth,
        clientHeight: document.documentElement.clientHeight,
      });

      getBox("bess-dashboard");
      getBox("bess-first-row");
      getBox("bess-second-row");
      getBox("bess-left-column");
      getBox("bess-center-column");
      getBox("bess-right-column");

      console.log("====================================");
    };

    logLayout();

    window.addEventListener("resize", logLayout);

    return () => {
      window.removeEventListener("resize", logLayout);
    };
  }, []);

  return (
    <Box
      id="bess-dashboard"
      w="100%"
      maxW="100%"
      overflowX="hidden"
      overflowY="visible"
      bg="#F3F6F9"
    >
      {/* FIRST ROW */}
      <HStack
        id="bess-first-row"
        spacing={2}
        align="flex-start"
        h="fit-content"
        minH="0"
        flex="none"
      >
        <Box w="280px" flex="none">
          <PlantCard />
        </Box>

        <Box w="280px" flex="none">
          <MeterCard />
        </Box>

        <Box w="280px" flex="none" mt={-5}>
          <MeterWidget />
        </Box>

        <Box
          w="calc(100% - 860px)"
          minW="0"
          flex="1"
          ml={310}
          mt={-2}
        >
          <PCSOverview />
        </Box>
      </HStack>

      {/* SECOND ROW */}
      <HStack
        id="bess-second-row"
        spacing={2}
        align="flex-start"
        mt={2}
        w="100%"
        maxW="100%"
        overflow="hidden"
      >
        {/* LEFT COLUMN */}
        <VStack
          id="bess-left-column"
          spacing={2}
          align="stretch"
          w="38%"
          minW="0"
          h="fit-content"
          flexShrink={1}
        >
          {/* System Topology */}
          <Box
            w="100%"
            h="330px"
            flexShrink={0}
          >
            <Flow />
          </Box>

          {/* Meter Widget replaced by lifetime throughput + SOC summary */}
          <VStack
            w="560px"
            spacing={2}
            align="stretch"
            flexShrink={0}
            mt={0}
          >
            <PCSLifetimeThroughput />
            <SOCSummary />
          </VStack>
        </VStack>

        {/* CENTER COLUMN */}
        <VStack
          id="bess-center-column"
          spacing={2}
          align="stretch"
          w="42%"
          minW="0"
          flexShrink={1}
        >
          {/* Energy Overview */}
          <Box mt="-16px" ml={-120} flexShrink={0}>
            <EnergyOverview />
          </Box>

          {/* Energy Power Trend - Meter Widget ke right */}
          <Box mt="-18px" ml={-120} flexShrink={0}>
            <EnergyPowerTrend />
          </Box>
        </VStack>

        {/* RIGHT */}
        <Box
          id="bess-right-column"
          w="20%"
          minW="0"
          flexShrink={1}
          ml={-290}
        >
          <Banksummary />
        </Box>
      </HStack>
    </Box>
  );
};

export default BessDashboard;