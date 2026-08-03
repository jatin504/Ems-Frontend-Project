import React from "react";
import { Box, Grid, GridItem, VStack, useColorModeValue } from "@chakra-ui/react";

import PCSTopRibbon from "../components/DashboardComponents/PCS/widget/PCSTopRibbon";
import PCSFleetStatus from "../components/DashboardComponents/PCS/widget/PCSFleetStatus";
import PCSACPowerGraph from "../components/DashboardComponents/PCS/widget/PCSACPowerGraph";
import PCSEfficiency from "../components/DashboardComponents/PCS/widget/PCSEfficiency";
import PCSStatusSummary from "../components/DashboardComponents/PCS/widget/PCSStatusSummary";
import PCSOverview from "../components/DashboardComponents/PCS/widget/PCSOverview";
import PCSModeDistribution from "../components/DashboardComponents/PCS/widget/PCSModeDistribution";
import PCSPowerFlowOverview from "../components/DashboardComponents/PCS/widget/PCSPowerFlowOverview";
import PCSAlarmSummary from "../components/DashboardComponents/PCS/widget/PCSAlarmSummary";
import PCSAvailability from "../components/DashboardComponents/PCS/widget/PCSAvailability";

const PCSDashboard = () => {
  const pageBg = useColorModeValue("#F5F7FB", "#06172D");

  return (
    <Box
      bg={pageBg}
      minH="100vh"
      w="100%"
      p={3}
    >
      <VStack spacing={3} align="stretch">

        {/* ===================== TOP RIBBON ===================== */}
        <PCSTopRibbon />

        {/* ===================== ROW 1 ===================== */}
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "1fr 1.9fr 1.5fr",
          }}
          gap={3}
          alignItems="start"
        >
          <GridItem>
            <PCSFleetStatus />
          </GridItem>

          <GridItem mt={-6}>
            <PCSACPowerGraph />
          </GridItem>

          <GridItem mt={0} ml={0} pos="relative" left={-1}>
            <PCSOverview />
          </GridItem>
        </Grid>

        {/* ===================== ROW 2 ===================== */}
        <Grid
          templateColumns={{
            base: "1fr",
            xl: "1.1fr 1.8fr 1.1fr",
          }}
          gap={3}
        >
          <GridItem mt={-4}>
            <PCSStatusSummary />
          </GridItem>

          <GridItem mt={-4}>
            <PCSEfficiency />
          </GridItem>

          <GridItem>
            <PCSModeDistribution />
          </GridItem>
        </Grid>

        {/* ===================== ROW 3 ===================== */}
        <Grid
          templateColumns={{
            base: "1fr",
            xl: "1fr 1fr 1.25fr",
          }}
          gap={3}
        >
          <GridItem colSpan={{ base: 1, xl: 1 }}>
            <PCSPowerFlowOverview />
          </GridItem>

          <GridItem>
            <PCSAlarmSummary />
          </GridItem>

          <GridItem>
            <PCSAvailability />
          </GridItem>
        </Grid>

      </VStack>
    </Box>
  );
};

export default PCSDashboard;