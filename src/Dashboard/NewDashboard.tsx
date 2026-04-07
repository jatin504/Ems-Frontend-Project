import { Grid, GridItem, Box } from "@chakra-ui/react";
import TopStatsRow from "../components/DashboardComponents/PassDashboard/TopStatsRow";
import DeemedGeneration from "../components/DashboardComponents/PassDashboard/DeemedGeneration";
import SeasonalPR from "../components/DashboardComponents/PassDashboard/SeasonalPR";
import AlertsPanel from "../components/DashboardComponents/PassDashboard/AlertsPanel";
import ValidationAudit from "../components/DashboardComponents/PassDashboard/ValidationAudit";
import BillingPreview from "../components/DashboardComponents/PassDashboard/BillingPreview";
import BillingSummary from "../components/DashboardComponents/PassDashboard/BillingSummary";
import SystemFlow from "../components/DashboardComponents/PassDashboard/SystemFlow";

const NewDashboard = () => {
  return (
    <>
      {/* ✅ FIRST ROW */}
      <Grid p={4} pb={0}>
        <TopStatsRow />
      </Grid>

      {/* ✅ SECOND ROW */}
      <Grid templateColumns="repeat(12, 1fr)" gap={4} p={4}>
        
        <GridItem colSpan={4} width="578px">
          <DeemedGeneration />
        </GridItem>

        <GridItem colSpan={4} mt={-5} width="520px">
          <SeasonalPR />
        </GridItem>

        <GridItem colSpan={3} width="360px">
          <AlertsPanel />
          <ValidationAudit />
        </GridItem>

        {/* ✅ Billing + Summary (IMPORTANT FIX) */}
        <GridItem colSpan={4} width="578px" mt="-110px">
          <BillingPreview />

          {/* 👇 Naya component yahi add hua hai */}
          <Box mt={3}>
            <BillingSummary />
          </Box>
        </GridItem>

        <GridItem colSpan={7}>
          <SystemFlow />
        </GridItem>

      </Grid>
    </>
  );
};

export default NewDashboard;