import { useState } from "react";
import {
  Box,
  Button,
  HStack,
  Grid,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";

import ModuleTabs from "../../components/DashboardComponents/Moduledashboard/ModuleTabs";
import ModuleInfoCard from "../../components/DashboardComponents/Moduledashboard/ModuleInfoCard.tsx";
import ModuleStatusCard from "../../components/DashboardComponents/Moduledashboard/ModuleStatusCard";
import ElectricalParameters from "../../components/DashboardComponents/Moduledashboard/ElectricalParameters";
import CellVoltageHeatmap from "../../components/DashboardComponents/Moduledashboard/CellVoltageHeatmap";
import TemperatureDistribution from "../../components/DashboardComponents/Moduledashboard/TemperatureDistribution";
import CellBalancingStatus from "../../components/DashboardComponents/Moduledashboard/CellBalancingStatus";
import CellAnalyticsDashboard from "./CellAnalyticsDashboard";

interface Props {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenAnalytics?: () => void;
  onBackToRack?: () => void;
  moduleId: string;
  onBack: () => void;
}

export default function ModuleDashboard({
  activeTab: selectedTab,
  onTabChange,
  moduleId,
  onBack,
  onOpenAnalytics,
  onBackToRack,
}: Props) {
  const [localTab, setActiveTab] = useState("details");
  const activeTab = selectedTab ?? localTab;

  const bg = useColorModeValue("#F4F7FB", "#0B1220");
  const border = useColorModeValue("#E2E8F0", "#203344");
  const title = useColorModeValue("#1E293B", "#F8FAFC");
  const text = useColorModeValue("#64748B", "#94A3B8");

  return (
    <Box
      w="100%"
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="12px"
      overflow="hidden"
      boxShadow={useColorModeValue(
        "0 16px 32px rgba(15,23,42,0.08)",
        "0 16px 32px rgba(0,0,0,.35)"
      )}
    >
      {/* Header */}
      <HStack
        justify="space-between"
        px="20px"
        py="18px"
        borderBottom="1px solid"
        borderColor={border}
      >
        <Box>
          <Text
            fontSize="20px"
            fontWeight="700"
            color={title}
          >
            Module {moduleId}
          </Text>

          
        </Box>
          
      </HStack>

      {/* Top Navigation */}
      <ModuleTabs
        activeTab={activeTab}
        onChange={(tab) => {
          setActiveTab(tab);
          onTabChange?.(tab);
          if (tab === "analytics" && onOpenAnalytics) onOpenAnalytics();
          if (tab === "details" && onBack) onBack();
        }}
        rightContent={
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (onBackToRack) onBackToRack();
              else onBack();
            }}
          >
            Back to Rack
          </Button>
        }
      />

      {/* Content */}
      <Box p="20px" minH="500px">
        {activeTab === "details" && (
          <Grid
            templateColumns={{ base: "minmax(0,1fr)", xl: "360px 300px minmax(0,1fr) minmax(0,1fr)" }}
            gap="16px"
            alignItems="start"
            minW={0}
            sx={{
              ".module-widget": { minWidth: 0 },
              ".module-widget > :not(:fullscreen)": { width: "100%", maxWidth: "100%", margin: 0 },
            }}
          >
            <VStack className="module-widget" spacing="16px" align="stretch">
              <ModuleInfoCard moduleId={moduleId} />
              <ModuleStatusCard />
            </VStack>
            <Box className="module-widget"><ElectricalParameters /></Box>
            <Box className="module-widget" h="650px" sx={{ "& > :not(:fullscreen)": { height: "100%" } }}><CellVoltageHeatmap /></Box>
            <VStack spacing="16px" align="stretch" minW={0}>
              <Box className="module-widget" h="389px"><TemperatureDistribution /></Box>
              <Box className="module-widget"><CellBalancingStatus /></Box>
            </VStack>
          </Grid>
        )}

        {activeTab === "analytics" && (
          <CellAnalyticsDashboard moduleId={moduleId} />
        )}

        {activeTab === "voltages" && (
          <>
            <Text
              fontSize="22px"
              fontWeight="700"
              color={title}
              mb="10px"
            >
              Voltages
            </Text>

            <Text color={text}>
              Voltages Component
            </Text>
          </>
        )}

        {activeTab === "temperatures" && (
          <>
            <Text
              fontSize="22px"
              fontWeight="700"
              color={title}
              mb="10px"
            >
              Temperatures
            </Text>

            <Text color={text}>
              Temperatures Component
            </Text>
          </>
        )}

        {activeTab === "alarms" && (
          <>
            <Text
              fontSize="22px"
              fontWeight="700"
              color={title}
              mb="10px"
            >
              Alarms & Events
            </Text>

            <Text color={text}>
              Alarms & Events Component
            </Text>
          </>
        )}

        {activeTab === "health" && (
          <>
            <Text
              fontSize="22px"
              fontWeight="700"
              color={title}
              mb="10px"
            >
              Lifetime & Health
            </Text>

            <Text color={text}>
              Lifetime & Health Component
            </Text>
          </>
        )}

        {activeTab === "settings" && (
          <>
            <Text
              fontSize="22px"
              fontWeight="700"
              color={title}
              mb="10px"
            >
              Settings
            </Text>

            <Text color={text}>
              Settings Component
            </Text>
          </>
        )}
      </Box>
    </Box>
  );
}
