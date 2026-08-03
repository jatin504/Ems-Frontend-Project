import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  useColorMode,
  useColorModeValue,
  IconButton,
  HStack,
  CircularProgress,
} from "@chakra-ui/react";

import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMediaQuery } from "@chakra-ui/react";

import { MdElectricBolt, MdLinkOff } from "react-icons/md";
import { ExpandIcon, SqeezIcon } from "../../../../assets/Icons";
import { useNavigate } from "react-router-dom";

/* ================= Mini Bar ================= */

const MiniBar = ({
  value = 0,
  max = 1,
  height = "8px",
  width = "100%",
}: any) => {
  const toNum = (v: any) => {
    if (typeof v === "number") return v;

    if (v === null || v === undefined) {
      return 0;
    }

    const match = String(v).match(/-?\d+(\.\d+)?/);

    return match ? parseFloat(match[0]) : 0;
  };

  const numVal = toNum(value);
  const numMax = toNum(max);

  const pct =
    numMax > 0
      ? Math.max(0, Math.min(1, numVal / numMax))
      : 0;

  return (
    <Box
      bg="#EDF2F7"
      w={width}
      h={height}
      borderRadius="999px"
      overflow="hidden"
    >
      <Box
        bg="linear-gradient(90deg,#22C55E,#4ADE80)"
        h="100%"
        w={`${pct * 100}%`}
        transition="width 0.45s ease, background 0.45s ease"
        sx={{ willChange: "width" }}
      />
    </Box>
  );
};

type TrendType = "up" | "down" | "same";

const TrendArrow = ({ trend }: { trend: TrendType }) => {
  if (trend === "up")
    return (
      <Text color="green.500" fontWeight="700">
        ▲
      </Text>
    );

  if (trend === "down")
    return (
      <Text color="red.500" fontWeight="700">
        ▼
      </Text>
    );

  return (
    <Text color="gray.400" fontWeight="700">
      ▬
    </Text>
  );
};

/* ================= TYPES ================= */

interface PCSData {
  deviceId: string;
  name: string;

  reactivePower: string;
  reactivePower_raw: number;

  activePower: string;
  activePower_raw: number;

  dcCurrentB1: string;
  dcCurrentB1_raw: number;

  dcCurrentB2: string;
  dcCurrentB2_raw: number;

  dcVoltB1: string;
  dcVoltB1_raw: number;

  dcVoltB2: string;
  dcVoltB2_raw: number;

  dcVoltB3: string;
  dcVoltB3_raw: number;

  dcVoltTotal: string;
  dcVoltTotal_raw: number;

  acCurrentL1: string;
  acCurrentL1_raw: number;

  acCurrentL2: string;
  acCurrentL2_raw: number;

  acCurrentL3: string;
  acCurrentL3_raw: number;

  gridFrequency: string;
  gridFrequency_raw: number;

  reactivePowerTrend: TrendType;
  activePowerTrend: TrendType;
  dcCurrentB1Trend: TrendType;
  dcCurrentB2Trend: TrendType;
  dcVoltB1Trend: TrendType;
  dcVoltB2Trend: TrendType;
  dcVoltB3Trend: TrendType;
  dcVoltTotalTrend: TrendType;
  acCurrentL1Trend: TrendType;
  acCurrentL2Trend: TrendType;
  acCurrentL3Trend: TrendType;
  gridFrequencyTrend: TrendType;

  isLive: boolean;
  rawData?: any;
}

/* ================= COMPONENT ================= */

