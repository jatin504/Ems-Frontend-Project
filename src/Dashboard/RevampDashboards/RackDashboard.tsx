import React from "react";
import { Box, HStack, VStack, useColorModeValue } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { useDevices } from "../../hooks/useDevices";
import DashboardLayout from "../../layouts/DashboardLayout";

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
  const [moduleTab, setModuleTab] = React.useState("details");
  const navigationState = location.state as { currentBank?: string; breadcrumbSource?: string } | null;
  const currentBank = navigationState?.currentBank || selectedRackId.replace(/_rack_rack_\d+$/i, "");
  const backToRack = () => {
    setShowAnalyticsPage(false);
    setShowModuleDashboard(false);
    setSelectedModule(null);
    setModuleTab("details");
  };
  const moduleOpen = !!selectedModule && (showModuleDashboard || showAnalyticsPage);
  const tabLabels: Record<string, string> = {
    details: "Module Details", voltages: "Voltages", temperatures: "Temperatures",
    alarms: "Alarms & Events", health: "Lifetime & Health", settings: "Settings",
  };
  const breadcrumbs = [
    { label: "Home", href: "/" },
    navigationState?.breadcrumbSource === "bess"
      ? { label: "BESS", href: "/devices/bess" }
      : { label: "Plant View", href: "/plantview" },
    { label: "Battery Bank", href: "/batterybankk", state: {
      currentBank, breadcrumbSource: navigationState?.breadcrumbSource,
    } },
    { label: "Rack", ...(moduleOpen ? { onClick: backToRack } : {}) },
    ...(moduleOpen ? [{ label: `Module ${selectedModule}`, ...(showAnalyticsPage || moduleTab !== "details" ? {
      onClick: () => { setShowAnalyticsPage(false); setShowModuleDashboard(true); setModuleTab("details"); },
    } : {}) }] : []),
    ...(showAnalyticsPage ? [{ label: "Cell Analytics" }] :
      moduleOpen && moduleTab !== "details" ? [{ label: tabLabels[moduleTab] || moduleTab }] : []),
  ];

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
    <Box
      w="100%"
      minH="100vh"
      bg={screen}
      px="20px"
      py="20px"
      sx={{
        ".rack-row > div": { minWidth: 0 },
        ".rack-row > div > :not(:fullscreen)": {
          width: "100%", maxWidth: "100%", height: "100%", margin: 0,
        },
      }}
    >
      <VStack spacing="12px" align="stretch" w="100%">

        {!showAnalyticsPage && (
          <>
            <RackHeader rackId={selectedRackId} />

            <Box>
              <RackSummary rackId={selectedRackId} />
            </Box>

            {/* ---------- First Row ---------- */}
            <HStack
              spacing="12px"
              align="stretch"
              w="100%"
              className="rack-row"
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
                      setModuleTab("details");
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
                  activeTab={moduleTab}
                  moduleId={selectedModule}
                  onTabChange={setModuleTab}
                  onBackToRack={backToRack}
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
                spacing="12px"
                align="stretch"
                w="100%"
                className="rack-row"
              >
                <Box
                  flex="1.45"
                  h="360px"

                >
                  <CellVoltageHeatmap rackId={selectedRackId} />
                </Box>

                <Box
                  flex="1"
                  h="360px"


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
                className="rack-row"
                spacing="12px"
                align="stretch"
                w="100%"
              >
                <Box
                  flex="1.1"
                  h="300px"
                >
                  <LifetimeThroughput />
                </Box>

                <Box
                  flex="1"
                  h="300px"


                >
                  <EnergyTrend />
                </Box>

                <Box
                  flex="1"
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
              setModuleTab("details");
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
    </DashboardLayout>
  );
}
