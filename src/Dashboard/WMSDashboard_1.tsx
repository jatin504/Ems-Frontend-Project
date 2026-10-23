import {
  Box,
  VStack,
  HStack,
  useColorModeValue,
  Text,
  Select,
  Grid,
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
      minW={0}
      sx={{
        ".wms-widget": { minWidth: 0 },
        ".wms-widget > :not(:fullscreen)": { width: "100%", maxWidth: "100%", height: "100%", margin: 0 },
      }}
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
        <Grid
          templateColumns={{ base: "minmax(0,1fr)", xl: "minmax(0,1.35fr) minmax(0,1.4fr) minmax(0,0.95fr)" }}
          gap="10px"
          align="stretch"
        >

          <Box className="wms-widget">
            <WMSOverview selectedDevice={selectedDevice} />
          </Box>

          <Box
            className="wms-widget"
          >
            <WMSTrendChart selectedDevice={selectedDevice} />
          </Box>

          <Box
            className="wms-widget"
          >
            <WindRoseChart selectedDevice={selectedDevice} />
          </Box>

        </Grid>

        {/* THIRD ROW */}
        <Grid
          templateColumns={{ base: "minmax(0,1fr)", xl: "minmax(0,1.15fr) minmax(0,1.1fr) minmax(0,1.2fr) minmax(0,0.75fr)" }}
          gap="10px"
          align="stretch"
        >

          <Box className="wms-widget">
            <ParameterTrends selectedDevice={selectedDevice} />
          </Box>

          <VStack
            spacing="10px"
            align="stretch"
            minW={0}
            sx={{ "& > div": { flex: 1 } }}
          >
            <Box className="wms-widget" w="100%"><DailySummary selectedDevice={selectedDevice} /></Box>

            <Box className="wms-widget" w="100%"><WMSStationStatus selectedDevice={selectedDevice} /></Box>
          </VStack>

          <Box className="wms-widget">
            <SensorStatus selectedDevice={selectedDevice} />
          </Box>

          <Box className="wms-widget">
            <AlertsEvents selectedDevice={selectedDevice} />
          </Box>

        </Grid>

      </VStack>

    </Box>
  );
};

export default WMSDashboard_1;