export default function  PCSOverview() {
  const navigate = useNavigate();

  const [isShortScreen] = useMediaQuery("(max-width:900px)");
  const { colorMode } = useColorMode();

  const bodyBg = useColorModeValue("#FFFFFF", "#000000");

  const tableMode = useColorModeValue("light", "dark");

  const BASE_URL = import.meta.env.VITE_API_BASE;

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: tableMode,
        },
      }),
    [tableMode]
  );

  const panelRef = useRef<HTMLDivElement>(null);

  const [rows, setRows] = useState<PCSData[]>([]);

  const previousValues = useRef<
    Record<
      string,
      {
        reactivePower: number;
        activePower: number;
        dcCurrentB1: number;
        dcCurrentB2: number;
        dcVoltB1: number;
        dcVoltB2: number;
        dcVoltB3: number;
        dcVoltTotal: number;
        acCurrentL1: number;
        acCurrentL2: number;
        acCurrentL3: number;
        acVoltL1L2: number;
        acVoltL2L3: number;
        acVoltL3L1: number;
        gridFrequency: number;
        pf: number;
        apparentPower: number;
      }
    >
  >({});

  const [dataMap, setDataMap] = useState<Record<string, any>>({});

  const [isFullscreen, setIsFullscreen] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 15,
  });

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      panelRef.current?.requestFullscreen();
      setIsFullscreen(true);
      setPagination({ pageIndex: 0, pageSize: 15 });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      setPagination({ pageIndex: 0, pageSize: 15 });
    }
  };

  useEffect(() => {
    const fn = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      setPagination({ pageIndex: 0, pageSize: fs ? 15 : 15 });
    };
    document.addEventListener("fullscreenchange", fn);
    return () => document.removeEventListener("fullscreenchange", fn);
  }, []);
    /* ---------- backend key map ---------- */

  const COLUMN_KEY_MAP: Record<string, string> = {
    Active_Power: "Active_Power_kW",
    Reactive_Power: "Reactive_Power_kVAR",

    Current: "Amps",
    Voltage: "Voltage",

    Frequency: "Frequency_Hz",

    SoC: "SoC",
    SoH: "SoH",

    Charge_Energy: "Charge_Energy_kWh",
    Discharge_Energy: "Discharge_Energy_kWh",

    DoD: "DoD",

    Temperature: "Temperature",

    Control_State: "Control_State",
  };

  const getTrend = (
    current: number,
    previous: number | undefined
  ): TrendType => {
    if (previous === undefined) return "same";

    if (current > previous) return "up";

    if (current < previous) return "down";

    return "same";
  };

  /* ---------- API ---------- */

  useEffect(() => {
    const fetchData = () => {
      fetch(
        `${BASE_URL}/api/lastest-direct-data/multiple-latest-devices`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            device_id_patterns: ["_pcs_pcs_"],
          }),
        }
      )
        .then((r) => r.json())
        .then((j) => {
          if (j.success) {
            const filteredData = Object.fromEntries(
              Object.entries(j.data || {}).filter(
                ([deviceId]) => /_pcs_pcs_\d+$/.test(deviceId)
              )
            );

            setDataMap(filteredData);
          }
        })
        .catch(console.error);
    };

    fetchData();

    const interval = setInterval(fetchData, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  /* ---------- map data ---------- */

  useEffect(() => {
    const mapped: PCSData[] = [];

    const now = Date.now();

    Object.entries(dataMap).forEach(([deviceId, d]: any) => {
      const suffix = deviceId.match(/_(\d+)$/)?.[1];

      const name = suffix ? `PCS-${suffix}` : deviceId;

      const toNum = (key: keyof typeof COLUMN_KEY_MAP) => {
        const value = d?.[COLUMN_KEY_MAP[key]]?.value;

        if (
          value === null ||
          value === undefined ||
          value === "" ||
          Number.isNaN(value)
        ) {
          return 0;
        }

        return Number(value);
      };

      const toDisplay = (key: keyof typeof COLUMN_KEY_MAP) => {
        const field = d?.[COLUMN_KEY_MAP[key]];

        const value = field?.value;

        const unit = field?.unit ?? "";

        if (
          value === null ||
          value === undefined ||
          value === ""
        ) {
          return "--";
        }

        return `${value} ${unit}`.trim();
      };

      const tsValue = d?.Time_Stamp?.value;

      const ts = tsValue
        ? new Date(tsValue).getTime()
        : 0;

      const isLive =
        !!ts && now - ts < 10 * 60 * 1000;

      const prev = previousValues.current[deviceId];

      const reactivePowerTrend = getTrend(
        toNum("Reactive_Power"),
        prev?.reactivePower
      );

      const activePowerTrend = getTrend(
        toNum("Active_Power"),
        prev?.activePower
      );

      const dcCurrentB1Trend = getTrend(
        toNum("DC_Current_B1"),
        prev?.dcCurrentB1
      );

      const dcCurrentB2Trend = getTrend(
        toNum("DC_Current_B2"),
        prev?.dcCurrentB2
      );

      const dcVoltB1Trend = getTrend(
        toNum("DC_Volt_B1"),
        prev?.dcVoltB1
      );

      const dcVoltB2Trend = getTrend(
        toNum("DC_Volt_B2"),
        prev?.dcVoltB2
      );

      const dcVoltB3Trend = getTrend(
        toNum("DC_Volt_B3"),
        prev?.dcVoltB3
      );

      const dcVoltTotalTrend = getTrend(
        toNum("DC_Volt_Total"),
        prev?.dcVoltTotal
      );

      const acCurrentL1Trend = getTrend(
        toNum("AC_Current_L1"),
        prev?.acCurrentL1
      );

      const acCurrentL2Trend = getTrend(
        toNum("AC_Current_L2"),
        prev?.acCurrentL2
      );

      const acCurrentL3Trend = getTrend(
        toNum("AC_Current_L3"),
        prev?.acCurrentL3
      );

      const gridFrequencyTrend = getTrend(
        toNum("Frequency_Hz"),
        prev?.gridFrequency
      );

      mapped.push({
        deviceId,
        name,

        reactivePower: toDisplay("Reactive_Power"),
        reactivePower_raw: toNum("Reactive_Power"),
        reactivePowerTrend,

        activePower: toDisplay("Active_Power"),
        activePower_raw: toNum("Active_Power"),
        activePowerTrend,

        dcCurrentB1: toDisplay("Current"),
        dcCurrentB1_raw: toNum("Current"),
        dcCurrentB1Trend: getTrend(toNum("Current"), prev?.dcCurrentB1),

        dcCurrentB2: toDisplay("SoC"),
        dcCurrentB2_raw: toNum("SoC"),
        dcCurrentB2Trend: getTrend(toNum("SoC"), prev?.dcCurrentB2),

        dcVoltB1: toDisplay("Voltage"),
        dcVoltB1_raw: toNum("Voltage"),
        dcVoltB1Trend: getTrend(toNum("Voltage"), prev?.dcVoltB1),

        dcVoltB2: toDisplay("SoH"),
        dcVoltB2_raw: toNum("SoH"),
        dcVoltB2Trend: getTrend(toNum("SoH"), prev?.dcVoltB2),

        dcVoltB3: toDisplay("Temperature"),
        dcVoltB3_raw: toNum("Temperature"),
        dcVoltB3Trend: getTrend(toNum("Temperature"), prev?.dcVoltB3),

        dcVoltTotal: toDisplay("DoD"),
        dcVoltTotal_raw: toNum("DoD"),
        dcVoltTotalTrend: getTrend(toNum("DoD"), prev?.dcVoltTotal),

        acCurrentL1: toDisplay("Charge_Energy"),
        acCurrentL1_raw: toNum("Charge_Energy"),
        acCurrentL1Trend: getTrend(toNum("Charge_Energy"), prev?.acCurrentL1),

        acCurrentL2: toDisplay("Discharge_Energy"),
        acCurrentL2_raw: toNum("Discharge_Energy"),
        acCurrentL2Trend: getTrend(toNum("Discharge_Energy"), prev?.acCurrentL2),

        acCurrentL3: toDisplay("Control_State"),
        acCurrentL3_raw: toNum("Control_State"),
        acCurrentL3Trend: getTrend(toNum("Control_State"), prev?.acCurrentL3),

        gridFrequency: toDisplay("Frequency_Hz"),
        gridFrequency_raw: toNum("Frequency_Hz"),
        gridFrequencyTrend: getTrend(toNum("Frequency_Hz"), prev?.gridFrequency),

        isLive,
        rawData: d,
      });

      previousValues.current[deviceId] = {
        reactivePower: toNum("Reactive_Power"),
        activePower: toNum("Active_Power"),
        dcCurrentB1: toNum("DC_Current_B1"),
        dcCurrentB2: toNum("DC_Current_B2"),
        dcVoltB1: toNum("DC_Volt_B1"),
        dcVoltB2: toNum("DC_Volt_B2"),
        dcVoltB3: toNum("DC_Volt_B3"),
        dcVoltTotal: toNum("DC_Volt_Total"),
        acCurrentL1: toNum("AC_Current_L1"),
        acCurrentL2: toNum("AC_Current_L2"),
        acCurrentL3: toNum("AC_Current_L3"),
        gridFrequency: toNum("Frequency_Hz"),
      };
    });

    setRows(mapped);
  }, [dataMap]);

  /* ---------- sort ---------- */

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const na = Number(a.name.replace(/[^\d]/g, ""));
      const nb = Number(b.name.replace(/[^\d]/g, ""));
      return na - nb;
    });
  }, [rows]);
  const allColumns = useMemo<MRT_ColumnDef<PCSData>[]>(
  () => [
    {
      accessorKey: "name",
      header: "PCS",
      size: isShortScreen ? 67 : 110,
      grow: 0,
      minSize: isShortScreen ? 67 : 110,
      maxSize: isShortScreen ? 67 : 110,
      muiTableHeadCellProps: {
        sx: {
          textAlign: "left",
          pl: isShortScreen ? "2px" : "8px",
          fontSize: "9px",
        },
      },
      muiTableBodyCellProps: {
        sx: {
          textAlign: "left",
          pl: 1,
          fontSize: "9px",
        },
      },
      Cell: ({ row }) => (
        <Box
          w="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Text
            fontSize="13px"
            fontWeight="700"
            color="#2563EB"
            cursor="pointer"
            transition=".2s"
            _hover={{
              color: "#1D4ED8",
              textDecoration: "underline",
            }}
            onClick={() =>
              navigate("/devices/pcs/details", {
                state: {
                  selectedDevice: {
                    device_id: row.original.deviceId,
                    name: row.original.name,
                    rawData: row.original.rawData,
                  },
                },
              })
            }
          >
            {row.original.name}
          </Text>
        </Box>
      ),
    },

    {
      id: "status",
      header: "Status",
      size: isShortScreen ? 55 : 90,
      minSize: isShortScreen ? 55 : 90,
      maxSize: isShortScreen ? 55 : 90,
      enableSorting: false,
      Cell: ({ row }) => {
        const d = row.original.rawData;

        const lastTs = d?.Time_Stamp?.value
          ? new Date(d.Time_Stamp.value).getTime()
          : 0;

        const activePower =
          d?.Active_Power_kW?.value ?? 0;

        const now = Date.now();

        const renderStatusIcon = (label: string, color: string, icon: React.ReactNode) => (
          <Box
            as="span"
            title={label}
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="999px"
            p={1}
            _hover={{
              bg: "rgba(0,0,0,0.06)",
            }}
          >
            {React.isValidElement(icon)
              ? React.cloneElement(icon, {
                  color,
                  size: 16,
                  style: { cursor: "pointer" },
                })
              : icon}
          </Box>
        );

        if (!lastTs || now - lastTs > 4 * 60 * 1000) {
          return (
            <Box
              w="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {renderStatusIcon("Non-Comm", "orange", <MdLinkOff />)}
            </Box>
          );
        }

        if (activePower > 0) {
          return (
            <Box
              w="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {renderStatusIcon("Running", "#16A34A", <MdElectricBolt />)}
            </Box>
          );
        }

        return (
          <Box
            w="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {renderStatusIcon("Stop", "red", <MdElectricBolt />)}
          </Box>
        );
      },
    },

    {
      accessorKey: "activePower",
      header: "Active Power (kW)",
      size: 120,
      Cell: ({ row }) => (
        <HStack
          key={`${colorMode}-${row.original.deviceId}-activePower`}
          w="100%"
          minW="92px"
          h="28px"
          px={2}
          spacing={2}
          bg={colorMode === "dark" ? "#000000" : "#FFFFFF"}
          borderRadius="8px"
          border="1px solid"
          borderColor={
            colorMode === "dark" ? "#2D3748" : "#E5E7EB"
          }
          color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
          justifyContent="center"
          transition=".25s"
          _hover={{
            borderColor: "#94A3B8",
            boxShadow: "0 8px 18px rgba(15,23,42,.08)",
          }}
        >
          <Text
            color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
            fontWeight="600"
            fontSize="11px"
          >
            {row.original.activePower}
          </Text>
          <TrendArrow trend={row.original.activePowerTrend} />
        </HStack>
      ),
    },

    {
      accessorKey: "dcCurrentB1",
      header: "Current (A)",
      size: 120,
      Cell: ({ row }) => (
        <HStack
          key={`${colorMode}-${row.original.deviceId}-dcCurrentB1`}
          w="100%"
          minW="92px"
          h="28px"
          px={2}
          spacing={2}
          bg={colorMode === "dark" ? "#000000" : "#FFFFFF"}
          borderRadius="8px"
          border="1px solid"
          borderColor={
            colorMode === "dark" ? "#2D3748" : "#E5E7EB"
          }
          color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
          justifyContent="center"
          transition=".25s"
          _hover={{
            borderColor: "#94A3B8",
            boxShadow: "0 8px 18px rgba(15,23,42,.08)",
          }}
        >
          <Text
            color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
            fontWeight="600"
            fontSize="11px"
          >
            {row.original.dcCurrentB1}
          </Text>
          <TrendArrow trend={row.original.dcCurrentB1Trend} />
        </HStack>
      ),
    },

    {
      accessorKey: "reactivePower",
      header: "Power kVAR",
      size: 120,
      Cell: ({ row }) => (
        <HStack
          key={`${colorMode}-${row.original.deviceId}-reactivePower`}
          w="92px"
          h="28px"
          px={2}
          spacing={2}
          bg={colorMode === "dark" ? "#000000" : "#FFFFFF"}
          borderRadius="8px"
          border="1px solid"
          borderColor={
            colorMode === "dark" ? "#2D3748" : "#E5E7EB"
          }
          color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
          justifyContent="space-between"
          transition=".25s"
          _hover={{
            borderColor: "#94A3B8",
            boxShadow: "0 8px 18px rgba(15,23,42,.08)",
          }}
        >
          <Text
            color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
            fontWeight="600"
            fontSize="11px"
          >
            {row.original.reactivePower}
          </Text>
          <TrendArrow trend={row.original.reactivePowerTrend} />
        </HStack>
      ),
    },

    {
      accessorKey: "dcCurrentB2",
      header: "SoC (%)",
      size: 120,
      Cell: ({ row }) => (
        <HStack
          key={`${colorMode}-${row.original.deviceId}-dcCurrentB2`}
          w="100%"
          minW="92px"
          h="28px"
          px={2}
          spacing={2}
          bg={colorMode === "dark" ? "#000000" : "#FFFFFF"}
          borderRadius="8px"
          border="1px solid"
          borderColor={
            colorMode === "dark" ? "#2D3748" : "#E5E7EB"
          }
          color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
          justifyContent="center"
          transition=".25s"
          _hover={{
            borderColor: "#94A3B8",
            boxShadow: "0 8px 18px rgba(15,23,42,.08)",
          }}
        >
          <Text
            color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
            fontWeight="600"
            fontSize="11px"
          >
            {row.original.dcCurrentB2}
          </Text>
          <TrendArrow trend={row.original.dcCurrentB2Trend} />
        </HStack>
      ),
    },

    {
      accessorKey: "dcVoltB1",
      header: "Voltage (V)",
      size: 120,
      Cell: ({ row }) => (
        <HStack
          key={`${colorMode}-${row.original.deviceId}-dcVoltB1`}
          w="92px"
          h="28px"
          px={2}
          spacing={2}
          bg={colorMode === "dark" ? "#000000" : "#FFFFFF"}
          borderRadius="8px"
          border="1px solid"
          borderColor={
            colorMode === "dark" ? "#2D3748" : "#E5E7EB"
          }
          color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
          justifyContent="space-between"
          transition=".25s"
          _hover={{
            borderColor: "#94A3B8",
            boxShadow: "0 8px 18px rgba(15,23,42,.08)",
          }}
        >
          <Text
            color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
            fontWeight="600"
            fontSize="11px"
          >
            {row.original.dcVoltB1}
          </Text>
          <TrendArrow trend={row.original.dcVoltB1Trend} />
        </HStack>
      ),
    },

    {
      accessorKey: "dcVoltB2",
      header: "SoH (%)",
      size: 120,
      Cell: ({ row }) => (
        <HStack
          key={`${colorMode}-${row.original.deviceId}-dcVoltB2`}
          w="92px"
          h="28px"
          px={2}
          spacing={2}
          bg={colorMode === "dark" ? "#000000" : "#FFFFFF"}
          borderRadius="8px"
          border="1px solid"
          borderColor={
            colorMode === "dark" ? "#2D3748" : "#E5E7EB"
          }
          color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
          justifyContent="space-between"
          transition=".25s"
          _hover={{
            borderColor: "#94A3B8",
            boxShadow: "0 8px 18px rgba(15,23,42,.08)",
          }}
        >
          <Text
            color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
            fontWeight="600"
            fontSize="11px"
          >
            {row.original.dcVoltB2}
          </Text>
          <TrendArrow trend={row.original.dcVoltB2Trend} />
        </HStack>
      ),
    },

    {
      accessorKey: "dcVoltB3",
      header: "Temperature (°C)",
      size: 120,
      Cell: ({ row }) => (
        <HStack
          key={`${colorMode}-${row.original.deviceId}-dcVoltB3`}
          w="92px"
          h="28px"
          px={2}
          spacing={2}
          bg={colorMode === "dark" ? "#000000" : "#FFFFFF"}
          borderRadius="8px"
          border="1px solid"
          borderColor={
            colorMode === "dark" ? "#2D3748" : "#E5E7EB"
          }
          color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
          justifyContent="space-between"
          transition=".25s"
          _hover={{
            borderColor: "#94A3B8",
            boxShadow: "0 8px 18px rgba(15,23,42,.08)",
          }}
        >
          <Text
            color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
            fontWeight="600"
            fontSize="11px"
          >
            {row.original.dcVoltB3}
          </Text>
          <TrendArrow trend={row.original.dcVoltB3Trend} />
        </HStack>
      ),
    },

    {
      accessorKey: "dcVoltTotal",
      header: "DoD (%)",
      size: 120,
      Cell: ({ row }) => (
        <HStack
          key={`${colorMode}-${row.original.deviceId}-dcVoltTotal`}
          w="92px"
          h="28px"
          px={2}
          spacing={2}
          bg={colorMode === "dark" ? "#000000" : "#FFFFFF"}
          borderRadius="8px"
          border="1px solid"
          borderColor={
            colorMode === "dark" ? "#2D3748" : "#E5E7EB"
          }
          color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
          justifyContent="space-between"
          transition=".25s"
          _hover={{
            borderColor: "#94A3B8",
            boxShadow: "0 8px 18px rgba(15,23,42,.08)",
          }}
        >
          <Text
            color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
            fontWeight="600"
            fontSize="11px"
          >
            {row.original.dcVoltTotal}
          </Text>
          <TrendArrow trend={row.original.dcVoltTotalTrend} />
        </HStack>
      ),
    },

    {
      accessorKey: "acCurrentL1",
      header: "Charge Energy (kWh)",
      size: 120,
      Cell: ({ row }) => (
        <HStack
          key={`${colorMode}-${row.original.deviceId}-acCurrentL1`}
          w="92px"
          h="28px"
          px={2}
          spacing={2}
          bg={colorMode === "dark" ? "#000000" : "#FFFFFF"}
          borderRadius="8px"
          border="1px solid"
          borderColor={
            colorMode === "dark" ? "#2D3748" : "#E5E7EB"
          }
          color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
          justifyContent="space-between"
          transition=".25s"
          _hover={{
            borderColor: "#94A3B8",
            boxShadow: "0 8px 18px rgba(15,23,42,.08)",
          }}
        >
          <Text
            color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
            fontWeight="600"
            fontSize="11px"
          >
            {row.original.acCurrentL1}
          </Text>
          <TrendArrow trend={row.original.acCurrentL1Trend} />
        </HStack>
      ),
    },

    {
      accessorKey: "acCurrentL2",
      header: "Discharge Energy (kWh)",
      size: 120,
      Cell: ({ row }) => (
        <HStack
          key={`${colorMode}-${row.original.deviceId}-acCurrentL2`}
          w="92px"
          h="28px"
          px={2}
          spacing={2}
          bg={colorMode === "dark" ? "#000000" : "#FFFFFF"}
          borderRadius="8px"
          border="1px solid"
          borderColor={
            colorMode === "dark" ? "#2D3748" : "#E5E7EB"
          }
          color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
          justifyContent="space-between"
          transition=".25s"
          _hover={{
            borderColor: "#94A3B8",
            boxShadow: "0 8px 18px rgba(15,23,42,.08)",
          }}
        >
          <Text
            color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
            fontWeight="600"
            fontSize="11px"
          >
            {row.original.acCurrentL2}
          </Text>
          <TrendArrow trend={row.original.acCurrentL2Trend} />
        </HStack>
      ),
    },

    {
      accessorKey: "acCurrentL3",
      header: "Control State",
      size: 120,
      Cell: ({ row }) => (
        <HStack
          key={`${colorMode}-${row.original.deviceId}-acCurrentL3`}
          w="92px"
          h="28px"
          px={2}
          spacing={2}
          bg={colorMode === "dark" ? "#000000" : "#FFFFFF"}
          borderRadius="8px"
          border="1px solid"
          borderColor={
            colorMode === "dark" ? "#2D3748" : "#E5E7EB"
          }
          color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
          justifyContent="space-between"
          transition=".25s"
          _hover={{
            borderColor: "#94A3B8",
            boxShadow: "0 8px 18px rgba(15,23,42,.08)",
          }}
        >
          <Text
            color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
            fontWeight="600"
            fontSize="11px"
          >
            {row.original.acCurrentL3}
          </Text>
          <TrendArrow trend={row.original.acCurrentL3Trend} />
        </HStack>
      ),
    },

    {
      accessorKey: "gridFrequency",
      header: "Frequency (Hz)",
      size: 120,
      Cell: ({ row }) => (
        <HStack
          key={`${colorMode}-${row.original.deviceId}-gridFrequency`}
          w="92px"
          h="28px"
          px={2}
          spacing={2}
          bg={colorMode === "dark" ? "#000000" : "#FFFFFF"}
          borderRadius="8px"
          border="1px solid"
          borderColor={
            colorMode === "dark" ? "#2D3748" : "#E5E7EB"
          }
          color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
          justifyContent="space-between"
          transition=".25s"
          _hover={{
            borderColor: "#94A3B8",
            boxShadow: "0 8px 18px rgba(15,23,42,.08)",
          }}
        >
          <Text
            color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
            fontWeight="600"
            fontSize="11px"
          >
            {row.original.gridFrequency}
          </Text>
          <TrendArrow trend={row.original.gridFrequencyTrend} />
        </HStack>
      ),
    },

  ],
  [navigate, isShortScreen, colorMode]
);

