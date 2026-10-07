import { Box, Grid, GridItem, VStack, useColorModeValue } from "@chakra-ui/react";
import ControlSummaryRibbon from "../components/DashboardComponents/Dashboard/ControlSummaryRibbon";
import CostImpactToday from "../components/DashboardComponents/Dashboard/CostImpactToday";
import DSMOpportunities from "../components/DashboardComponents/Dashboard/DSMOpportunities";
import DSMSummaryToday from "../components/DashboardComponents/Dashboard/DSMSummaryToday";
import LoadBreakdown from "../components/DashboardComponents/Dashboard/LoadBreakdown";
import LoadForecastChart from "../components/DashboardComponents/Dashboard/LoadForecastChart";
import LoadVsBESSChart from "../components/DashboardComponents/Dashboard/LoadVsBESSChart";
import ControllableLoads from "../components/DashboardComponents/Dashboard/ControllableLoads";
import OptimizationSchedule from "../components/DashboardComponents/Dashboard/OptimizationSchedule";
import NextDaySchedule from "../components/DashboardComponents/Dashboard/NextDaySchedule";

const ControlNewDashboard = () => {
  const bg = useColorModeValue("#F7F9FC", "#05121F");
  const textColor = useColorModeValue("gray.700", "gray.100");

  return (
    <Box p={3} pt={1} bg={bg} minH="100vh" color={textColor}>
      <VStack spacing={2.5} align="stretch">
        <ControlSummaryRibbon />

        <Grid templateColumns={{ base: "1fr", xl: "repeat(3, 1fr)" }} gap={2.5} mt={-2}>
          <GridItem mt={-4}>
            <LoadForecastChart />
          </GridItem>

          <GridItem>
            <DSMOpportunities />
          </GridItem>

          <GridItem>
            <LoadBreakdown />
          </GridItem>
        </Grid>

        <Grid
          templateColumns={{ base: "1fr", xl: "1.2fr 1.3fr 2fr" }}
          gap={2.5}
          mt={-1}
        >
          <GridItem mt={0} minW={0} maxW="700px">
            <ControllableLoads />
          </GridItem>

          <GridItem mt={-5}>
            <LoadVsBESSChart />
          </GridItem>

          <GridItem transform={{ xl: "translateX(0px)" }}>
            <OptimizationSchedule />
          </GridItem>
        </Grid>

        <Grid
          templateColumns={{ base: "1fr", xl: "1fr 1fr 2fr" }}
          gap={2.5}
          alignItems="start"
        >
          <GridItem h="220px">
            <DSMSummaryToday />
          </GridItem>

          <GridItem h="220px">
            <CostImpactToday />
          </GridItem>

          <GridItem h="220px">
            <NextDaySchedule data={{ schedule: [] }} />
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
};

export default ControlNewDashboard;