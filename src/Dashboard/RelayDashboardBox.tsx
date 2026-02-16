import { Box, Grid, GridItem, useColorModeValue } from "@chakra-ui/react";

import RelayVisualPanel from "../components/DashboardComponents/ProtectionRelayDashboard/RelayVisualPanel";
import RelaySummaryCard from "../components/DashboardComponents/ProtectionRelayDashboard/RelaySummaryCard";
import FaultDetailsPanel from "../components/DashboardComponents/ProtectionRelayDashboard/FaultDetailsPanel";
import ProtectionStatusCard from "../components/DashboardComponents/ProtectionRelayDashboard/ProtectionStatusCard";
import PhaseCurrentsCard from "../components/DashboardComponents/ProtectionRelayDashboard/PhaseCurrentsCard";

interface RelayDashboardProps {
  relayId: string;
  relayName: string;
}

export default function RelayDashboard({
  relayId,
  relayName,
}: RelayDashboardProps) {
  const bg = useColorModeValue("#FFFFFF", "#0B1220");
  const border = useColorModeValue(
    "rgba(0,0,0,0.06)",
    "rgba(255,255,255,0.08)"
  );

  return (
    <Box
      w="100%"
      bg={bg}
      border={`1px solid ${border}`}
      borderRadius="14px"
      p="14px"
      boxShadow={useColorModeValue(
        "0 8px 24px rgba(0,0,0,0.06)",
        "0 10px 30px rgba(0,0,0,0.45)"
      )}
    >
      <Grid
        templateColumns="1.2fr 0.8fr 1.45fr"
        columnGap="10px"
        alignItems="stretch"
      >
        {/* LEFT */}
        <GridItem>
          <RelayVisualPanel relayName={relayName} />
        </GridItem>

        {/* MIDDLE */}
        <GridItem>
          <Grid templateRows="160px 150px" rowGap="10px" h="100%">
            <RelaySummaryCard />
            <FaultDetailsPanel />
          </Grid>
        </GridItem>

        {/* RIGHT */}
        <GridItem>
          <Grid templateRows="160px 150px" rowGap="10px" h="100%">
            <ProtectionStatusCard />
            <PhaseCurrentsCard />
          </Grid>
        </GridItem>
      </Grid>
    </Box>
  );
}