const columns = useMemo(() => {
  return isFullscreen
    ? allColumns      // Fullscreen -> all columns
    : allColumns.slice(0, 7); // Normal -> only 5 columns
}, [allColumns, isFullscreen, colorMode]);

return (
  <Box
    ref={panelRef}
    w="840px"
    h="300px"
    bg={bodyBg}
    borderRadius="0px"
    overflow="hidden"
    border="1px solid"
    borderColor={useColorModeValue("gray.200", "whiteAlpha.200")}
    display="flex"
    flexDirection="column"
  >
    <HStack
      justify="space-between"
      px={3}
      py={0.5}
      bg={useColorModeValue("#FFFFFF", "#000000")}
      borderBottom="1px solid"
      borderColor={useColorModeValue("#EEF2F7", "whiteAlpha.100")}
    >
      <HStack spacing={2} alignItems="center">
        

        <Box lineHeight="1">
          <Text
            fontSize="13px"
            fontWeight="700"
            color={useColorModeValue("#0F172A", "#FFFFFF")}
          >
            PCS Overview
          </Text>

          <Text
            fontSize="13px"
            color="gray.500"
          >
            {/* Real-time status and performance overview */}
          </Text>
        </Box>
      </HStack>

      <HStack spacing={2} alignItems="center">
        <Box
          px={2}
          py={1}
          bg="#F4F8FF"
          borderRadius="12px"
          border="1px solid #E5EEFF"
        >
          <Text
            fontWeight="500"
            fontSize="11px"
          >
            Total PCS :
            <Text
              as="span"
              color="#2563EB"
              fontWeight="700"
              ml={1}
              fontSize="11px"
            >
              {rows.length}
            </Text>
          </Text>
        </Box>

        <IconButton
          aria-label="Toggle fullscreen"
          icon={isFullscreen ? <SqeezIcon /> : <ExpandIcon />}
          onClick={toggleFullscreen}
          variant="ghost"
          size="sm"
        />
      </HStack>
    </HStack>

    <Box
      flex="1"
      px={1}
      pt={2}
      pb={0}
      bg={bodyBg}
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <ThemeProvider theme={theme}>
        <MaterialReactTable
          key={colorMode}
          columns={columns}
          data={sortedRows}

          enableTopToolbar={false}
          enableBottomToolbar={true}

          enableColumnActions={false}
          enableColumnFilters={false}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          enableHiding={false}
          enableSorting={false}
          enablePagination={true}

          state={{ pagination }}
          onPaginationChange={setPagination}
          manualPagination={false}
          rowCount={sortedRows.length}

          layoutMode={isShortScreen ? "grid-no-grow" : "semantic"}
          defaultColumn={{
            grow: false,
          }}

          initialState={{
            density: "compact",
            pagination: {
              pageIndex: 0,
              pageSize: 15,
            },
          }}

          muiTablePaperProps={{
            sx: {
              position: "relative",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transformStyle: "preserve-3d",
              boxShadow: useColorModeValue("0 28px 80px rgba(15, 23, 42, 0.18)", "0 32px 90px rgba(0, 0, 0, 0.45)"),
              background: useColorModeValue("linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)", "linear-gradient(180deg, #111827 0%, #111827 100%)"),
              borderRadius: "0px",
              overflow: "hidden",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle at top center, rgba(255,255,255,0.18), transparent 28%), radial-gradient(circle at bottom right, rgba(59,130,246,0.16), transparent 24%)",
                opacity: 0.8,
                pointerEvents: "none",
                animation: "pulseGlow 6s ease-in-out infinite",
              },
              "@keyframes pulseGlow": {
                "0%, 100%": {
                  opacity: 0.7,
                },
                "50%": {
                  opacity: 0.95,
                },
              },
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: useColorModeValue("0 34px 100px rgba(15, 23, 42, 0.22)", "0 38px 110px rgba(0, 0, 0, 0.55)"),
              },
            },
          }}

          muiTableContainerProps={{
            sx: {
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: isFullscreen ? "auto" : "hidden",
              perspective: "1600px",
              transformStyle: "preserve-3d",
              "& .MuiTableHead-root": {
                background: useColorModeValue("#FFFFFF", "#000000"),
                position: "sticky",
                top: 0,
                zIndex: 2,
                transform: "translateZ(6px)",
                boxShadow: "0 10px 32px rgba(15,23,42,0.08)",
                "& .MuiTableCell-root": {
                  fontWeight: 700,
                  fontSize: "14px",
                  color: useColorModeValue("#000000", "#FFFFFF"),
                  borderBottom: "none",
                  background: useColorModeValue("#FFFFFF", "#000000"),
                },
              },
              "& .MuiTableBody-root .MuiTableRow-root": {
                background: useColorModeValue("#FFFFFF", "#000000"),
                borderRadius: "18px",
                boxShadow: "0 10px 24px rgba(15,23,42,.08)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease",
                minHeight: "30px",
                height: "auto",
                transform: "translateZ(0)",
              },
              "& .MuiTableBody-root .MuiTableRow-root:hover": {
                transform: "translateY(-6px) translateZ(10px)",
                boxShadow: "0 18px 42px rgba(15,23,42,.18)",
              },
              "& .MuiTableCell-root": {
                transition: "transform 0.3s ease, background 0.3s ease, color 0.3s ease",
              },
            },
          }}

          muiTableProps={{
            sx: {
              tableLayout: isShortScreen ? "auto" : "fixed",
              width: "100%",
              minWidth: "100%",
              borderSpacing: "0",
              borderCollapse: "collapse",
              "& .MuiTableCell-root": {
                padding: "4px 8px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              },
            },
          }}

          muiTableHeadCellProps={({ column }) => ({
            align: "center",
            sx: {
              px: column.id === "status" ? "0px" : "4px",
              py: 0,

              ...(column.id === "status" && {
                transform: "translateX(-2px)",
              }),

              ...(column.id === "name" && {
                pr: "2px",
              }),

              "& .Mui-TableHeadCell-Content": {
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                overflow: "visible",
                whiteSpace: "nowrap",
              },

              "& .MuiTableCell-root": {
                padding: "4px 8px",
                minWidth: 0,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              },

              ...(column.id === "status" && {
                overflow: "visible",
                textOverflow: "unset",
              }),
            },
          })}

          muiTableBodyCellProps={({ column }) => ({
            align: "center",
            sx: {
              px: column.id === "status" ? "0px" : "4px",
              py: 0,

              ...(column.id === "status" && {
                transform: "translateX(-2px)",
              }),

              ...(column.id === "name" && {
                pr: "2px",
              }),

              "& .MuiTableCell-root": {
                textAlign: "center",
                padding: "4px 8px",
                minWidth: 0,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              },

              "& .MuiTypography-root": {
                width: "100%",
                textAlign: "center",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              },
            },
          })}

          muiBottomToolbarProps={{
            sx: {
              minHeight: "42px",
              marginTop: "auto",
              borderTop: "1px solid rgba(255,255,255,0.08)",

              "& .MuiTablePagination-root": {
                minHeight: "42px",
              },

              "& .MuiTablePagination-toolbar": {
                minHeight: "42px",
                padding: "0 8px",
              },
            },
          }}

          muiPaginationProps={{
            showFirstButton: false,
            showLastButton: false,
            showRowsPerPage: false,
          }}
        />
      </ThemeProvider>
    </Box>
  </Box>
);
}
