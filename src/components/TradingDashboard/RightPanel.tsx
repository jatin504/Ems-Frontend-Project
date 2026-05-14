import { VStack, Box, useColorModeValue } from "@chakra-ui/react";
import RealTimeMarket from "./RealTimeMarket";
import AGCCommands from "./AGCCommands";
import DSMAlerts from "./DSMAlerts";

const RightPanel = () => {
  const panelBg = useColorModeValue("transparent", "transparent");

  return (
    <Box h="100%" bg={panelBg}>
      <VStack
        spacing={4} //  better spacing
        align="stretch"
        h="100%"
      >
        <RealTimeMarket />
        <AGCCommands />
        <DSMAlerts />
      </VStack>
    </Box>
  );
};

export default RightPanel;