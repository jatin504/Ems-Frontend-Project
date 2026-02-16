import { Box, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useMemo, useState, useEffect } from "react";
import { useDevices } from "../../hooks/useDevices";
import CellBalancing from "../../components/DashboardComponents/RackComponents/Widgets/CellBalancing";
import TemperatureCards from "../../components/DashboardComponents/RackComponents/Widgets/Temperatures";
import StringGrid from "../../components/DashboardComponents/RackComponents/Widgets/StringGrid";
import ControlPanel from "../../components/DashboardComponents/RackComponents/Widgets/ControlPanel";
import ModulesTable from "../../components/DashboardComponents/RackComponents/Widgets/ModulesTable";
import AnalogsAndStatus from "../../components/DashboardComponents/RackComponents/Widgets/RackStatus";
import RackAnalog from "../../components/DashboardComponents/RackComponents/Widgets/RackAnalog";
import RackStatus from "../../components/DashboardComponents/RackComponents/Widgets/RackStatus";

// fixed canvas size to match your mock
// const FRAME_W = 1920;
// const FRAME_H = 939;

export default function RackDashboard() {
  // light mode gets a soft slate background, dark stays the same
  const screen = useColorModeValue("#f1f5f9", "#0b0f14");
  const crumbColor = useColorModeValue("#334155", "gray.400");

  // --- RACK DROPDOWN LOGIC ---
  const { devices, loading } = useDevices();
  const [selectedRack, setSelectedRack] = useState("");

  // Filter for rack devices (device_id like plant_1_pcs_1_ess_2_rack_rack_*)
  const rackOptions = useMemo(() => {
    if (!devices) return [];
    return devices
      .filter((d: any) => d.device_id?.toLowerCase().includes("_rack_rack_"))
      .map((d: any) => {
        // Try to extract a numeric suffix from device_id
        const match = d.device_id.match(/_rack_rack_(\d+)/);
        const suffix = match ? match[1] : d.device_id;
        return {
          id: d.device_id,
          label: suffix ? `Rack_${suffix}` : d.device_id,
        };
      });
  }, [devices]);

  // Auto-select first rack
  useEffect(() => {
    if (!selectedRack && rackOptions.length > 0) {
      setSelectedRack(rackOptions[0].id);
    }
  }, [rackOptions, selectedRack]);

  // const [scale, setScale] = React.useState(1);
  // const viewportRef = React.useRef<HTMLDivElement>(null);

  // React.useLayoutEffect(() => {
  //   const update = () => {
  //     const cw =
  //       viewportRef.current?.clientWidth ?? document.documentElement.clientWidth;
  //     const s = Math.min(1, (cw - 2) / FRAME_W);
  //     setScale(s);
  //   };
  //   update();
  //   window.addEventListener("resize", update);
  //   return () => window.removeEventListener("resize", update);
  // }, []);


  return (
    <Box bg={screen} w="100%" minH="100%">

      {/* Select Rack Dropdown */}
      <HStack
        spacing="12px"
        align="center"
        bg={screen}
        p="10px 14px"
        borderRadius="md"
        w="fit-content"
        boxShadow="sm"
        mb="20px"
      >
        <Text fontSize="13px" fontWeight={500} color={crumbColor}>
          Select Rack:
        </Text>
        <select
          style={{ width: 220, fontSize: 13, height: 28, borderRadius: 4, padding: '0 8px' }}
          value={selectedRack}
          disabled={loading}
          onChange={(e) => setSelectedRack(e.target.value)}
        >
          {rackOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </HStack>

      {/* ---------- ROW 1 ---------- */}
      <Box w={`100%`} h="302.4175px" mb={"20px"}>
        <HStack gap="20px" w={`100%`} align="stretch" h="100%">
          <Box w="330px" h="100%" borderRadius="12px">
            <CellBalancing />
          </Box>
          <Box w="497px" h="100%" borderRadius="12px">
            <TemperatureCards />
          </Box>
          <Box w="497px" h="100%" borderRadius="12px">
            <StringGrid />
          </Box>
          <Box w="497px" h="100%" borderRadius="12px">
            <ControlPanel />
          </Box>
        </HStack>
      </Box>

      {/* ---------- ROW 2 ---------- */}
      <Box w={`100%`} h="535.5825px">
          <HStack spacing="20px" w={`100%`} align="stretch" >
            <Box w="1240px" h="100%" borderRadius="12px">
              <ModulesTable />
            </Box>
            <Box w="237px" h="100%" borderRadius="12px">
              <RackAnalog />
            </Box>
            <Box w="380px" h="100%" borderRadius="12px" >
              <RackStatus />
            </Box>
          </HStack>
        </Box>
    </Box>
  );
}
