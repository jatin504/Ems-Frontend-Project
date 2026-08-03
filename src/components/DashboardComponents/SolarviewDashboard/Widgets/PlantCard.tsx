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
import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import StaleIndicator from "../../../Common/StaleIndicator";
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
    { key: "total_inv_availability", alias: "Plant Availability", agg: "last", unit: "%" },
    { key: "grid_availability", alias: "Grid Availability", agg: "last", unit: "%" },
    { key: "grid_out", alias: "Grid Out", agg: "last", unit: "min" },
    { key: "grid_out_instance", alias: "Grid Out Occurrence", agg: "last", unit: "" },
    { key: "plant_down", alias: "Plant Downtime", agg: "last", unit: "min" },
    {
      key: "plant_down_instance",
      alias: "Plant Downtime Occurrence",
      agg: "last",
      unit: "",
    },
  ],

  solar: [
    { key: "inv_total_power", alias: "PV Power", agg: "last", unit: "kW" },
    { key: "inv_daily_energy", alias: "PV Generation", agg: "last", unit: "kWh" },
    { key: "inv_total_energy", alias: "PV Total Generation", agg: "last", unit: "kWh" },
    { key: "cuf_ac", alias: "CUF AC", agg: "last", unit: "%" },
    { key: "cuf_dc", alias: "CUF DC", agg: "last", unit: "%" },
    { key: "total_inv_pr", alias: "PR", agg: "last", unit: "%" },
  ],

  grid: [
    { key: "total_grid_power", alias: "Grid Power", agg: "last", unit: "kW" },
    { key: "grid_availability", alias: "Grid Availability", agg: "last", unit: "%" },
    { key: "grid_avg_frequency", alias: "Grid Frequency", agg: "last", unit: "Hz" },
    { key: "grid_avg_voltage", alias: "Grid Voltage", agg: "last", unit: "V" },
    { key: "grid_avg_current", alias: "Grid Current", agg: "last", unit: "A" },
    { key: "grid_export_today", alias: "Grid Export", agg: "last", unit: "kWh" },
    { key: "grid_import_today", alias: "Grid Import", agg: "last", unit: "kWh" },
  ],

  dg: [
    { key: "Alarm_1", alias: "DG Runtime Min", agg: "avg", unit: "h" },
    { key: "Alarm_2", alias: "DG Fuel Used", agg: "avg", unit: "L" },
    { key: "Fan_speed_1", alias: "DG Generation kWh", agg: "avg", unit: "h" },
    { key: "Fan_speed_2", alias: "DG Line Voltage V", agg: "avg", unit: "L" },
    { key: "DCDC2_Battery_side_voltage", alias: "Savings INR", agg: "avg", unit: "h" },
  ],

  bess: [
    { key: "Energy_charged_today", alias: "BESS kW", agg: "last", unit: "kWh" },
    { key: "Energy_discharged_today", alias: "Charge kWh", agg: "last", unit: "kWh" },
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
  ts?: number; // timestamp
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

  const {
    data: tsData,
    fetchData: fetchTsData,
  } = useTimeseriesData();

  /* API call */
  useEffect(() => {
    const fetchPlantCard = async () => {
      setLoading(true);

      const payload = {
        table: "plant_1_plant_device",
        today_table: "plant_1_plant_device",
        resolution: resolutionMap[currentResolution],
        info: statusInfoMap[currentStatus],
      };

      try {
        const res = await fetch(`${BASE_URL}/api/plant_card/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = await res.json();

        setData(json?.data?.[payload.resolution] ?? []);
      } catch (e) {
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantCard();

    const intervalId = setInterval(() => {
      fetchPlantCard();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [currentStatus, currentResolution]);

  /* Fetch common timestamp key */
  useEffect(() => {
    const fetchTimeseries = () => {
      fetchTsData({
        devices: {
          patterns: [],
          ids: ["plant_1_plant_device"],
        },

        keys: [
          {
            key: "inv_total_power",
            alias: "inv_total_power",
            keyType: "common",
          },
        ],

        aggregation: {
          func: "none",
          interval: 1,
          intervalType: "minute",
        },

        timeRange: {
          type: "last",
          interval: 1,
          intervalType: "minute",
        },

        orderBy: "DESC",
      } as any);
    };

    // Initial call
    fetchTimeseries();

    // Auto refresh every 1 minute
    const intervalId = setInterval(fetchTimeseries, 60000);

    return () => clearInterval(intervalId);
  }, []);

  /* Map backend response by alias */
  const dataMap = Object.fromEntries(data.map((d) => [d.key, d]));

  const commonTs =
    (tsData as any)?.[
      "plant_1_plant_device"
    ]?.["inv_total_power"]?.[0]
      ?.ts || 0;

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
              {Object.keys(statusInfoMap).map((s) => (
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
              {Object.keys(resolutionMap).map((r) => (
                <MenuItem key={r} onClick={() => setCurrentResolution(r)}>
                  {r.toUpperCase()}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </HStack>

        {/* CONTENT */}
        <VStack width="100%" spacing={2}>
          {loading && <Text color={secondaryColor}>Loading...</Text>}

          {!loading &&
            statusInfoMap[currentStatus].map((item) => {
              const row = dataMap[item.alias];

              return (
                <HStack
                  key={item.alias}
                  justifyContent="space-between"
                  width="100%"
                >
                  <Text color={secondaryColor}>{item.alias}</Text>

                  <HStack spacing={1}>
                    <HStack spacing={1}>
                      <Text fontWeight="600" color={primaryColor}>
                        {(() => {
                          let value = Number(row?.value);

                          if (isNaN(value)) return "--";

                          let unit = item.unit;

                          if (unit === "kWh") {
                            if (value >= 1000) {
                              value = value / 1000;
                              unit = "MWh";
                            }

                            return `${value.toFixed(2)} ${unit}`;
                          }

                          if (unit === "min") {
                            if (value < 60) {
                              return `${value} min`;
                            }

                            const hours = Math.floor(value / 60);
                            const minutes = value % 60;

                            if (minutes === 0) {
                              return `${hours}h`;
                            }

                            return `${hours}h${minutes}min`;
                          }

                          return `${value.toFixed(2)} ${unit}`;
                        })()}
                      </Text>

                      <StaleIndicator
                        ts={commonTs}
                        value={row?.value}
                      />
                    </HStack>
                  </HStack>
                </HStack>
              );
            })}
        </VStack>
      </VStack>

      {/* ================= Blink Animation ================= */}

      <style>
        {`
          .blink-icon {
            animation: blink 1s infinite;
          }

          @keyframes blink {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default PlantCard;