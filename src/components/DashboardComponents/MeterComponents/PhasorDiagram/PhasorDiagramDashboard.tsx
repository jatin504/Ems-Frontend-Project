import { Box, HStack, VStack } from "@chakra-ui/react";

import PhasorChartCard from "./PhasorChartCard";
import PhasorValuesCard from "./PhasorValuesCard";
import PhasorAngleSummaryCard from "./PhasorAngleSummaryCard";
import PhasorRelationshipCard from "./PhasorRelationshipCard";
import PhasorQualityIndicatorsCard from "./PhasorQualityIndicatorsCard";

type Props = {
  selectedMeter?: string;
};

const PhasorDiagramDashboard = ({
  selectedMeter,
}: Props) => {
  return (
    <VStack
      spacing="12px"
      align="stretch"
    >
      {/* Row 1 */}
      <HStack
        spacing="12px"
        align="stretch"
        w="100%"
      >
        <Box w="40%">
          <PhasorChartCard
            selectedMeter={selectedMeter}
          />
        </Box>

        <Box w="60%">
          <PhasorValuesCard
            selectedMeter={selectedMeter}
          />
        </Box>
      </HStack>

      {/* Row 2 */}
      <HStack
        spacing="12px"
        align="stretch"
        w="100%"
      >
        <Box w="33.33%">
          <PhasorAngleSummaryCard
            selectedMeter={selectedMeter}
          />
        </Box>

        <Box w="20%">
          <PhasorRelationshipCard
            selectedMeter={selectedMeter}
          />
        </Box>

        <Box w="46.67%">
          <PhasorQualityIndicatorsCard
            selectedMeter={selectedMeter}
          />
        </Box>
      </HStack>
    </VStack>
  );
};

export default PhasorDiagramDashboard;