import React, { useEffect } from "react";
import { Box, Grid, HStack, VStack, useColorModeValue } from "@chakra-ui/react";

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
  const widgetBorder = useColorModeValue("#E2E8F0", "rgba(255,255,255,0.12)");
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
      minW={0}
      bg={useColorModeValue("#F3F6F9", "#0B1220")}
      sx={{
        ".bess-widget": { minWidth: 0 },
        ".bess-widget > :not(:fullscreen)": {
          width: "100%",
          minWidth: 0,
          maxWidth: "100%",
          height: "100%",
          margin: 0,
          border: "1px solid",
          borderColor: widgetBorder,
          borderRadius: "12px",
          boxShadow: "none",
        },
      }}
    >
      <Grid
        id="bess-first-row"
        templateColumns={{ base: "minmax(0, 1fr)", xl: "minmax(0, 1fr) minmax(0, 1.03fr) minmax(0, 1.14fr)" }}
        gap={3}
        alignItems="stretch"
      >
        <HStack spacing={3} align="stretch" minW={0} h="300px">
          <Box className="bess-widget" flex={1}><PlantCard /></Box>
          <Box className="bess-widget" flex={1}><MeterCard /></Box>
        </HStack>
        <Box className="bess-widget" h="300px"><MeterWidget /></Box>
        <Box className="bess-widget" h="300px"><PCSOverview /></Box>
      </Grid>

      <Grid
        id="bess-second-row"
        templateColumns={{ base: "minmax(0, 1fr)", xl: "minmax(0, 1fr) minmax(0, 1.03fr) minmax(0, 1.14fr)" }}
        gap={3}
        mt={3}
        alignItems="stretch"
      >
        <VStack id="bess-left-column" spacing={3} align="stretch" minW={0}>
          <Box className="bess-widget" h="330px"><Flow /></Box>
          <Box className="bess-widget" h="180px"><PCSLifetimeThroughput /></Box>
          <Box className="bess-widget" h="150px"><SOCSummary /></Box>
        </VStack>
        <VStack id="bess-center-column" spacing={3} align="stretch" minW={0}>
          <Box className="bess-widget" h="330px"><EnergyOverview /></Box>
          <Box className="bess-widget" h="342px"><EnergyPowerTrend /></Box>
        </VStack>
        <Box id="bess-right-column" className="bess-widget" h="684px"><Banksummary /></Box>
      </Grid>
    </Box>
  );
};

export default BessDashboard;
