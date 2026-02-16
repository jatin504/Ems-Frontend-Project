// pages/WMSDashboard.tsx
import { Box, HStack, Select, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

import WMSMetricsBar from "../components/DashboardComponents/WMSdashboard/WMSMetricsBar";
import WMSPOACard from "../components/DashboardComponents/WMSdashboard/WMSPOACard";
import WMSStatusCard from "../components/DashboardComponents/WMSdashboard/WMSStatusCard";
import LiveIrradiationGraph from "../components/DashboardComponents/WMSdashboard/LiveIrradiationGraph";
import DailyIsolationGraph from "../components/DashboardComponents/WMSdashboard/DailyIsolationGraph";
import TempGraph from "../components/DashboardComponents/WMSdashboard/TempGraph";
import WindGraph from "../components/DashboardComponents/WMSdashboard/WindGraph";
import { useDevices } from "../hooks/useDevices";

interface DeviceOption {
  id: string;
  label: string;
}

const WMSDashboard = () => {
  const cardBg = useColorModeValue("white", "#1A202C");

  const [selectedWMS, setSelectedWMS] = useState<string>("");
  const { devices, loading } = useDevices();
  const deviceOptions: DeviceOption[] = useMemo(() => {
    if (!devices) return [];

    return devices
      .filter((d: any) => d.device_id?.includes("_bank_bank_"))
      .map((d: any) => {
        const match = d.device_id.match(/_(\d+)$/);
        const suffix = match ? match[1] : "";
        return {
          id: d.device_id,
          label: suffix ? `WMS_${suffix}` : d.device_id,
        };
      })
      .sort((a, b) => {
        const numA = parseInt(a.label.match(/\d+$/)?.[0] || "0", 10);
        const numB = parseInt(b.label.match(/\d+$/)?.[0] || "0", 10);
        return numA - numB;
      });
  }, [devices]);
  useEffect(() => {
    if (!selectedWMS && deviceOptions.length > 0) {
      setSelectedWMS(deviceOptions[0].id);
    }
  }, [deviceOptions, selectedWMS]);

  return (
    <Box width="100%" maxW="1920px" mx="auto" px="0">
      <VStack spacing="10px" align="stretch">

        {/* WMS Selector */}
        <HStack
          spacing="12px"
          align="center"
          bg={cardBg}
          p="10px 14px"
          borderRadius="md"
          w="fit-content"
          boxShadow="sm"
        >
          <Text fontSize="13px" fontWeight={500}>
            Select WMS:
          </Text>

          <Select
            size="sm"
            w="220px"
            fontSize="13px"
            value={selectedWMS}
            isDisabled={loading}
            onChange={(e) => setSelectedWMS(e.target.value)}
          >
            {deviceOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </Select>
        </HStack>

        {/* First Row */}
        <HStack width="100%" spacing="20px" height="260px">
          <Box width="50%" height="100%">
            <WMSMetricsBar selectedWMS={selectedWMS} />
          </Box>

          <Box width="25%" height="100%">
            <WMSPOACard selectedWMS={selectedWMS} />
          </Box>

          <Box width="25%" height="100%" mt="-40px">
            <WMSStatusCard selectedWMS={selectedWMS} />
          </Box>
        </HStack>

        {/* Second Row */}
        <HStack width="100%" spacing="20px" height="350px" mt={"-10px"}>
          <Box width="50%" height="100%">
            <LiveIrradiationGraph selectedWMS={selectedWMS} />
          </Box>

          <Box width="50%" height="100%">
            <DailyIsolationGraph selectedWMS={selectedWMS} />
          </Box>
        </HStack>

        {/* Third Row */}
        <HStack width="100%" spacing="20px" height="370px" mt={"10px"}>
          <Box width="50%" height="100%">
            <TempGraph selectedWMS={selectedWMS} />
          </Box>

          <Box width="50%" height="100%">
            <WindGraph selectedWMS={selectedWMS} />
          </Box>
        </HStack>

      </VStack>
    </Box>
  );
};

export default WMSDashboard;
