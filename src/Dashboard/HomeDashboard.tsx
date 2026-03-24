import {
  Box,
  VStack,
  Grid,
  useColorModeValue,
  Text,
  HStack,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody
} from "@chakra-ui/react";

import { WarningTwoIcon, InfoIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";

import usePlantConfig from "../hooks/usePlantConfig";
import { useAlarmLatest } from "../hooks/useAlarmLatest";
import RtcDispatchTrend from "../components/DashboardComponents/HomedashboardComponent/RtcDispatchTrend";
import PowerSummaryCard from "../components/DashboardComponents/HomedashboardComponent/PowerSummaryCard";
import GroupCaptivePerformance from "../components/DashboardComponents/HomedashboardComponent/GroupCaptivePerformance";
import plantImg from "../assets/plant.jpg";
import FaultGraph from "../components/DashboardComponents/HomedashboardComponent/FaultGraph";
import CarbonEmissions from "../components/DashboardComponents/HomedashboardComponent/CarbonEmissions";
import DynamicBlockOverlay from "../components/DashboardComponents/HomedashboardComponent/DynamicBlockOverlay";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") || "";

const getPRColor = (pr:number) => {
  if (pr < 85) return "#dc2626";
  if (pr <= 90) return "#f59e0b";
  return "#16a34a";
};


/* STRONG PREMIUM GLOW CIRCLE */
const FixedCircle = ({ value, color, top, left }: any) => (
  <Box
    position="absolute"
    top={top}
    left={left}
    transform="translate(-50%,-50%)"
    w="38px"
    h="38px"
    borderRadius="full"
    bg={color}
    display="flex"
    alignItems="center"
    justifyContent="center"
    fontWeight="bold"
    fontSize="11px"
    color="white"
    border="3px solid white"
    boxShadow={`
      0 0 0 4px ${color}55,
      0 0 18px ${color},
      0 0 35px ${color}aa,
      0 12px 28px rgba(0,0,0,0.85)
    `}
  >
    {value}
  </Box>
);


/* BLINKING DANGER */
const FixedDanger = ({ top, left, device }: any) => (
  <Tooltip
    hasArrow
    placement="top"
    bg="rgba(20,25,40,0.95)"
    border="1px solid rgba(255,255,255,0.15)"
    borderRadius="12px"
    p={3}
    label={
      <VStack align="start" spacing={1}>
        <Text fontWeight="bold" fontSize="sm">{device}</Text>
        <Text fontSize="xs">Status: Emergency</Text>
      </VStack>
    }
  >
    <Box
      position="absolute"
      top={top}
      left={left}
      transform="translate(-50%,-50%)"
      color="red.400"
      fontSize="30px"
      cursor="pointer"
      animation="blinkFault 1s infinite"
      sx={{
        "@keyframes blinkFault": {
          "0%": {
            opacity: 1,
            transform: "translate(-50%,-50%) scale(1)",
            filter: "drop-shadow(0 0 8px red)"
          },
          "50%": {
            opacity: 0.3,
            transform: "translate(-50%,-50%) scale(1.25)",
            filter: "drop-shadow(0 0 22px red)"
          },
          "100%": {
            opacity: 1,
            transform: "translate(-50%,-50%) scale(1)",
            filter: "drop-shadow(0 0 8px red)"
          }
        }
      }}
    >
      <WarningTwoIcon />
    </Box>
  </Tooltip>
);


const LegendItem = ({ color, label }: any) => (
  <HStack spacing={2}>
    <Box w="10px" h="10px" bg={color} borderRadius="sm" />
    <Text fontSize="xs" color="white">{label}</Text>
  </HStack>
);


const HomeDashboard = () => {

  const { plantConfig } = usePlantConfig();
  const { rows: latestAlarms } = useAlarmLatest();
  const [prs, setPrs] = useState({ inv1: 0, inv2: 0, inv3: 0 });
  const bgColor = useColorModeValue("gray.100", "gray.900");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/lastest-direct-data/multiple-latest-devices`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ device_ids: "plant_1_pcs_2_bank_bank_1" })
          }
        );

        const j = await res.json();
        if (!j.success) return;

        const d = j.data?.["plant_1_pcs_2_bank_bank_1"];
        if (!d) return;

        const getVal = (key: string) => {
          const real = Object.keys(d).find(k => k.trim() === key);
          if (!real) return 0;
          return Number(d[real]?.value ?? 0);
        };

        setPrs({
          inv1: getVal("Quantity_of_rectifiers"),
          inv2: getVal("Total_auxiliary_power_consumption"),
          inv3: getVal("Fan_speed_3")
        });
      } catch (e) {
        console.error("PR load error", e);
      }
    };

    load();
    const i = setInterval(load, 60000);
    return () => clearInterval(i);
  }, []);

  const emergencyInverterAlarms = latestAlarms.filter(
    (a) =>
      a.state?.toLowerCase() === "emergency" &&
      a.deviceId?.toLowerCase().includes("inverter")
  );

  return (
    <Box bg={bgColor} minH="100vh" px={4} pb={6} mt={-4}>

      <VStack spacing={6} align="stretch">

        <Box w="100%" h="500px" borderRadius="lg" overflow="hidden" position="relative" boxShadow="xl">

          <Box
            as="img"
            src={plantImg}
            position="absolute"
            top="62%"
            left="50%"
            w="120%"
            h="120%"
            objectFit="cover"
            transform="translate(-50%,-50%)"
            pointerEvents="none"
          />

          {/* POPOVER */}
          <Box position="absolute" top="12px" right="12px" zIndex={30}>
            <Popover placement="left-start" gutter={0} strategy="fixed" isLazy closeOnBlur>
              <PopoverTrigger>
                <Box
                  bg="rgba(30,60,120,0.6)"
                  backdropFilter="blur(8px)"
                  border="1px solid rgba(255,255,255,0.25)"
                  borderRadius="full"
                  w="28px"
                  h="28px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontSize="13px"
                  boxShadow="0 6px 14px rgba(0,0,0,0.6)"
                  _hover={{ transform: "scale(1.15)" }}
                  cursor="pointer"
                >
                  <InfoIcon />
                </Box>
              </PopoverTrigger>

              <PopoverContent
                position="absolute"
                right="36px"
                top="-6px"
                w="260px"
                bg="linear-gradient(135deg,#0b132b,#1c2541)"
                color="white"
                border="1px solid rgba(255,255,255,0.15)"
                borderRadius="16px"
                boxShadow="0 30px 80px rgba(0,0,0,0.9)"
              >
                <PopoverBody p={4}>
                  <VStack align="stretch" spacing={3}>
                    <Text fontWeight="700">Plant Configuration</Text>

                    <Text fontSize="sm">
                      Plant Name: {plantConfig?.plant_config?.plantName || "-"}
                    </Text>
                    <Text fontSize="sm">
                      Capacity MW: {plantConfig?.plant_config?.capacityMW || "-"}
                    </Text>
                    <Text fontSize="sm">
                      Capacitor KVAR: {plantConfig?.plant_config?.capacitorKVAR || "-"}
                    </Text>
                    <Text fontSize="sm">
                      Location: {plantConfig?.plant_config?.location || "-"}
                    </Text>
                    <Text fontSize="sm">
                      Description: {plantConfig?.plant_config?.description || "-"}
                    </Text>
                  </VStack>
                </PopoverBody>
              </PopoverContent>

            </Popover>
          </Box>

          {/* BLOCK CARD */}
          <Box position="absolute" top="70px" right="30px" zIndex={10}>
            <DynamicBlockOverlay />
          </Box>

          {/* HOTSPOTS */}
          <Box position="absolute" top="12%" left="8%" width="84%" height="28%">
            <FixedCircle
              value={prs.inv1}
              color={getPRColor(prs.inv1)}
              top="27.40%"
              left="32.73%"
            />
            <FixedCircle
              value={prs.inv2}
              color={getPRColor(prs.inv2)}
              top="65%"
              left="45%"
            />
            <FixedCircle
              value={prs.inv3}
              color={getPRColor(prs.inv3)}
              top="40%"
              left="78%"
            />

            {emergencyInverterAlarms.map((alarm, i) => (
              <FixedDanger
                key={alarm.deviceId + alarm.rawTimeStamp}
                top={i === 0 ? "99.20%" : "35%"}
                left={i === 0 ? "29.33%" : "60%"}
                device={alarm.device}
              />
            ))}
          </Box>

          {/* LEGEND */}
          <Box position="absolute" top="20px" left="20px" bg="rgba(0,0,0,0.6)" p={3} borderRadius="md">
            <Text fontWeight="bold" mb={1} color="white" fontSize="sm">
              Performance Ratio
            </Text>

            <VStack align="start" spacing={1}>
              <LegendItem color="#dc2626" label="<85" />
              <LegendItem color="#f59e0b" label="85-90" />
              <LegendItem color="#16a34a" label=">90" />
            </VStack>
          </Box>

          <Box position="absolute" bottom="20px" left="20px" zIndex={5}>
            <CarbonEmissions />
          </Box>

        </Box>

        <Grid templateColumns="1fr 1fr 320px 340px" gap={6} alignItems="start">
          <Box mt={-5}><RtcDispatchTrend /></Box>
          <Box mt={-5} ml={-3}><PowerSummaryCard /></Box>
          <Box ml={-120} mt={-5}><FaultGraph /></Box>
          <GroupCaptivePerformance />
        </Grid>

      </VStack>

    </Box>
  );
};

export default HomeDashboard;