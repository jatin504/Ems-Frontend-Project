import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  HStack,
  Text,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";

import MeterPowerGraph from "../components/DashboardComponents/MeterComponents/Widgets/MeterPowerGraph";
import MeterYieldGraph from "../components/DashboardComponents/MeterComponents/Widgets/MeterYieldGraph";
import MeterCurrentGraph from "../components/DashboardComponents/MeterComponents/Widgets/MeterCurrentGraph";
import MeterVoltageGraph from "../components/DashboardComponents/MeterComponents/Widgets/MeterVoltageGraph";
import MeterFrequencyGraph from "../components/DashboardComponents/MeterComponents/Widgets/MeterFrequencyGraph";
import MeterStatsCard from "../components/DashboardComponents/MeterComponents/Widgets/MeterStatsCard";
import MetersPanel from "../components/DashboardComponents/MeterComponents/Widgets/MetersPanel";

import { useDevices } from "../hooks/useDevices";


const MeterDashboard = () => {
  const cardBg = useColorModeValue("white", "#1A202C");
  const { devices, loading } = useDevices();
  const [selectedMeter, setSelectedMeter] = useState<string>("");

  // Filter only meter devices (customize this filter as per your device_id or type)
  const meterOptions = useMemo(() => {
    if (!devices) return [];
    // Filter for meter devices and label as Meter_{suffix} if possible
    return devices
      .filter((d: any) => d.device_id?.toLowerCase().includes("_bank_bank_"))
      .map((d: any) => {
        // Try to extract a numeric suffix from device_id
        const match = d.device_id.match(/_(\d+)$/);
        const suffix = match ? match[1] : "";
        return {
          id: d.device_id,
          label: suffix ? `Meter_${suffix}` : d.device_id,
        };
      });
  }, [devices]);

  // Auto-select first meter
  useEffect(() => {
    if (!selectedMeter && meterOptions.length > 0) {
      setSelectedMeter(meterOptions[0].id);
    }
  }, [meterOptions, selectedMeter]);

  return (
    <Box width="100%" maxW="1920px" mx="auto" px="0">
      {/* Select Meter Dropdown */}
      <HStack
        spacing="12px"
        align="center"
        bg={cardBg}
        p="10px 14px"
        borderRadius="md"
        w="fit-content"
        boxShadow="sm"
        mb="20px"
      >
        <Text fontSize="13px" fontWeight={500}>
          Select Meter:
        </Text>
        <select
          style={{ width: 220, fontSize: 13, height: 28, borderRadius: 4, padding: '0 8px' }}
          value={selectedMeter}
          disabled={loading}
          onChange={(e) => setSelectedMeter(e.target.value)}
        >
          {meterOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </HStack>

      {/* First Row */}
<HStack width="100%" spacing="20px" height="330px" mb="0px">
  <Box width="33.33%" height="100%">
    <MeterStatsCard selectedMeter={selectedMeter} />
  </Box>

  <Box width="33.33%" height="100%" mt="-40px">
    <MeterPowerGraph selectedMeter={selectedMeter} />
  </Box>

  <Box width="33.33%" height="100%" mt="-40px">
    <MeterYieldGraph selectedMeter={selectedMeter} />
  </Box>
</HStack>


{/* Second Row */}
<HStack width="100%" spacing="20px" height="330px">
  <Box width="33.33%" height="100%">
    <MeterCurrentGraph selectedMeter={selectedMeter} />
  </Box>
  <Box width="33.33%" height="100%">
    <MeterVoltageGraph selectedMeter={selectedMeter} />
  </Box>
  <Box width="33.33%" height="100%">
    <MeterFrequencyGraph selectedMeter={selectedMeter} />
  </Box>
</HStack>

{/* Third Row */}
<Box width="100%" mt="40px">
  <MetersPanel selectedMeter={selectedMeter} />
</Box>

    </Box>
  );
};

export default MeterDashboard;
