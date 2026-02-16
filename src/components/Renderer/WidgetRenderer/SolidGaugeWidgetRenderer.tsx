import { Box } from "@chakra-ui/react";
import SolidGaugeChart from "./SolidGaugeChart";

const SolidGaugeWidgetRenderer: React.FC<{ config: any }> = ({ config }) => {
  return (
    <Box
      w="100%"
      h="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="visible"   
    >
      <SolidGaugeChart
        width={config?.solid_gauge?.componentProps?.width || 420}
      />
    </Box>
  );
};

export default SolidGaugeWidgetRenderer;
