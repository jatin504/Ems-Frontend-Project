import { Grid } from "@chakra-ui/react";
import OutgoingChart from "./OutgoingChart";
import AuxiliaryChart from "./AuxiliaryChart";
import LTChart from "./LTChart";

const MeterCharts = () => {
  return (
    <Grid
      templateColumns={{ base: "1fr", xl: "repeat(3,1fr)" }}
      gap="12px"
    >
      <OutgoingChart />
      <AuxiliaryChart />
      <LTChart />
    </Grid>
  );
};

export default MeterCharts;
