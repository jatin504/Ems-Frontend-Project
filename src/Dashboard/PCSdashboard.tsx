import React from "react";
import { Box, HStack } from "@chakra-ui/react";
import PCSPowerGraph from "../components/DashboardComponents/PCS/PCSPowerGraph";
import PCSYieldGraph from "../components/DashboardComponents/PCS/PCSYieldGraph";
import PCSSoCGraph from "../components/DashboardComponents/PCS/PCSSoCGraph";
import PCSAlertsTable from "../components/DashboardComponents/PCS/PCSAlertsTable";
import PCSInvertersPanel from "../components/DashboardComponents/PCS/PCSInvertersPanel";

const PCSdashboard = () => {
  return (
    <Box width="100%" maxW="1920px" mx="auto" px="0">
      {/* First Row */}
      <HStack width="100%" spacing="20px" mb="20px" overflow="hidden">
        <Box width="626px" height="330px">
          <PCSPowerGraph />
        </Box>
        <Box width="626px" height="330px">
          <PCSYieldGraph />
        </Box>
        <Box width="626px" height="330px">
          <PCSSoCGraph />
        </Box>
      </HStack>
      {/* Second Row */}
      <HStack width="100%" spacing="20px">
        <Box width="50%" height="420px">
          <PCSAlertsTable />
        </Box>
        <Box width="49%" height="420px">
          <PCSInvertersPanel />
        </Box>
      </HStack>
    </Box>
  );
};

export default PCSdashboard;