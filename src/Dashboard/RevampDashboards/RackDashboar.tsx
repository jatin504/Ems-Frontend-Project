import React from "react";
import { Box, HStack, VStack, useColorModeValue } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { useDevices } from "../../hooks/useDevices";

import RackHeader from "../../components/DashboardComponents/RackComponents/RackHeader";
import RackSummary from "../../components/DashboardComponents/RackComponents/RackSummary";

import RackModuleLayout from "../../components/DashboardComponents/RackComponents/RackModuleLayout";
import DeltaSummary from "../../components/DashboardComponents/RackComponents/DeltaSummary";
import ControlLimits from "../../components/DashboardComponents/RackComponents/ControlLimits";

import CellVoltageHeatmap from "../../components/DashboardComponents/RackComponents/CellVoltageHeatmap";
import TemperatureDistribution from "../../components/DashboardComponents/RackComponents/TemperatureDistribution";
import ProtectionAlarmSummary from "../../components/DashboardComponents/RackComponents/ProtectionAlarmSummary";
import LifetimeThroughput from "../../components/DashboardComponents/RackComponents/LifetimeThroughput";
import EnergyTrend from "../../components/DashboardComponents/RackComponents/EnergyTrend";
import RecentEvents from "../../components/DashboardComponents/RackComponents/RecentEvents";
import ModuleDashboard from "./ModuleDashboard";
import CellAnalyticsDashboard from "./CellAnalyticsDashboard";

export default function RackDashboard() {
  const screen = useColorModeValue("#F1F5F9", "#0B0F14");
  const location = useLocation();
  const { devices } = useDevices();
  const rackDeviceId =
    (location.state as { currentRack?: string })?.currentRack || "";
  const selectedRack = React.useMemo(
    () => devices?.find(
      (device) =>
        device.deviceType === "rack" &&
        device.device_id === rackDeviceId
    ),
    [devices, rackDeviceId]
  );
  const selectedRackId = selectedRack?.device_id || rackDeviceId;
  const [selectedModule, setSelectedModule] = React.useState<string | null>(null);
  const [showModuleDashboard, setShowModuleDashboard] = React.useState(false);
  const [showAnalyticsPage, setShowAnalyticsPage] = React.useState(false);

  return (
    <Box
      w="100%"
      minH="100vh"
      bg={screen}
      px="20px"
      py="20px"
    >
      <VStack spacing="20px" align="stretch" w="100%">

        {!showAnalyticsPage && (
          <>
            <RackHeader rackId={selectedRackId} />

            <Box mt="-30px">
              <RackSummary rackId={selectedRackId} />
            </Box>

            {/* ---------- First Row ---------- */}
            <HStack
              spacing="20px"
              align="stretch"
              w="100%"
              mt={"-30px"}
            >
              <Box
                w="1040px"
                h="370px"
              >
                <RackModuleLayout
                  rackId={selectedRackId}
                  selectedModule={selectedModule}
                  onModuleSelect={(id) => setSelectedModule(id)}
                  onOpenDetails={() => {
                    if (selectedModule) {
                      setShowModuleDashboard(true);
                    }
                  }}
                />
              </Box>

              <Box
                w="380px"
                h="370px"
              >
                <DeltaSummary rackId={selectedRackId} />
              </Box>

              <Box
                w="420px"
                h="370px"
              >
                <ControlLimits />
              </Box>
            </HStack>

            {showModuleDashboard && selectedModule && (
              <Box mt="-10px">
                <ModuleDashboard
                  moduleId={selectedModule}
                  onBack={() => {
                    setShowModuleDashboard(false);
                    setSelectedModule(null);
                    setShowAnalyticsPage(false);
                  }}
                  onOpenAnalytics={() => setShowAnalyticsPage(true)}
                />
              </Box>
            )}

            {/* ---------- Second Row ---------- */}
            {!showModuleDashboard && (
              <HStack
                spacing="20px"
                align="stretch"
                w="100%"
                mt={"-12px"}
              >
                <Box
                  flex="1.45"
                  h="360px"
                  mt={"-21px"}
                >
                  <CellVoltageHeatmap rackId={selectedRackId} />
                </Box>

                <Box
                  flex="1"
                  h="360px"
                  mt="-18px"

                >
                  <TemperatureDistribution />
                </Box>

                <Box
                  flex="1.15"
                  h="360px"


                >
                  <ProtectionAlarmSummary />
                </Box>
              </HStack>
            )}

            {/* ---------- Third Row ---------- */}
            {!showModuleDashboard && (
              <HStack
                spacing="20px"
                align="stretch"
                w="100%"
              >
                <Box
                  w="420px"
                  h="300px"
                >
                  <LifetimeThroughput />
                </Box>

                <Box
                  w="620px"
                  h="300px"
                  ml="200px"
                  mt={"-16px"}
                >
                  <EnergyTrend />
                </Box>

                <Box
                  w="620px"
                  h="300px"
                >
                  <RecentEvents />
                </Box>
              </HStack>
            )}
          </>
        )}

        {showAnalyticsPage && selectedModule && (
          <CellAnalyticsDashboard
            moduleId={selectedModule}
            onBack={() => {
              setShowAnalyticsPage(false);
              setShowModuleDashboard(true);
            }}
            onBackToRack={() => {
              setShowAnalyticsPage(false);
              setShowModuleDashboard(false);
              setSelectedModule(null);
            }}
          />
        )}

      </VStack>
    </Box>
  );
}