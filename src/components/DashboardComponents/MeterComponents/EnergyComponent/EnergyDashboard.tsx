import {
  Box,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";

import EnergySummaryCards from "./EnergySummaryCards";
import EnergyTrendChart from "./EnergyTrendChart";
import EnergyBreakdown from "./EnergyBreakdown";
import CumulativeEnergy from "./CumulativeEnergy";
import EnergyByTariff from "./EnergyByTariff";
import EnergyByPhase from "./EnergyByPhase";
import EnergyReset from "./EnergyReset";

interface Props {
  selectedMeter: string;
}

const EnergyDashboard = ({
  selectedMeter,
}: Props) => {
  return (
    <VStack
      spacing="12px"
      align="stretch"
    >
      {/* Row 1 */}
      <EnergySummaryCards
        selectedMeter={selectedMeter}
      />

      {/* Row 2 */}
      <SimpleGrid
        columns={3}
        spacing="12px"
      >
        <Box mt="-14px">
          <EnergyTrendChart
            selectedMeter={selectedMeter}
          />
        </Box>

        <Box>
          <EnergyBreakdown
            selectedMeter={selectedMeter}
          />
        </Box>

        <Box>
          <CumulativeEnergy
            selectedMeter={selectedMeter}
          />
        </Box>
      </SimpleGrid>

      {/* Row 3 */}
      <SimpleGrid
        columns={3}
        spacing="12px"
      >
        <Box>
          <EnergyByTariff
            selectedMeter={selectedMeter}
          />
        </Box>

        <Box>
          <EnergyByPhase
            selectedMeter={selectedMeter}
          />
        </Box>

        <Box>
          <EnergyReset
            selectedMeter={selectedMeter}
          />
        </Box>
      </SimpleGrid>
    </VStack>
  );
};

export default EnergyDashboard;