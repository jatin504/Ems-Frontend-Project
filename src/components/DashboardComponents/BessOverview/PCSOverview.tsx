import { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
  Button,
  HStack,
} from "@chakra-ui/react";

import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { MdElectricBolt, MdLinkOff } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import WidgetTitle from "../../Common/WidgetTitle";

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

  acVoltL1L2: string;
  acVoltL1L2_raw: number;

  acVoltL2L3: string;
  acVoltL2L3_raw: number;

  acVoltL3L1: string;
  acVoltL3L1_raw: number;

  gridFrequency: string;
  gridFrequency_raw: number;

  pf: string;
  pf_raw: number;

  apparentPower: string;
  apparentPower_raw: number;

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
  acVoltL1L2Trend: TrendType;
  acVoltL2L3Trend: TrendType;
  acVoltL3L1Trend: TrendType;
  gridFrequencyTrend: TrendType;
  pfTrend: TrendType;
  apparentPowerTrend: TrendType;

  isLive: boolean;
  rawData?: any;
}

/* ================= COMPONENT ================= */

export default function PCSOverview() {
  const navigate = useNavigate();

  const { colorMode } = useColorMode();
  const bodyBg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("#FFFFFF", "#000000");
  const cardBorder = useColorModeValue("#E5E7EB", "#2D3748");
  const cardText = useColorModeValue("#111827", "#FFFFFF");
  const headerBg = useColorModeValue("#F8FAFC", "#000000");
  const rowBg = useColorModeValue("#FFFFFF", "#111111");

  const totalBoxBg = useColorModeValue(
    "#F4F8FF",
    "rgba(255,255,255,0.08)"
  );
  const totalBoxBorder = useColorModeValue(
    "1px solid #E5EEFF",
    "1px solid rgba(255,255,255,0.12)"
  );
  const totalBoxText = useColorModeValue("#0F172A", "#F8FAFC");

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
        dcCurrentB3: number;
        dcCurrentTotal: number;
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

      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
        pageSize: 15,
      }));
    } else {
      document.exitFullscreen();

      setIsFullscreen(false);

      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
        pageSize: 15,
      }));
    }
  };

  useEffect(() => {
    const fn = () => {
      const fs = !!document.fullscreenElement;

      setIsFullscreen(fs);

      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
        pageSize: fs ? 15 : 15,
      }));
    };

    document.addEventListener("fullscreenchange", fn);

    return () =>
      document.removeEventListener(
        "fullscreenchange",
        fn
      );
  }, []);
    /* ---------- backend key map ---------- */

  const COLUMN_KEY_MAP: Record<string, string> = {
    Active_Power: "Active_power",
    Reactive_Power: "Reactive_power",

    DC_Current_B1: "Active_power",
    DC_Current_B2: "DCDC1_Battery_side_current",
    DC_Current_B3: "DCDC1_Bus_side_current",
    DC_Current_Total: "DCDC1_Bus_side_current",

    DC_Volt_B1: "DCDC1_Battery_side_voltage",
    DC_Volt_B2: "Container_status_1",
    DC_Volt_B3: "Container_status_2",
    DC_Volt_Total: "Chargeable_capacity",

    AC_Current_L1: "Alarm_1",
    AC_Current_L2: "Alarm_2",
    AC_Current_L3: "Alarm_3",

    AC_Volt_L1L2: "Control_unit_cabin_temperature_1",
    AC_Volt_L2L3: "Control_unit_cabin_humidity_1",
    AC_Volt_L3L1: "Control_unit_cabin_dew_point_temperature",

    Apparent_Power: "BCU_1_Chargeable_capacity",
    PF: "BCU_1_DOD",

    Grid_Frequency: "DCDC1_ISO_insulation_resistance",

    mode: "Operating_Mode",
    temp: "Temperature",
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
            device_id_patterns: ["_bank_bank_"],
          }),
        }
      )
        .then((r) => r.json())
        .then((j) => {
          if (j.success) {
            const filteredData = Object.fromEntries(
              Object.entries(j.data || {}).filter(
                ([deviceId]) => /_bank_bank_\d+$/.test(deviceId)
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

      const acVoltL1L2Trend = getTrend(
        toNum("AC_Volt_L1L2"),
        prev?.acVoltL1L2
      );

      const acVoltL2L3Trend = getTrend(
        toNum("AC_Volt_L2L3"),
        prev?.acVoltL2L3
      );

      const acVoltL3L1Trend = getTrend(
        toNum("AC_Volt_L3L1"),
        prev?.acVoltL3L1
      );

      const gridFrequencyTrend = getTrend(
        toNum("Grid_Frequency"),
        prev?.gridFrequency
      );

      const pfTrend = getTrend(
        toNum("PF"),
        prev?.pf
      );

      const apparentPowerTrend = getTrend(
        toNum("Apparent_Power"),
        prev?.apparentPower
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

        dcCurrentB1: toDisplay("DC_Current_B1"),
        dcCurrentB1_raw: toNum("DC_Current_B1"),
        dcCurrentB1Trend,

        dcCurrentB2: toDisplay("DC_Current_B2"),
        dcCurrentB2_raw: toNum("DC_Current_B2"),
        dcCurrentB2Trend,

        dcVoltB1: toDisplay("DC_Volt_B1"),
        dcVoltB1_raw: toNum("DC_Volt_B1"),
        dcVoltB1Trend,

        dcVoltB2: toDisplay("DC_Volt_B2"),
        dcVoltB2_raw: toNum("DC_Volt_B2"),
        dcVoltB2Trend,

        dcVoltB3: toDisplay("DC_Volt_B3"),
        dcVoltB3_raw: toNum("DC_Volt_B3"),
        dcVoltB3Trend,

        dcVoltTotal: toDisplay("DC_Volt_Total"),
        dcVoltTotal_raw: toNum("DC_Volt_Total"),
        dcVoltTotalTrend,

        acCurrentL1: toDisplay("AC_Current_L1"),
        acCurrentL1_raw: toNum("AC_Current_L1"),
        acCurrentL1Trend,

        acCurrentL2: toDisplay("AC_Current_L2"),
        acCurrentL2_raw: toNum("AC_Current_L2"),
        acCurrentL2Trend,

        acCurrentL3: toDisplay("AC_Current_L3"),
        acCurrentL3_raw: toNum("AC_Current_L3"),
        acCurrentL3Trend,

        acVoltL1L2: toDisplay("AC_Volt_L1L2"),
        acVoltL1L2_raw: toNum("AC_Volt_L1L2"),
        acVoltL1L2Trend,

        acVoltL2L3: toDisplay("AC_Volt_L2L3"),
        acVoltL2L3_raw: toNum("AC_Volt_L2L3"),
        acVoltL2L3Trend,

        acVoltL3L1: toDisplay("AC_Volt_L3L1"),
        acVoltL3L1_raw: toNum("AC_Volt_L3L1"),
        acVoltL3L1Trend,

        gridFrequency: toDisplay("Grid_Frequency"),
        gridFrequency_raw: toNum("Grid_Frequency"),
        gridFrequencyTrend,

        pf: toDisplay("PF"),
        pf_raw: toNum("PF"),
        pfTrend,

        apparentPower: toDisplay("Apparent_Power"),
        apparentPower_raw: toNum("Apparent_Power"),
        apparentPowerTrend,

        isLive,
        rawData: d,
      });

      previousValues.current[deviceId] = {
        reactivePower: toNum("Reactive_Power"),
        activePower: toNum("Active_Power"),
        dcCurrentB1: toNum("DC_Current_B1"),
        dcCurrentB2: toNum("DC_Current_B2"),
        dcCurrentB3: toNum("DC_Current_B3"),
        dcCurrentTotal: toNum("DC_Current_Total"),
        dcVoltB1: toNum("DC_Volt_B1"),
        dcVoltB2: toNum("DC_Volt_B2"),
        dcVoltB3: toNum("DC_Volt_B3"),
        dcVoltTotal: toNum("DC_Volt_Total"),
        acCurrentL1: toNum("AC_Current_L1"),
        acCurrentL2: toNum("AC_Current_L2"),
        acCurrentL3: toNum("AC_Current_L3"),
        acVoltL1L2: toNum("AC_Volt_L1L2"),
        acVoltL2L3: toNum("AC_Volt_L2L3"),
        acVoltL3L1: toNum("AC_Volt_L3L1"),
        gridFrequency: toNum("Grid_Frequency"),
        pf: toNum("PF"),
        apparentPower: toNum("Apparent_Power"),
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

  const renderValueCard = (value: string, trend: TrendType) => (
    <HStack
      key={`${colorMode}-${value}`}
      w="92px"
      h="28px"
      px={2}
      spacing={2}
      bg={cardBg}
      borderRadius="8px"
      border={`1px solid ${cardBorder}`}
      justifyContent="space-between"
      transition=".25s"
      _hover={{
        borderColor: "#94A3B8",
        boxShadow: "0 8px 18px rgba(15,23,42,.08)",
      }}
    >
      <Text fontWeight="600" fontSize="11px" color={cardText}>
        {value}
      </Text>

      <TrendArrow trend={trend} />
    </HStack>
  );

  const allColumns = useMemo<MRT_ColumnDef<PCSData>[]>(
  () => [
    {
      accessorKey: "name",
      header: "PCS",
      size: 110,
      muiTableHeadCellProps: {
        sx: {
          textAlign: "left",
          pl: 1,
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
      size: 110,
      enableSorting: false,
      Cell: ({ row }) => {
        const d = row.original.rawData;

        const lastTs = d?.Time_Stamp?.value
          ? new Date(d.Time_Stamp.value).getTime()
          : 0;

        const activePower =
          d?.Active_Power?.value ??
          d?.Active_power?.value ??
          0;

        const now = Date.now();

        if (!lastTs || now - lastTs > 4 * 60 * 1000) {
          return (
            <Box w="100%" h="100%" display="flex" justifyContent="center" alignItems="center">
              <Tooltip
                label="Non-Comm"
                placement="top"
                hasArrow
                openDelay={150}
                borderRadius="10px"
                bg="#0F172A"
                color="white"
                fontSize="11px"
                fontWeight="600"
                px={3}
                py={2}
                boxShadow="0 18px 45px rgba(15,23,42,.35)"
                border="1px solid rgba(255,255,255,.08)"
                arrowShadowColor="rgba(0,0,0,.35)"
                motionProps={{
                  initial: { opacity: 0, y: 8, scale: 0.9 },
                  animate: { opacity: 1, y: 0, scale: 1 },
                }}
              >
                <Box
                  w="24px"
                  h="24px"
                  borderRadius="full"
                  bg="#FFF7E6"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                >
                  <MdLinkOff color="orange" size={12} />
                </Box>
              </Tooltip>
            </Box>
          );
        }

        if (activePower > 0) {
          return (
            <Box w="100%" h="100%" display="flex" justifyContent="center" alignItems="center">
              <Tooltip
                label="Running"
                placement="top"
                hasArrow
                openDelay={150}
                borderRadius="10px"
                bg="#0F172A"
                color="white"
                fontSize="11px"
                fontWeight="600"
                px={3}
                py={2}
                boxShadow="0 18px 45px rgba(15,23,42,.35)"
                border="1px solid rgba(255,255,255,.08)"
                arrowShadowColor="rgba(0,0,0,.35)"
                motionProps={{
                  initial: { opacity: 0, y: 8, scale: 0.9 },
                  animate: { opacity: 1, y: 0, scale: 1 },
                }}
              >
                <Box
                  w="24px"
                  h="24px"
                  borderRadius="full"
                  bg="#EAFBF0"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                >
                  <MdElectricBolt color="#16A34A" size={13} />
                </Box>
              </Tooltip>
            </Box>
          );
        }

        return (
          <Box w="100%" h="100%" display="flex" justifyContent="center" alignItems="center">
            <Tooltip
              label="Stop"
              placement="top"
              hasArrow
              openDelay={150}
              borderRadius="10px"
              bg="#0F172A"
              color="white"
              fontSize="11px"
              fontWeight="600"
              px={3}
              py={2}
              boxShadow="0 18px 45px rgba(15,23,42,.35)"
              border="1px solid rgba(255,255,255,.08)"
              arrowShadowColor="rgba(0,0,0,.35)"
              motionProps={{
                initial: { opacity: 0, y: 8, scale: 0.9 },
                animate: { opacity: 1, y: 0, scale: 1 },
              }}
            >
              <Box
                w="24px"
                h="24px"
                borderRadius="full"
                bg="#FDECEC"
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
              >
                <MdElectricBolt color="red" size={13} />
              </Box>
            </Tooltip>
          </Box>
        );
      },
    },

    {
      accessorKey: "activePower",
      header: "Active Power",
      size: 120,
      Cell: ({ row }) =>
        renderValueCard(
          row.original.activePower,
          row.original.activePowerTrend
        ),
    },

    {
      accessorKey: "dcCurrentB1",
      header: "DC Current B1",
      size: 120,
      Cell: ({ row }) =>
        renderValueCard(
          row.original.dcCurrentB1,
          row.original.dcCurrentB1Trend
        ),
    },

    {
      accessorKey: "dcCurrentB2",
      header: "DC Current B2",
      size: 120,
      Cell: ({ row }) =>
        renderValueCard(
          row.original.dcCurrentB2,
          row.original.dcCurrentB2Trend
        ),
    },

    {
      accessorKey: "dcVoltB1",
      header: "DC Volt B1",
      size: 120,
      Cell: ({ row }) =>
        renderValueCard(
          row.original.dcVoltB1,
          row.original.dcVoltB1Trend
        ),
    },

    {
      accessorKey: "reactivePower",
      header: "Reactive Power",
      size: 120,
      Cell: ({ row }) =>
        renderValueCard(
          row.original.reactivePower,
          row.original.reactivePowerTrend
        ),
    },

    {
      accessorKey: "dcVoltB2",
      header: "DC Volt B2",
      size: 120,
      Cell: ({ row }) =>
        renderValueCard(
          row.original.dcVoltB2,
          row.original.dcVoltB2Trend
        ),
    },

    {
      accessorKey: "dcVoltB3",
      header: "DC Volt B3",
      size: 120,
      Cell: ({ row }) =>
        renderValueCard(
          row.original.dcVoltB3,
          row.original.dcVoltB3Trend
        ),
    },

    {
      accessorKey: "dcVoltTotal",
      header: "DC Volt Total",
      size: 120,
      Cell: ({ row }) =>
        renderValueCard(
          row.original.dcVoltTotal,
          row.original.dcVoltTotalTrend
        ),
    },

    {
      accessorKey: "acCurrentL1",
      header: "AC Current L1",
      size: 120,
      Cell: ({ row }) =>
        renderValueCard(
          row.original.acCurrentL1,
          row.original.acCurrentL1Trend
        ),
    },

    {
      accessorKey: "acCurrentL2",
      header: "AC Current L2",
      size: 120,
      Cell: ({ row }) =>
        renderValueCard(
          row.original.acCurrentL2,
          row.original.acCurrentL2Trend
        ),
    },

    {
      accessorKey: "acCurrentL3",
      header: "AC Current L3",
      size: 120,
      Cell: ({ row }) =>
        renderValueCard(
          row.original.acCurrentL3,
          row.original.acCurrentL3Trend
        ),
    },

    {
      accessorKey: "acVoltL1L2",
      header: "AC Volt L1L2",
      size: 120,
      Cell: ({ row }) =>
        renderValueCard(
          row.original.acVoltL1L2,
          row.original.acVoltL1L2Trend
        ),
    },

    {
      accessorKey: "acVoltL2L3",
      header: "AC Volt L2L3",
      size: 120,
      Cell: ({ row }) =>
        renderValueCard(
          row.original.acVoltL2L3,
          row.original.acVoltL2L3Trend
        ),
    },

    {
      accessorKey: "acVoltL3L1",
      header: "AC Volt L3L1",
      size: 120,
      Cell: ({ row }) =>
        renderValueCard(
          row.original.acVoltL3L1,
          row.original.acVoltL3L1Trend
        ),
    },

    {
      accessorKey: "gridFrequency",
      header: "Grid Frequency",
      size: 120,
      Cell: ({ row }) => (
        <HStack
          w="92px"
          h="28px"
          px={2}
          spacing={2}
          bg={cardBg}
          borderRadius="8px"
          border={`1px solid ${cardBorder}`}
          justifyContent="space-between"
          transition=".25s"
          _hover={{
            borderColor: "#94A3B8",
            boxShadow: "0 8px 18px rgba(15,23,42,.08)",
          }}
        >
          <Text
            fontWeight="600"
            fontSize="11px"
            color={cardText}
          >
            {row.original.gridFrequency}
          </Text>
          <TrendArrow trend={row.original.gridFrequencyTrend} />
        </HStack>
      ),
    },

    {
      accessorKey: "pf",
      header: "PF",
      size: 100,
      Cell: ({ row }) =>
        renderValueCard(row.original.pf, row.original.pfTrend),
    },

    {
      accessorKey: "apparentPower",
      header: "Apparent Power",
      size: 120,
      Cell: ({ row }) =>
        renderValueCard(
          row.original.apparentPower,
          row.original.apparentPowerTrend
        ),
    },

  ],
  [navigate, colorMode]
);

const columns = useMemo(() => {
  return isFullscreen
    ? allColumns      // Fullscreen -> all columns
    : allColumns.slice(0, 5); // Normal -> only 5 columns
}, [allColumns, isFullscreen, colorMode]);

return (
  <Box
    ref={panelRef}
    w="100%"
    h="300px"
    bg={bodyBg}
    borderRadius="12px"
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
      bg={cardBg}
      borderBottom="1px solid"
      borderColor={useColorModeValue("#EEF2F7", "whiteAlpha.100")}
    >
      <HStack spacing={2} alignItems="center">
        

        <Box lineHeight="1">
          <WidgetTitle color={cardText}>PCS Overview</WidgetTitle>

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
          bg={totalBoxBg}
          borderRadius="12px"
          border={totalBoxBorder}
        >
          <Text fontWeight="500" fontSize="11px" color={totalBoxText}>
            Total PCS :
            <Text
              as="span"
              color={totalBoxText}
              fontWeight="700"
              ml={1}
              fontSize="11px"
            >
              {rows.length}
            </Text>
          </Text>
        </Box>

        <Button
          size="xs"
          variant="ghost"
          onClick={toggleFullscreen}
        >
          ⤢
        </Button>
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

          layoutMode="semantic"

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
              borderRadius: "18px",
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
                background: headerBg,
                position: "sticky",
                top: 0,
                zIndex: 2,
                transform: "translateZ(6px)",
                boxShadow: "0 10px 32px rgba(15,23,42,0.08)",
                "& .MuiTableCell-root": {
                  fontWeight: 700,
                  fontSize: "14px",
                  color: cardText,
                  borderBottom: "none",
                  background: headerBg,
                },
              },
              "& .MuiTableBody-root .MuiTableRow-root": {
                background: rowBg,
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
              tableLayout: isFullscreen ? "auto" : "fixed",
              width: isFullscreen ? "max-content" : "100%",
              minWidth: isFullscreen ? "max-content" : "100%",
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

          muiTableHeadCellProps={{
            align: "center",
            sx: {
              px: 0,
              py: 0,
              textAlign: "center",

              "& .Mui-TableHeadCell-Content": {
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              },

              "& .MuiTableCell-root": {
                padding: "4px 8px",
                minWidth: 0,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              },
            },
          }}

          muiTableBodyCellProps={{
            align: "center",
            sx: {
              px: 0,
              py: 0,
              textAlign: "center",

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
          }}

          muiBottomToolbarProps={{
            sx: {
              minHeight: "34px",
              marginTop: "auto",
              background: cardBg,
              color: cardText,
              borderTop: `1px solid ${cardBorder}`,

              "& .MuiTablePagination-root": {
                minHeight: "34px",
                color: cardText,
              },

              "& .MuiTablePagination-toolbar": {
                minHeight: "34px",
                padding: "0 6px",
              },
              "& .MuiTablePagination-selectRoot": {
                display: "none",
              },
              "& .MuiTablePagination-selectLabel": {
                display: "none",
              },
              "& .MuiTablePagination-spacer": {
                display: "none",
              },
              "& .MuiTablePagination-displayedRows": {
                display: "none",
              },
              "& .MuiSvgIcon-root": {
                color: cardText,
              },
              "& .MuiIconButton-root": {
                color: cardText,
                padding: "2px",
              },
              "& .MuiSelect-select": {
                color: cardText,
              },
            },
          }}

          muiPaginationProps={{
            rowsPerPageOptions: [15, 25, 50],
            showRowsPerPage: false,
            showFirstButton: true,
            showLastButton: true,
          }}
        />
      </ThemeProvider>
    </Box>
  </Box>
);
}
