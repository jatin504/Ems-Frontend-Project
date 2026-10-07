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
import { ExpandIcon, SqeezIcon } from "../../../assets/Icons";
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

  activePower: string;
  activePower_raw: number;
  reactivePower: string;
  reactivePower_raw: number;
  current: string;
  current_raw: number;
  voltage: string;
  voltage_raw: number;
  frequency: string;
  frequency_raw: number;
  soc: string;
  soc_raw: number;
  soh: string;
  soh_raw: number;
  chargeEnergy: string;
  chargeEnergy_raw: number;
  dischargeEnergy: string;
  dischargeEnergy_raw: number;
  dod: string;
  dod_raw: number;
  temperature: string;
  temperature_raw: number;
  controlState: string;
  controlState_raw: number;

  activePowerTrend: TrendType;
  reactivePowerTrend: TrendType;
  currentTrend: TrendType;
  voltageTrend: TrendType;
  frequencyTrend: TrendType;
  socTrend: TrendType;
  sohTrend: TrendType;
  chargeEnergyTrend: TrendType;
  dischargeEnergyTrend: TrendType;
  dodTrend: TrendType;
  temperatureTrend: TrendType;
  controlStateTrend: TrendType;

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
        activePower: number;
        reactivePower: number;
        current: number;
        voltage: number;
        frequency: number;
        soc: number;
        soh: number;
        chargeEnergy: number;
        dischargeEnergy: number;
        dod: number;
        temperature: number;
        controlState: number;
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
          Number.isNaN(Number(value))
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
      const ts = tsValue ? new Date(tsValue).getTime() : 0;
      const isLive = !!ts && now - ts < 10 * 60 * 1000;
      const prev = previousValues.current[deviceId];

      const activePowerValue = toNum("Active_Power");
      const reactivePowerValue = toNum("Reactive_Power");
      const currentValue = toNum("Current");
      const voltageValue = toNum("Voltage");
      const frequencyValue = toNum("Frequency");
      const socValue = toNum("SoC");
      const sohValue = toNum("SoH");
      const chargeEnergyValue = toNum("Charge_Energy");
      const dischargeEnergyValue = toNum("Discharge_Energy");
      const dodValue = toNum("DoD");
      const temperatureValue = toNum("Temperature");
      const controlStateValue = toNum("Control_State");

      const activePowerTrend = getTrend(activePowerValue, prev?.activePower);
      const reactivePowerTrend = getTrend(reactivePowerValue, prev?.reactivePower);
      const currentTrend = getTrend(currentValue, prev?.current);
      const voltageTrend = getTrend(voltageValue, prev?.voltage);
      const frequencyTrend = getTrend(frequencyValue, prev?.frequency);
      const socTrend = getTrend(socValue, prev?.soc);
      const sohTrend = getTrend(sohValue, prev?.soh);
      const chargeEnergyTrend = getTrend(chargeEnergyValue, prev?.chargeEnergy);
      const dischargeEnergyTrend = getTrend(dischargeEnergyValue, prev?.dischargeEnergy);
      const dodTrend = getTrend(dodValue, prev?.dod);
      const temperatureTrend = getTrend(temperatureValue, prev?.temperature);
      const controlStateTrend = getTrend(controlStateValue, prev?.controlState);

      mapped.push({
        deviceId,
        name,

        activePower: toDisplay("Active_Power"),
        activePower_raw: activePowerValue,
        activePowerTrend,

        reactivePower: toDisplay("Reactive_Power"),
        reactivePower_raw: reactivePowerValue,
        reactivePowerTrend,

        current: toDisplay("Current"),
        current_raw: currentValue,
        currentTrend,

        voltage: toDisplay("Voltage"),
        voltage_raw: voltageValue,
        voltageTrend,

        frequency: toDisplay("Frequency"),
        frequency_raw: frequencyValue,
        frequencyTrend,

        soc: toDisplay("SoC"),
        soc_raw: socValue,
        socTrend,

        soh: toDisplay("SoH"),
        soh_raw: sohValue,
        sohTrend,

        chargeEnergy: toDisplay("Charge_Energy"),
        chargeEnergy_raw: chargeEnergyValue,
        chargeEnergyTrend,

        dischargeEnergy: toDisplay("Discharge_Energy"),
        dischargeEnergy_raw: dischargeEnergyValue,
        dischargeEnergyTrend,

        dod: toDisplay("DoD"),
        dod_raw: dodValue,
        dodTrend,

        temperature: toDisplay("Temperature"),
        temperature_raw: temperatureValue,
        temperatureTrend,

        controlState: toDisplay("Control_State"),
        controlState_raw: controlStateValue,
        controlStateTrend,

        isLive,
        rawData: d,
      });

      previousValues.current[deviceId] = {
        activePower: activePowerValue,
        reactivePower: reactivePowerValue,
        current: currentValue,
        voltage: voltageValue,
        frequency: frequencyValue,
        soc: socValue,
        soh: sohValue,
        chargeEnergy: chargeEnergyValue,
        dischargeEnergy: dischargeEnergyValue,
        dod: dodValue,
        temperature: temperatureValue,
        controlState: controlStateValue,
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
          const lastTs = d?.Time_Stamp?.value ? new Date(d.Time_Stamp.value).getTime() : 0;
          const activePower = d?.[COLUMN_KEY_MAP.Active_Power]?.value ?? 0;
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
        Cell: ({ row }) => renderValueCard(row.original.activePower, row.original.activePowerTrend),
      },
      {
        accessorKey: "reactivePower",
        header: "Reactive Power",
        size: 120,
        Cell: ({ row }) => renderValueCard(row.original.reactivePower, row.original.reactivePowerTrend),
      },
      {
        accessorKey: "current",
        header: "Current",
        size: 120,
        Cell: ({ row }) => renderValueCard(row.original.current, row.original.currentTrend),
      },
      {
        accessorKey: "voltage",
        header: "Voltage",
        size: 120,
        Cell: ({ row }) => renderValueCard(row.original.voltage, row.original.voltageTrend),
      },
      {
        accessorKey: "frequency",
        header: "Frequency",
        size: 120,
        Cell: ({ row }) => renderValueCard(row.original.frequency, row.original.frequencyTrend),
      },
      {
        accessorKey: "soc",
        header: "SoC",
        size: 100,
        Cell: ({ row }) => renderValueCard(row.original.soc, row.original.socTrend),
      },
      {
        accessorKey: "soh",
        header: "SoH",
        size: 100,
        Cell: ({ row }) => renderValueCard(row.original.soh, row.original.sohTrend),
      },
      {
        accessorKey: "chargeEnergy",
        header: "Charge Energy",
        size: 140,
        Cell: ({ row }) => renderValueCard(row.original.chargeEnergy, row.original.chargeEnergyTrend),
      },
      {
        accessorKey: "dischargeEnergy",
        header: "Discharge Energy",
        size: 150,
        Cell: ({ row }) => renderValueCard(row.original.dischargeEnergy, row.original.dischargeEnergyTrend),
      },
      {
        accessorKey: "dod",
        header: "DoD",
        size: 100,
        Cell: ({ row }) => renderValueCard(row.original.dod, row.original.dodTrend),
      },
      {
        accessorKey: "temperature",
        header: "Temperature",
        size: 120,
        Cell: ({ row }) => renderValueCard(row.original.temperature, row.original.temperatureTrend),
      },
      {
        accessorKey: "controlState",
        header: "Control State",
        size: 120,
        Cell: ({ row }) => renderValueCard(row.original.controlState, row.original.controlStateTrend),
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
          aria-label="Toggle fullscreen"
          onClick={toggleFullscreen}
          variant="ghost"
          size="xs"
          _hover={{ bg: "transparent", color: "gray.500" }}
        >
          {isFullscreen ? <SqeezIcon /> : <ExpandIcon />}
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
              height: "34px",
              marginTop: "auto",
              background: cardBg,
              color: cardText,
              borderTop: `1px solid ${cardBorder}`,

              "& .MuiTablePagination-root": {
                minHeight: "34px",
                height: "34px",
                color: cardText,
                position: "relative",
                top: "-4px",
              },

              "& .MuiTablePagination-toolbar": {
                minHeight: "34px",
                height: "34px",
                padding: "0 6px",
                display: "flex",
                alignItems: "center",
                transform: "translateY(-2px)",
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
                display: "block",
                margin: 0,
                lineHeight: "34px",
              },

              "& .MuiSvgIcon-root": {
                color: cardText,
              },

              "& .MuiIconButton-root": {
                color: cardText,
                padding: "2px",
              },

              "& .MuiTablePagination-actions": {
                position: "relative",
                top: "0px",
                transform: "translateY(0px)",
              },

              "& .MuiTablePagination-actions .MuiIconButton-root": {
                position: "relative",
                top: "0px",
                transform: "none !important",
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
