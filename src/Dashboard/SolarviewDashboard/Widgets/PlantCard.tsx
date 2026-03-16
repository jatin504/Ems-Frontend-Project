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
const BASE_URL = import.meta.env.VITE_API_BASE;
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
  status: [
    { key: "soc", alias: "Plant Availability", agg: "avg", unit: "%" },
    { key: "Alarm_1", alias: "Grid Availability", agg: "avg", unit: "%" },
    { key: "Active_power", alias: "Grid Out", agg: "avg", unit: "" },
    { key: "soc", alias: "Grid Occurrence", agg: "avg", unit: "%" },
    { key: "Alarm_1", alias: "Plant Downtime", agg: "avg", unit: "%" },
    { key: "Active_power", alias: "Load Loss", agg: "avg", unit: "" },
    {
      key: "soc",
      alias: "Plant Downtime Occurrence",
      agg: "avg",
      unit: "",
    },
  ],

  solar: [
    { key: "Active_power", alias: "PV Generation kWh", agg: "avg", unit: "kWh" },
    { key: "Power_factor", alias: "PV Power kW", agg: "avg", unit: "kW" },
    { key: "Energy_charged_today", alias: "CUF%", agg: "avg", unit: "%" },
    { key: "Control_unit_cabin_dew_point_temperature", alias: "CO2 Saving kg", agg: "avg", unit: "kg" },
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
  key: string;   // alias from backend
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

  /* API call – layout SAME, data dynamic */
  useEffect(() => {
    const fetchPlantCard = async () => {
      setLoading(true);

      const payload = {
        table: "plant_1_pcs_2_bank_bank_18",
        today_table: "plant_1_pcs_2_bank_bank_19",
        resolution: resolutionMap[currentResolution],
        info: statusInfoMap[currentStatus],
      };

      try {
        const res = await fetch(
  `${BASE_URL}/api/plant_card/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        const json = await res.json();
        setData(json?.data?.[payload.resolution] ?? []);
      } catch (e) {
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantCard();
  }, [currentStatus, currentResolution]);

  /* Map backend response by alias for stable order */
  const dataMap = Object.fromEntries(data.map(d => [d.key, d]));

  return (
    <Box
      width="330px"
      height="100%"
      p="16px"
      rounded="12px"
      bg={primaryBg}
      fontSize="14px"
      position="relative"
      zIndex={1}
    >
      <VStack width="100%" height="100%">
        {/* HEADER */}
        <HStack width="100%" justifyContent="space-between" mb={4}>
          {/* STATUS DROPDOWN */}
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
              {Object.keys(statusInfoMap).map(s => (
                <MenuItem key={s} onClick={() => setCurrentStatus(s)}>
                  {s.toUpperCase()}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          {/* RESOLUTION DROPDOWN */}
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
              {Object.keys(resolutionMap).map(r => (
                <MenuItem key={r} onClick={() => setCurrentResolution(r)}>
                  {r.toUpperCase()}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </HStack>

        {/* CONTENT – LAYOUT SAME */}
        <VStack width="100%" spacing={2}>
          {loading && <Text color={secondaryColor}>Loading...</Text>}

          {!loading &&
            statusInfoMap[currentStatus].map(item => {
              const row = dataMap[item.alias];
              return (
                <HStack
                  key={item.alias}
                  justifyContent="space-between"
                  width="100%"
                >
                  <Text color={secondaryColor}>{item.alias}</Text>
                  <Text fontWeight="600" color={primaryColor}>
                    {row?.value ?? "--"} {item.unit}
                  </Text>
                </HStack>
              );
            })}
        </VStack>
      </VStack>
    </Box>
  );
};

export default PlantCard;
