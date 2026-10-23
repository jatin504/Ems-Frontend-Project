import {
  Box,
  Text,
  VStack,
  useColorModeValue,
  HStack,
  Grid,
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
      minW={0}
      sx={{
        ".analytics-widget": { minWidth: 0 },
        ".analytics-widget > :not(:fullscreen)": {
          width: "100%", maxWidth: "100%", height: "100%", margin: 0,
        },
      }}
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

        <Grid templateColumns={{ base: "minmax(0,1fr)", xl: "minmax(0,1.6fr) minmax(0,1fr) minmax(0,1fr)" }} gap="16px" minW={0}>
          <Box className="analytics-widget" h="502px"><CellVoltageHeatmap /></Box>
          <VStack spacing="12px" align="stretch" minW={0}>
            <Box className="analytics-widget" h="170px"><CellVoltageStatistics /></Box>
            <Box className="analytics-widget" h="320px"><CellVoltageDistribution /></Box>
          </VStack>
          <VStack spacing="12px" align="stretch" minW={0}>
            <Box className="analytics-widget" h="170px"><CellTemperatureStatistics /></Box>
            <Box className="analytics-widget" h="320px"><CellTemperatureDistribution /></Box>
          </VStack>
        </Grid>
        <Grid templateColumns={{ base: "minmax(0,1fr)", xl: "minmax(0,1.6fr) minmax(0,1fr) minmax(0,1fr)" }} gap="16px" minW={0}>
          <Box className="analytics-widget" h="430px"><CellDetailsTable /></Box>
          <VStack spacing="16px" align="stretch" minW={0}>
            <Box className="analytics-widget" h="207px"><VoltageTrend /></Box>
            <Box className="analytics-widget" h="207px"><TemperatureTrend /></Box>
          </VStack>
          <VStack spacing="16px" align="stretch" minW={0}>
            <Box className="analytics-widget" h="180px"><CellHealthSummary /></Box>
            <Box className="analytics-widget" h="235px"><WeakestCellParameter /></Box>
          </VStack>
        </Grid>
      </VStack>
    </Box>
  );
}
