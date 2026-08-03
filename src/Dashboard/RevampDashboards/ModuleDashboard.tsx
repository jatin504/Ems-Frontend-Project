import { useState } from "react";
import {
  Box,
  Button,
  HStack,
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
  onOpenAnalytics?: () => void;
  onBackToRack?: () => void;
  moduleId: string;
  onBack: () => void;
}

export default function ModuleDashboard({
  moduleId,
  onBack,
  onOpenAnalytics,
  onBackToRack,
}: Props) {
  const [activeTab, setActiveTab] = useState("details");

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
          <HStack
            align="start"
            spacing="20px"
            w="100%"
          >
            {/* Left Side */}
            <VStack
              w="340px"
              spacing="16px"
              align="stretch"
            >
              <ModuleInfoCard moduleId={moduleId} />

              <ModuleStatusCard />
            </VStack>

            <HStack
              flex="1"
              spacing="16px"
              align="start"
            >
              {/* Second Column */}
              <Box ml="8px">
                <ElectricalParameters />
              </Box>

              {/* Third Column */}
              <Box flex="1" maxW="560px">
                <CellVoltageHeatmap />
              </Box>

              {/* Fourth Column */}
              <VStack
                w="340px"
                spacing="20px"
                align="stretch"
              >
                <TemperatureDistribution />

                <CellBalancingStatus />
              </VStack>
            </HStack>
          </HStack>
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