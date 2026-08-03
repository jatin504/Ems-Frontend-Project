import React from "react";
import { Box, Grid, GridItem } from "@chakra-ui/react";

import PlantCard from "../components/DashboardComponents/BessOverview/PlantCard";
import MeterCard from "../components/DashboardComponents/BessOverview/MeterCard";
import PCSLifetimeThroughput from "../components/DashboardComponents/BessOverview/PCSLifetimeThroughput";
import PCSOverview from "../components/DashboardComponents/BessOverview/PCSOverview";
import EnergyOverview from "../components/DashboardComponents/BessOverview/EnergyOverview";
import Banksummary from "../components/DashboardComponents/BessOverview/Banksummary";
import EnergyPowerTrend from "../components/DashboardComponents/BessOverview/EnergyPowerTrend";
import MeterWidget from "../components/DashboardComponents/BessOverview/MeterWidget";
import Flow from "../components/DashboardComponents/BessOverview/Flow";

const BessDashboard = () => {
  return (
    <Box p={4} w="100%">
      <Grid
        templateColumns="280px 280px 620px 650px"
        templateRows="auto auto auto"
        gap={4}
      >
        {/* Row 1 */}
        <GridItem colSpan={1}>
          <PlantCard />
        </GridItem>

        <GridItem colSpan={1}>
          <MeterCard />
        </GridItem>

        <GridItem colSpan={1}>
          <PCSLifetimeThroughput />
        </GridItem>

        <GridItem colSpan={1}>
          <PCSOverview />
        </GridItem>

        {/* Row 2 */}
        <GridItem colSpan={2}>
          <Box
            w="100%"
            h="320px"
            bg="white"
            borderRadius="12px"
            border="1px solid"
            borderColor="gray.200"
          >
            <Flow />
          </Box>
        </GridItem>

        <GridItem alignSelf="start" mt="-16px">
          <EnergyOverview />
        </GridItem>

        {/* Banks Summary (Row 2 + Row 3) */}
        <GridItem rowSpan={2}>
          <Banksummary />
        </GridItem>

        {/* Row 3 */}
        <GridItem colSpan={2} mt={-4}>
          <MeterWidget />
        </GridItem>

        <GridItem mt={-4}>
          <EnergyPowerTrend />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default BessDashboard;