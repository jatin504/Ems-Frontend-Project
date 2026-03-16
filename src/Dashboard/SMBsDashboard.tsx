import React from "react";
import { Box, HStack, VStack } from "@chakra-ui/react";

import SmbStaticInfos from "../components/DashboardComponents/SMB/SmbStaticInfos";
import SmbPower from "../components/DashboardComponents/SMB/SmbPower";
import SmbStringStatus from "../components/DashboardComponents/SMB/SmbStringStatus";

import SMBvsStringGraph from "../components/DashboardComponents/SMB/SMBvsStringGraph";
import StringTable from "../components/DashboardComponents/SMB/StringTable";
import POAvsDCCurrentGraph from "../components/DashboardComponents/SMB/POAvsDCCurrentGraph";
import VoltAmpsCurve from "../components/DashboardComponents/SMB/VoltAmpsCurve";

const SMBsDashboard = () => {
  return (
    <Box
      mt="8px"
      w="100%"          //  FULL WIDTH
      mx="10px"         //  left + right = 10px only
      px="0"
      minH="calc(100vh - 160px)"
      overflowY="auto"
    >
      <VStack spacing="12px" align="stretch">
        {/* ===== 1st ROW ===== */}
        <HStack w="100%" spacing="20px" h="260px" align="stretch">
          <Box w="50%">
            <SmbStaticInfos />
          </Box>

          <Box w="25%">
            <SmbPower />
          </Box>

          <Box w="25%">
            <SmbStringStatus />
          </Box>
        </HStack>

        {/* ===== 2nd ROW ===== */}
        <Box w="100%">
          <SMBvsStringGraph />
        </Box>

        {/* ===== 3rd ROW ===== */}
        <Box w="100%">
          <StringTable />
        </Box>

        {/* ===== 4th ROW ===== */}
        <HStack
          w="100%"
          spacing="20px"
          align="stretch"
          mt="-10px"
        >
          <Box w="50%">
            <POAvsDCCurrentGraph />
          </Box>

          <Box w="50%">
            <VoltAmpsCurve />
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
};

export default SMBsDashboard;
