import React from "react";
import { Box, HStack, useColorModeValue } from "@chakra-ui/react";
import SoCChart from "../../components/DashboardComponents/DSMComponents/Widgets/SoCChart";
import PowerStats from "../../components/DashboardComponents/DSMComponents/Widgets/PowerStats";
import SOCDonut from "../../components/DashboardComponents/DSMComponents/Widgets/SoCDonut";
import TariffCard from "../../components/DashboardComponents/DSMComponents/Widgets/TariffCard";
import HistoryTable from "../../components/DashboardComponents/DSMComponents/Widgets/HistoryTable";
import ControlRecommendations from "../../components/DashboardComponents/DSMComponents/Widgets/ControlRecommendations";

const DSMDashboard: React.FC = () => {
  const bg = useColorModeValue("#fff", "#0b1020");
  return (
    <Box
      w="100%"
      h={"100%"}
      mt={-5}
    >
      <HStack
        gap="20px"
        h={"100%"}
        w="100%"
      >
        <Box>
          <SoCChart />
        </Box>
        <Box mt={5} >
          <PowerStats />
        </Box>
        <Box mt={5}>
          <SOCDonut />
        </Box>
        <Box mt={5}>
          <TariffCard />
        </Box>
      </HStack>

      {/* 2nd row */}
      <Box
        w="100%"
        h={"553px"}
        mt="20px"
      >
        <HStack
          spacing="20px"
          h="100%"
          w="100%"
        >
          <Box height={"100%"}>
            <HistoryTable />
          </Box>
          <Box height={"100%"}>
            <ControlRecommendations />
          </Box>
        </HStack>
      </Box>
    </Box>
  );
};

export default DSMDashboard;
