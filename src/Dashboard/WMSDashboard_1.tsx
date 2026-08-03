import {
  Box,
  VStack,
  HStack,
  useColorModeValue,
  Text,
  Select,
} from "@chakra-ui/react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useDevices } from "../hooks/useDevices";

import WMSTopCards from "../components/DashboardComponents/WMSdashboard/Widgets/WMSTopCards.tsx";
import WMSOverview from "../components/DashboardComponents/WMSdashboard/Widgets/WMSOverview.tsx";
import WMSTrendChart from "../components/DashboardComponents/WMSdashboard/Widgets/WMSTrendChart.tsx";
import WindRoseChart from "../components/DashboardComponents/WMSdashboard/Widgets/WindRoseChart.tsx";
import ParameterTrends from "../components/DashboardComponents/WMSdashboard/Widgets/ParameterTrends.tsx";
import DailySummary from "../components/DashboardComponents/WMSdashboard/Widgets/DailySummary.tsx";
import SensorStatus from "../components/DashboardComponents/WMSdashboard/Widgets/SensorStatus.tsx";
import AlertsEvents from "../components/DashboardComponents/WMSdashboard/Widgets/AlertsEvents.tsx";
import WMSStationStatus from "../components/DashboardComponents/WMSdashboard/Widgets/WMSStationStatus.tsx";

const WMSDashboard_1 = () => {

  const bg = useColorModeValue(
    "#f4f7fb",
    "#071b34"
  );

  const textColor = useColorModeValue(
    "#1a202c",
    "#dbe7ff"
  );

  const subText = useColorModeValue(
    "#4a5568",
    "#b9c7dd"
  );

  const cardBg = useColorModeValue(
    "white",
    "#0b2442"
  );

  const selectTextColor = useColorModeValue(
    "#1A202C",
    "#dbe7ff"
  );

  const selectBorderColor = useColorModeValue(
    "#16365f",
    "#16365f"
  );

  const { devices, loading } = useDevices();

  const [selectedDevice, setSelectedDevice] = useState("");

  const deviceOptions = useMemo(() => {

    if (!devices) return [];

    return devices

      // ONLY _wms_
      .filter((d: any) =>
        d.device_id?.toLowerCase().includes("_wms_")
      )

      .map((d: any) => {

        const match = d.device_id.match(/_(\d+)$/);

        const suffix = match ? match[1] : "";

        return {
          id: d.device_id,
          label: suffix
            ? `WMS_${suffix}`
            : d.device_id,
        };
      })

      .sort((a: any, b: any) => {

        const numA = parseInt(
          a.label.match(/\d+$/)?.[0] || "0",
          10
        );

        const numB = parseInt(
          b.label.match(/\d+$/)?.[0] || "0",
          10
        );

        return numA - numB;
      });

  }, [devices]);

  useEffect(() => {

    if (!selectedDevice && deviceOptions.length > 0) {
      setSelectedDevice(deviceOptions[0].id);
    }

  }, [deviceOptions, selectedDevice]);

  return (

    <Box
      minH="100vh"
      bg={bg}
      p="10px"
      overflowX="auto"
    >

      <VStack
        spacing="10px"
        align="stretch"
      >

        {/* SELECT DEVICE */}
        <HStack justify="flex-start">

          <HStack spacing="10px">

            <Text
              fontSize="13px"
              fontWeight="600"
              color={selectTextColor}
            >
              Select Device
            </Text>

            <Select
              placeholder="Select WMS"
              width="220px"
              height="34px"
              fontSize="13px"
              borderRadius="6px"
              bg={cardBg}
              color={selectTextColor}
              border={`1px solid ${selectBorderColor}`}

              value={selectedDevice}

              isDisabled={loading}

              onChange={(e) =>
                setSelectedDevice(e.target.value)
              }

              _focus={{
                borderColor: "#22c55e",
                boxShadow: "0 0 0 1px #22c55e",
              }}

              _hover={{
                borderColor: "#22c55e",
              }}
            >

              {deviceOptions.map((opt: any) => (

                <option
                  key={opt.id}
                  value={opt.id}
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#000000",
                  }}
                >
                  {opt.label}
                </option>

              ))}

            </Select>

          </HStack>

        </HStack>

        {/* FIRST ROW */}
        <WMSTopCards selectedDevice={selectedDevice} />

        {/* SECOND ROW */}
        <HStack
          spacing="10px"
          align="stretch"
        >

          <Box w="37%">
            <WMSOverview selectedDevice={selectedDevice} />
          </Box>

          <Box
            w="48%"
            mt="-16px"
          >
            <WMSTrendChart selectedDevice={selectedDevice} />
          </Box>

          <Box
            w="25%"
            ml="-206px"
          >
            <WindRoseChart selectedDevice={selectedDevice} />
          </Box>

        </HStack>

        {/* THIRD ROW */}
        <HStack
          spacing="10px"
          align="stretch"
        >

          <Box w="36%">
            <ParameterTrends selectedDevice={selectedDevice} />
          </Box>

          <VStack
            spacing="10px"
            align="stretch"
            w="28%"
            ml="-119px"
          >
            <DailySummary selectedDevice={selectedDevice} />

            <WMSStationStatus selectedDevice={selectedDevice} />
          </VStack>

          <Box w="26%">
            <SensorStatus selectedDevice={selectedDevice} />
          </Box>

          <Box w="18%">
            <AlertsEvents selectedDevice={selectedDevice} />
          </Box>

        </HStack>

      </VStack>

    </Box>
  );
};

export default WMSDashboard_1;