import {
  Box,
  Text,
  VStack,
  useColorModeValue,
  HStack,
  Button,
} from "@chakra-ui/react";
import ModuleTabs from "../../components/DashboardComponents/Moduledashboard/ModuleTabs";
import CellAnalyticsTopRibbon from "../../components/DashboardComponents/CellAnalyitcs/CellAnalyticsTopRibbon";
import CellVoltageHeatmap from "../../components/DashboardComponents/CellAnalyitcs/CellVoltageHeatmap";
import CellVoltageStatistics from "../../components/DashboardComponents/CellAnalyitcs/CellVoltageStatistics";
import CellTemperatureStatistics from "../../components/DashboardComponents/CellAnalyitcs/CellTemperatureStatistics";
import CellVoltageDistribution from "../../components/DashboardComponents/CellAnalyitcs/CellVoltageDistribution";
import CellTemperatureDistribution from "../../components/DashboardComponents/CellAnalyitcs/CellTemperatureDistribution";
import CellDetailsTable from "../../components/DashboardComponents/CellAnalyitcs/CellDetailsTable";
import VoltageTrend from "../../components/DashboardComponents/CellAnalyitcs/VoltageTrend";
import TemperatureTrend from "../../components/DashboardComponents/CellAnalyitcs/TemperatureTrend";
import CellHealthSummary from "../../components/DashboardComponents/CellAnalyitcs/CellHealthSummary";
import WeakestCellParameter from "../../components/DashboardComponents/CellAnalyitcs/WeakestCellParameter";

interface Props {
  moduleId: string;
  onBack?: () => void;
  onBackToRack?: () => void;
}

export default function CellAnalyticsDashboard({ moduleId, onBack, onBackToRack }: Props) {
  const bg = useColorModeValue("#F8FAFC", "#071A2B");
  const border = useColorModeValue("#E2E8F0", "#0D2D45");
  const title = useColorModeValue("#1E293B", "#F8FAFC");
  const text = useColorModeValue("#475569", "#C9D4DF");

  return (
    <Box
      w="100%"
      h="100%"
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      p="20px"
    >
      <VStack spacing="12px" align="stretch">
        <ModuleTabs
          activeTab="analytics"
          onChange={(tab) => {
            if (tab === "details" && onBack) onBack();
          }}
          rightContent={
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (onBackToRack) onBackToRack();
                else if (onBack) onBack();
              }}
            >
              Back to Rack
            </Button>
          }
        />

        <CellAnalyticsTopRibbon />

        <HStack spacing="16px" align="stretch" >
          {/* Heatmap - same width as current */}
          <Box w="860px" h="450px" transform="translateY(-22px)">
            <CellVoltageHeatmap />
          </Box>

          {/* Right Side */}
          <HStack flex="1" spacing="16px" align="stretch">
            {/* Left Column */}
            <VStack flex="1" spacing="16px">
              <Box w="100%" h="170px">
                <CellVoltageStatistics />
              </Box>

              <Box w="100%" h="250px" mt="-20px">
                <CellVoltageDistribution />
              </Box>
            </VStack>

            {/* Right Column */}
            <VStack flex="1" spacing="16px">
              <Box w="100%" h="170px">
                <CellTemperatureStatistics />
              </Box>

              <Box w="100%" h="250px" mt="-20px">
                <CellTemperatureDistribution />
              </Box>
            </VStack>
          </HStack>
        </HStack>

        {/* ======================= Second Row ======================= */}
        <HStack spacing="16px" align="stretch">
          {/* Cell Details */}
          <Box w="860px" h="430px">
            <CellDetailsTable />
          </Box>

          {/* Trends */}
          <VStack w="460px" spacing="16px" align="stretch">
            <Box h="207px" mt="-20px">
              <VoltageTrend />
            </Box>

            <Box h="207px">
              <TemperatureTrend />
            </Box>
          </VStack>

          {/* Health Section */}
          <VStack w="460px" spacing="16px" align="stretch">
            <Box h="180px">
              <CellHealthSummary />
            </Box>

            <Box h="235px">
              <WeakestCellParameter />
            </Box>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
}
