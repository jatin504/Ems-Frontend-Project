import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  useDisclosure,
  Button,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { ExpandIcon, SqeezIcon } from "../../../assets/Icons";
import PCSModal from "./PCSModal";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMediaQuery } from "@chakra-ui/react";
import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";

interface PCSData {
  deviceId: string;
  name: string;
  status: string;
  dcPower: number | string;
  acPower: number | string;
  performancePct: number | string;
  yieldToday: number | string;
  lifetime: number | string;
  prActual: number | string;
  prEst: number | string;
  qKvar: number | string;
  setpointP: number | string;
  setpointQ: number | string;
}

interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetData {
  [deviceID: string]: {
    [keyName: string]: WidgetPoint[];
  };
}

export default function PCSInvertersPanel() {
  const [rows, setRows] = useState<PCSData[]>([]);
  const [selectedPCS, setSelectedPCS] = useState<PCSData | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const [isShortScreen] = useMediaQuery("(max-width: 900px)");

  const {
    config: timeWindow,
  } = useTimeHandle(12, "hour", "avg", [15, "minute"], 60000, {
    timeRange: {
      type: "relative",
      relativeType: "currentDaySoFar",
      interval: 1,
      intervalType: "minute",
    },
  });

  const { data, loading, error, fetchData } = useTimeseriesData();

  const tableMode = useColorModeValue("light", "dark");
  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode: tableMode },
      }),
    [tableMode]
  );

  // theme tokens
  const panelBg = useColorModeValue("white", "gray.900");
  const panelBorder = useColorModeValue("gray.200", "gray.700");
  const headerBg = useColorModeValue("blue.50", "blue.900");
  const headerBorder = useColorModeValue("gray.200", "gray.700");
  const headerStrong = useColorModeValue("gray.800", "gray.100");
  const bodyBg = useColorModeValue("gray.50", "gray.900");
  const subtleText = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    fetchData({
      devices: {
        patterns: ["_ess_ess_"],
        ids: [],
      },
      keys: [
        { key: "soc", alias: "DC Power", keyType: "common" },
        { key: "active_power", alias: "AC Power", keyType: "common" },
        { key: "energy_discharged_today", alias: "Sp.Power (kW/kWp)", keyType: "common" },
        { key: "energy_charged_today", alias: "Yield Today", keyType: "common" },
        { key: "energy_discharged_this_year", alias: "Yield Lifetime", keyType: "common" },
        { key: "soc", alias: "PR Actual", keyType: "common" },
        { key: "rated_power", alias: "PR Estimation", keyType: "common" },
        { key: "reactive_power", alias: "Q KVAR", keyType: "common" },
        { key: "dcdc1_battery_side_voltage", alias: "Setpoint P", keyType: "common" },
        { key: "dcdc1_bus_side_voltage", alias: "Setpoint Q", keyType: "common" },
      ],
      aggregation: timeWindow.aggregation,
      timeRange: timeWindow.timeRange,
      orderBy: timeWindow.orderBy,
    } as any);
  }, [timeWindow]);

  useEffect(() => {
    if (!data) {
      setRows([]);
      return;
    }
    const widgetData = data as WidgetData;
    const newRows: PCSData[] = [];
    Object.keys(widgetData).forEach((deviceID) => {
      const deviceData = widgetData[deviceID];
      const getLastVal = (alias: string) => {
        const arr = deviceData?.[alias];
        if (!arr || arr.length === 0) return "--";
        const v = arr[arr.length - 1]?.value;
        return typeof v === "number" ? Number(v.toFixed(2)) : v ?? "--";
      };
      const suffix = deviceID.match(/_(\d+)$/)?.[1] || "";
      const pcsName = suffix ? `PCS-${suffix}` : deviceID;
      newRows.push({
        name: pcsName,
        deviceId: deviceID,
        status: "ok",
        dcPower: getLastVal("DC Power"),
        acPower: getLastVal("AC Power"),
        performancePct: getLastVal("Sp.Power (kW/kWp)"),
        yieldToday: getLastVal("Yield Today"),
        lifetime: getLastVal("Yield Lifetime"),
        prActual: getLastVal("PR Actual"),
        prEst: getLastVal("PR Estimation"),
        qKvar: getLastVal("Q KVAR"),
        setpointP: getLastVal("Setpoint P"),
        setpointQ: getLastVal("Setpoint Q"),
      });
    });
    setRows(newRows);
  }, [data]);

  const handlePCSClick = (pcs: PCSData) => {
    setSelectedPCS(pcs);
    onOpen();
  };

  const n = (v: any, fallback = "--") =>
    v === null || v === undefined || v === "" || Number.isNaN(v) ? fallback : v;

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const numA = Number(a.name.replace(/[^\d]/g, ""));
      const numB = Number(b.name.replace(/[^\d]/g, ""));
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.name.localeCompare(b.name);
    });
  }, [rows]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      panelRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const fn = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", fn);
    return () => document.removeEventListener("fullscreenchange", fn);
  }, []);

  // Live polling
  useEffect(() => {
    fetchData({
      devices: {
        patterns: ["_ess_ess_"],
        ids: [],
      },
      keys: [
        { key: "soc", alias: "DC Power", keyType: "common" },
        { key: "active_power", alias: "AC Power", keyType: "common" },
        { key: "energy_discharged_today", alias: "Sp.Power (kW/kWp)", keyType: "common" },
        { key: "energy_charged_today", alias: "Yield Today", keyType: "common" },
        { key: "energy_discharged_this_year", alias: "Yield Lifetime", keyType: "common" },
        { key: "soc", alias: "PR Actual", keyType: "common" },
        { key: "rated_power", alias: "PR Estimation", keyType: "common" },
        { key: "reactive_power", alias: "Q KVAR", keyType: "common" },
        { key: "dcdc1_battery_side_voltage", alias: "Setpoint P", keyType: "common" },
        { key: "dcdc1_bus_side_voltage", alias: "Setpoint Q", keyType: "common" },
      ],
      aggregation: timeWindow.aggregation,
      timeRange: timeWindow.timeRange,
      orderBy: timeWindow.orderBy,
    } as any);
    const interval = setInterval(() => {
      fetchData({
        devices: {
          patterns: ["_ess_ess_"],
          ids: [],
        },
        keys: [
          { key: "soc", alias: "DC Power", keyType: "common" },
          { key: "active_power", alias: "AC Power", keyType: "common" },
          { key: "energy_discharged_today", alias: "Sp.Power (kW/kWp)", keyType: "common" },
          { key: "energy_charged_today", alias: "Yield Today", keyType: "common" },
          { key: "energy_discharged_this_year", alias: "Yield Lifetime", keyType: "common" },
          { key: "soc", alias: "PR Actual", keyType: "common" },
          { key: "rated_power", alias: "PR Estimation", keyType: "common" },
          { key: "reactive_power", alias: "Q KVAR", keyType: "common" },
          { key: "dcdc1_battery_side_voltage", alias: "Setpoint P", keyType: "common" },
          { key: "dcdc1_bus_side_voltage", alias: "Setpoint Q", keyType: "common" },
        ],
        aggregation: timeWindow.aggregation,
        timeRange: timeWindow.timeRange,
        orderBy: timeWindow.orderBy,
      } as any);
    }, 60000);
    return () => clearInterval(interval);
  }, [timeWindow]);

  // MaterialReactTable columns
  const allColumns: MRT_ColumnDef<PCSData>[] = [
    {
      accessorKey: "name",
      header: "PCS",
      size: 120,
      minSize: 100,
      maxSize: 180,
      muiTableHeadCellProps: { sx: { minWidth: 100, maxWidth: 180 } },
      muiTableBodyCellProps: { sx: { minWidth: 100, maxWidth: 180, whiteSpace: 'normal', wordBreak: 'break-word' } },
      Cell: ({ row }) => (
        <Button
          variant="link"
          fontSize="10px"
          color="blue.400"
          onClick={() => handlePCSClick(row.original)}
          sx={{ whiteSpace: 'normal', wordBreak: 'break-word', textAlign: 'left', justifyContent: 'flex-start', minWidth: 0, maxWidth: 160 }}
        >
          {row.original.name}
        </Button>
      ),
    },
    {
      id: "status",
      header: "Status",
      enableSorting: false,
      size: 60,
      minSize: 50,
      maxSize: 70,
      muiTableHeadCellProps: { sx: { minWidth: 50, maxWidth: 70, textAlign: "center", fontSize: "12px" } },
      muiTableBodyCellProps: { sx: { minWidth: 50, maxWidth: 70, textAlign: "center" } },
      Cell: ({ row }) => (
        <Box w="10px" h="10px" borderRadius="50%" bg="green.400" mx="auto" />
      ),
    },
    {
      accessorKey: "prActual",
      header: "PR Actual",
      Cell: ({ row }) => <Text fontSize="10px">{n(row.original.prActual)}</Text>,
    },
    {
      accessorKey: "prEst",
      header: "PR Est.",
      Cell: ({ row }) => <Text fontSize="10px">{n(row.original.prEst)}</Text>,
    },
    {
      accessorKey: "dcPower",
      header: "DC Power",
      Cell: ({ row }) => <Text fontSize="10px">{n(row.original.dcPower)} kW</Text>,
    },
    {
      accessorKey: "acPower",
      header: "AC Power",
      Cell: ({ row }) => <Text fontSize="10px">{n(row.original.acPower)} kW</Text>,
    },
    {
      accessorKey: "qKvar",
      header: "Q (kVAR)",
      Cell: ({ row }) => <Text fontSize="10px">{n(row.original.qKvar)} kVAR</Text>,
    },
  ];

  const columns = useMemo(
    () => (isShortScreen ? allColumns.slice(0, 5) : allColumns),
    [isShortScreen]
  );

  return (
    <>
      <Box
        ref={panelRef}
        w="100%"
        h="100%"
        bg={panelBg}
        borderRadius="md"
        overflow="hidden"
        border="1px solid"
        borderColor={panelBorder}
      >
        <Flex align="center" bg={headerBg} px={3} py={1.5} borderBottom="1px solid" borderColor={headerBorder} justify="space-between">
          <Text fontWeight="600" fontSize="18px" color={headerStrong}>PCS</Text>
          <IconButton
            aria-label="Toggle fullscreen"
            icon={isFullscreen ? <SqeezIcon /> : <ExpandIcon />}
            onClick={toggleFullscreen}
            variant="ghost"
            size="sm"
          />
        </Flex>
        {(loading || error) && (
          <Box px={3} pt={1} fontSize="10px" color={subtleText}>
            {loading && <Text>Loading PCS data…</Text>}
            {error && <Text color="red.400">Error: {error}</Text>}
          </Box>
        )}
        <Box px={1} py={2} bg={bodyBg} h="calc(100% - 50px)">
          <ThemeProvider theme={theme}>
            <MaterialReactTable
              columns={columns}
              data={sortedRows}
              enablePagination={false}
              enableStickyHeader
              enableRowVirtualization={false}
              enableColumnResizing={false}
              enableFullScreenToggle={false}
              layoutMode="grid"
              initialState={{ density: "compact" }}
              muiTableContainerProps={{
                sx: {
                  overflow: isFullscreen ? "auto" : "hidden",
                  maxHeight: isFullscreen ? "calc(100vh - 56px)" : "none",
                },
              }}
              muiTablePaperProps={{
                sx: {
                  overflow: "hidden",
                },
              }}
              muiTableBodyCellProps={{
                sx: {
                  whiteSpace: "nowrap",
                },
              }}
            />
          </ThemeProvider>
        </Box>
        <PCSModal
          isOpen={isOpen}
          onClose={onClose}
          pcs={selectedPCS}
          timeWindow={timeWindow}
          containerRef={panelRef}
        />
      </Box>
    </>
  );
}
