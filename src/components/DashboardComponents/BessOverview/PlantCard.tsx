import {
  Box,
  HStack,
  VStack,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";

/* ================= API BASE ================= */

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") || "";

/* Resolution mapping */
const resolutionMap: Record<string, string> = {
  daily: "today",
  yesterday: "yesterday",
  month: "month",
  year: "year",
  total: "total",
};

/* Status-wise info mapping */
const statusInfoMap: Record<string, any[]> = {
  status: [],

  solar: [
    { key: "Active_power", alias: "PV Generation kWh", agg: "avg", unit: "kWh" },
    { key: "Power_factor", alias: "PV Power kW", agg: "avg", unit: "kW" },
    { key: "Energy_charged_today", alias: "CUF%", agg: "avg", unit: "%" },
    {
      key: "Control_unit_cabin_dew_point_temperature",
      alias: "CO2 Saving kg",
      agg: "avg",
      unit: "kg",
    },
    { key: "soc", alias: "PR %", agg: "avg", unit: "%" },
  ],

  grid: [
    { key: "soc", alias: "Grid Availability", agg: "avg", unit: "%" },
    { key: "soc", alias: "Grid Outages", agg: "avg", unit: "" },
    { key: "soc", alias: "Grid Availability", agg: "avg", unit: "%" },
    { key: "soc", alias: "Grid Outages", agg: "avg", unit: "" },
  ],

  dg: [
    { key: "Alarm_1", alias: "DG Runtime Min", agg: "avg", unit: "h" },
    { key: "Alarm_2", alias: "DG Fuel Used", agg: "avg", unit: "L" },
    { key: "Fan_speed_1", alias: "DG Generation kWh", agg: "avg", unit: "h" },
    { key: "Fan_speed_2", alias: "DG Line Voltage V", agg: "avg", unit: "L" },
    { key: "DCDC2_Battery_side_voltage", alias: "Savings INR", agg: "avg", unit: "h" },
  ],

  bess: [
    { key: "Energy_charged_today", alias: "BESS kW", agg: "avg", unit: "kWh" },
    { key: "Energy_discharged_today", alias: "Charge kWh", agg: "avg", unit: "kWh" },
    { key: "Energy_charged_this_month", alias: "Discharge kWh", agg: "avg", unit: "kWh" },
    { key: "Energy_discharged_this_month", alias: "SoC%", agg: "avg", unit: "kWh" },
    { key: "Energy_charged_this_year", alias: "BESS Hz", agg: "avg", unit: "kWh" },
    { key: "Energy_discharged_this_year", alias: "Line Voltage V", agg: "avg", unit: "kWh" },
    { key: "BCU_2_Rack_current", alias: "Line Current A", agg: "avg", unit: "kWh" },
  ],
};

type CardItem = {
  key: string;
  value: number | null;
  unit: string;
};

const PlantCard = () => {
  const primaryBg = useColorModeValue("primary.light", "primary.dark");
  const primaryColor = useColorModeValue("primaryText.light", "primaryText.dark");
  const secondaryColor = useColorModeValue(
    "secondaryText.light",
    "secondaryText.dark"
  );
  const menuBg = useColorModeValue("#F5F7F8", "#424242");

  const [currentStatus, setCurrentStatus] = useState("status");
  const [currentResolution, setCurrentResolution] = useState("daily");
  const [data, setData] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlantCard = async () => {
      setLoading(true);

      const payload = {
        table: "plant_1_pcs_2_bank_bank_12",
        today_table: "plant_1_pcs_2_bank_bank_13",
        resolution: resolutionMap[currentResolution],
        info: statusInfoMap[currentStatus],
      };

      try {
        const res = await fetch(
          `${API_BASE}/api/plant_card/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        const json = await res.json();
        setData(json?.data?.[payload.resolution] ?? []);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantCard();
  }, [currentStatus, currentResolution]);

  const dataMap = Object.fromEntries(data.map((d) => [d.key, d]));

  return (
    <Box
      width="100%"
      h="300px"
      p="16px"
      rounded="12px"
      bg={primaryBg}
      fontSize="14px"
      position="relative"
      zIndex={1}
    >
      <VStack width="100%" height="100%">
        <HStack width="100%" justifyContent="space-between" mb={4}>
          <Menu placement="bottom-start">
            <MenuButton
              as={Button}
              width="97px"
              height="32px"
              bg={menuBg}
              fontSize="14px"
              fontWeight="600"
              rightIcon={<ChevronDownIcon />}
              textTransform="capitalize"
            >
              {currentStatus}
            </MenuButton>

            <MenuList bg={menuBg} zIndex={2000}>
              {Object.keys(statusInfoMap).map((s) => (
                <MenuItem key={s} onClick={() => setCurrentStatus(s)}>
                  {s.toUpperCase()}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu placement="bottom-start">
            <MenuButton
              as={Button}
              height="32px"
              bg={menuBg}
              fontSize="14px"
              fontWeight="600"
              rightIcon={<ChevronDownIcon />}
              textTransform="capitalize"
            >
              {currentResolution}
            </MenuButton>

            <MenuList bg={menuBg} zIndex={2000}>
              {Object.keys(resolutionMap).map((r) => (
                <MenuItem key={r} onClick={() => setCurrentResolution(r)}>
                  {r.toUpperCase()}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </HStack>

        <VStack width="100%" spacing={0}>
          {currentStatus === "status" ? (
            <>
              <HStack
                width="100%"
                minH="45px"
                justifyContent="space-between"
                borderBottom="1px solid"
                borderColor={useColorModeValue("#E5E5E5", "#4A4A4A")}
              >
                <Text
                  fontSize="11px"
                  color={secondaryColor}
                  whiteSpace="nowrap"
                >
                  Operating Mode
                </Text>
                <HStack spacing={1}>
                  <Text
                    fontSize="11px"
                    fontWeight="600"
                    color={primaryColor}
                    textAlign="right"
                    maxW="150px"
                    whiteSpace="normal"
                    lineHeight="16px"
                  >
                    GRID CONNECTED — GFL — PQ CONTROL
                  </Text>
                  <Text
                    fontSize="20px"
                    lineHeight="1"
                    fontWeight="300"
                    color={secondaryColor}
                    flexShrink={0}
                  >
                    ›
                  </Text>
                </HStack>
              </HStack>

              <HStack
                width="100%"
                minH="45px"
                justifyContent="space-between"
              >
                <Text
                  fontSize="11px"
                  color={secondaryColor}
                  whiteSpace="nowrap"
                >
                  EMS Strategy
                </Text>
                <HStack spacing={1}>
                  <Text
                    fontSize="11px"
                    fontWeight="600"
                    color={primaryColor}
                    whiteSpace="nowrap"
                  >
                    Peak Shaving
                  </Text>
                  <Text
                    fontSize="20px"
                    lineHeight="1"
                    fontWeight="300"
                    color={secondaryColor}
                  >
                    ›
                  </Text>
                </HStack>
              </HStack>
            </>
          ) : (
            <>
              {loading && (
                <Text color={secondaryColor}>
                  Loading...
                </Text>
              )}

              {!loading &&
                statusInfoMap[currentStatus].map((item) => {
                  const row = dataMap[item.key];
                  return (
                    <HStack
                      key={item.key}
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Text color={secondaryColor}>
                        {item.alias}
                      </Text>
                      <Text fontWeight="600" color={primaryColor}>
                        {row?.value ?? "--"} {item.unit}
                      </Text>
                    </HStack>
                  );
                })}
            </>
          )}
        </VStack>

        {/* ================= BOTTOM STATUS BAR ================= */}
{currentStatus === "status" && (
  <HStack
    width="100%"
    minH="32px"
    mt="auto"
    px="2px"
    spacing={0}
    borderTop="1px solid"
    borderColor={useColorModeValue("#E5E5E5", "#4A4A4A")}
    overflow="hidden"
  >
    {/* RUNNING */}
    <HStack
      flex="1.25"
      minW={0}
      spacing={0}
      justifyContent="center"
      px="4px"
      borderRight="1px solid"
      borderColor={useColorModeValue("#E5E5E5", "#4A4A4A")}
    >
      <Box
        w="16px"
        h="16px"
        minW="16px"
        borderRadius="50%"
        bg="#16A34A"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
        fontSize="8px"
      >
        ▶
      </Box>

      <Text
        fontSize="8px"
        fontWeight="700"
        color="#16A34A"
        whiteSpace="nowrap"
        position="relative"
        left="0px"
      >
        RUNNING
      </Text>
    </HStack>

    {/* GRID CONNECTED */}
    <Text
      flex="1.5"
      minW={0}
      textAlign="center"
      fontSize="7px"
      color={secondaryColor}
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
      px="2px"
      borderRight="1px solid"
      borderColor={useColorModeValue("#E5E5E5", "#4A4A4A")}
    >
      GRID CONNECTED
    </Text>

    {/* GFL */}
    <Text
      flex="0.55"
      minW={0}
      textAlign="center"
      fontSize="7px"
      color={secondaryColor}
      whiteSpace="nowrap"
      overflow="hidden"
      px="2px"
      borderRight="1px solid"
      borderColor={useColorModeValue("#E5E5E5", "#4A4A4A")}
    >
      GFL
    </Text>

    {/* PQ */}
    <Text
      flex="0.45"
      minW={0}
      textAlign="center"
      fontSize="7px"
      color={secondaryColor}
      whiteSpace="nowrap"
      px="2px"
      borderRight="1px solid"
      borderColor={useColorModeValue("#E5E5E5", "#4A4A4A")}
    >
      PQ
    </Text>

    {/* PEAK SHAVING */}
    <Text
      flex="1.25"
      minW={0}
      textAlign="center"
      fontSize="7px"
      color={secondaryColor}
      fontWeight="500"
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
      px="2px"
    >
      PEAK SHAVING
    </Text>
  </HStack>
)}
      </VStack>
    </Box>
  );
};

export default PlantCard;