import { Grid } from "@chakra-ui/react";
import OutgoingMeters from "./OutgoingMeters";
import AuxiliaryMeters from "./AuxiliaryMeters";
import LTMeters from "./LTMeters";

const MeterTables = () => {
  return (
    <Grid
      templateColumns={{
        base: "1fr",
        xl: "repeat(3,1fr)",
      }}
      gap="12px"
    >
      <OutgoingMeters />
      <AuxiliaryMeters />
      <LTMeters />
    </Grid>
  );
};

export default MeterTables;