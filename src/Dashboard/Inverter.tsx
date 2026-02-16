import React from "react";
import { Box, HStack, VStack } from "@chakra-ui/react";
import InverterPowerGraph from "../components/DashboardComponents/Inverter/InverterPowerGraph";
import InverterYieldGraph from "../components/DashboardComponents/Inverter/InverterYieldGraph";
import InverterPRvsYieldGraph from "../components/DashboardComponents/Inverter/InverterPRvsYieldGraph";
import AlertsTable from "../components/DashboardComponents/Inverter/AlertsTable";
import InvertersPanel from "../components/DashboardComponents/Inverter/InvertersPanel";

const InverterDashboard = () => {
  return (
    <Box width="100%" maxW="1920px" mx="auto">
      
      {/* First Row */}
      <HStack width="100%" spacing="20px" mb="20px" overflow="hidden">
        <Box width="626px" height="330px">
          <InverterPowerGraph />
        </Box>
        <Box width="626px" height="330px">
          <InverterYieldGraph />
        </Box>
        <Box width="626px" height="330px">
          <InverterPRvsYieldGraph />  {/*Heatmap*/}
        </Box>
      </HStack>

      {/* Second Row */}
      <HStack width="100%" spacing="20px">
        <Box width="50%" height="420px">
          <AlertsTable />
        </Box>
        <Box width="49%" height="420px">
          <InvertersPanel />
        </Box>
      </HStack>

    </Box>
  );
};



export default InverterDashboard;
