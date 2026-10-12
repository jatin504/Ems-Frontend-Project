import { Box, Grid, GridItem, VStack, useColorModeValue } from "@chakra-ui/react";
import ControlSummaryRibbon from "../components/DashboardComponents/Dashboard/ControlSummaryRibbon";
import DSMOpportunities from "../components/DashboardComponents/Dashboard/DSMOpportunities";
import LoadBreakdown from "../components/DashboardComponents/Dashboard/LoadBreakdown";
import LoadForecastChart from "../components/DashboardComponents/Dashboard/LoadForecastChart";
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
          templateColumns={{
            base: "1fr",
            xl: "repeat(2, minmax(0, 1fr))",
          }}
          gap={2.5}
          mt={-1}
        >
          <GridItem minW={0}>
            <Box minH="500px">
              <NextDaySchedule />
            </Box>
          </GridItem>

          <GridItem minW={0}>
            <VStack spacing={2.5} align="stretch">
              <Box h="100%" minH="520px">
                <OptimizationSchedule />
              </Box>

              <Box minH="250px" mt={-28}>
                <ControllableLoads />
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
};

export default ControlNewDashboard;