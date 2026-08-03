import React from "react";
import { Box, Grid, useColorModeValue } from "@chakra-ui/react";

import TopSummaryCards from "./TopSummaryCards";
import StringStatusDistribution from "./StringStatusDistribution";
import StringHealth from "./StringHealth";
import StringCurrentDistribution from "./StringCurrentDistribution";
import SMBvsStringGraph from "./SMBvsStringGraph";

import StringTable from "./StringTable";
import Top10StringsCurrent from "./Top10StringsCurrent";
import VICurveCard from "./VICurveCard";

const InverterDashboard: React.FC = () => {
  const bg = useColorModeValue("#F7FAFF", "#071521");

  return (
    <Box p={4} bg={bg} minH="100vh">
      {/* TOP ROW */}
      <TopSummaryCards />

      {/* SECOND ROW */}
      <Grid
        mt={4}
        templateColumns={{
          base: "1fr",
          lg: "1.2fr 1fr 1.5fr",
        }}
        gap={4}
        alignItems="stretch"
      >
        <Box h="230px">
          <StringStatusDistribution />
        </Box>

        <Box h="230px">
          <StringHealth />
        </Box>

        <Box
          h="230px"
          mt="-16px"
        >
          <StringCurrentDistribution />
        </Box>
      </Grid>

      {/* THIRD ROW */}
      <Box mt={4}>
        <SMBvsStringGraph />
      </Box>

      {/* FOURTH ROW */}
      <Grid
        mt={4}
        templateColumns={{
          base: "1fr",
          xl: "7fr 3fr",
        }}
        gap={4}
        alignItems="start"
      >
        {/* 70% */}
        <Box minW={0} overflow="hidden">
          <StringTable />
        </Box>

        {/* 30% */}
        <Box minW={0}>
          <Top10StringsCurrent />
        </Box>
      </Grid>
    </Box>
  );
};

export default InverterDashboard;