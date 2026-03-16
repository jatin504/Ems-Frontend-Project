import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { ExpandIcon, SqeezIcon } from "../../../../assets/Icons";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMediaQuery } from "@chakra-ui/react";

interface MeterData {
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

export default function MetersPanel() {
  const [rows, setRows] = useState<MeterData[]>([]);
  const [selectedMeter, setSelectedMeter] = useState<MeterData | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // 🔹 SHORT SCREEN DETECTION
  const [isShortScreen] = useMediaQuery("(max-height: 750px)");


  const bodyBg = useColorModeValue("gray.50", "gray.900");
  const tableMode = useColorModeValue("light", "dark");

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode: tableMode },
      }),
    [tableMode]
  );

  const COLUMN_KEY_MAP: Record<string, string> = {
    dcPower: "DCDC1_Battery_side_current",
    acPower: "Active_power",
    performancePct: "Power_factor",
    yieldToday: "Total_energy_charged",
    lifetime: "Total_energy_discharged",
    prActual: "Phase_B_active_power",
    prEst: "Phase_B_voltage",
    qKvar: "Reactive_power",
    setpointP: "Alarm_1",
    setpointQ: "Alarm_2",
  };

  const [dataMap, setDataMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("http://75.119.146.115:5179/api/lastest-direct-data/multiple-latest-devices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device_id_patterns: ["_bank_bank_"] }),
    })
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setDataMap(j.data);
        else setError("API error");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const mapped: MeterData[] = [];
    Object.entries(dataMap).forEach(([deviceId, d]: any) => {
      const suffix = deviceId.match(/_(\d+)$/)?.[1];
      const name = suffix ? `MTR-${suffix}` : deviceId;
      const v = (k: keyof typeof COLUMN_KEY_MAP) =>
        d?.[COLUMN_KEY_MAP[k]]?.value ?? "--";

      mapped.push({
        deviceId,
        name,
        status: "ok",
        dcPower: v("dcPower"),
        acPower: v("acPower"),
        performancePct: v("performancePct"),
        yieldToday: v("yieldToday"),
        lifetime: v("lifetime"),
        prActual: v("prActual"),
        prEst: v("prEst"),
        qKvar: v("qKvar"),
        setpointP: v("setpointP"),
        setpointQ: v("setpointQ"),
      });
    });
    setRows(mapped);
  }, [dataMap]);

  const n = (v: any, fallback = "--") =>
    v === null || v === undefined || v === "" || Number.isNaN(v)
      ? fallback
      : v;

  /* ---------- SORT ---------- */
  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const na = Number(a.name.replace(/[^\d]/g, ""));
      const nb = Number(b.name.replace(/[^\d]/g, ""));
      return na - nb;
    });
  }, [rows]);

  /*  SHORT SCREEN → ONLY 10 ROWS */
  const displayRows = useMemo(() => {
    return isShortScreen ? sortedRows.slice(0, 10) : sortedRows;
  }, [isShortScreen, sortedRows]);

  const tableMaxHeight = useMemo(() => {
    if (isShortScreen) return `${36 * 10 + 40}px`;
    return isFullscreen ? "calc(100vh - 56px)" : "none";
  }, [isShortScreen, isFullscreen]);

  const columns: MRT_ColumnDef<MeterData>[] = [
    { accessorKey: "name", header: "Name" },
    {
      header: "Status",
      Cell: () => (
        <Box w="10px" h="10px" borderRadius="50%" bg="green.400" mx="auto" />
      ),
    },
    { accessorKey: "acPower", header: "AC Power" },
    { accessorKey: "dcPower", header: "DC Power" },
    { accessorKey: "performancePct", header: "Sp.Power" },
    { accessorKey: "prActual", header: "PR Actual" },
    { accessorKey: "prEst", header: "PR Est" },
    { accessorKey: "setpointP", header: "Setpoint P" },
    { accessorKey: "setpointQ", header: "Setpoint Q" },
    { accessorKey: "yieldToday", header: "Yield Today" },
    { accessorKey: "lifetime", header: "Lifetime" },
    { accessorKey: "qKvar", header: "Q (kVAR)" },
  ];

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

  return (
    <>
      <Box ref={panelRef} w="100%" h="100%" bg="white" borderRadius="md">
        <Flex justify="space-between" align="center" px={4} py={3} bg={useColorModeValue("#fff", 'rgba(24,24,27,0.95)')}>
          <Text fontSize="lg" fontWeight="bold" color={useColorModeValue("#1A202C", "#E6E6E6")}>
            Meters
          </Text>
          <IconButton
            aria-label="Toggle fullscreen"
            icon={isFullscreen ? <SqeezIcon /> : <ExpandIcon />}
            onClick={toggleFullscreen}
            size="sm"
            variant="ghost"
          />
        </Flex>

        <Box px={1} py={2} bg={bodyBg}>
          <ThemeProvider theme={theme}>
            <MaterialReactTable
              columns={columns}
              data={displayRows}
              enablePagination={false}
              enableStickyHeader
              enableFullScreenToggle={false}
              layoutMode="grid"
              initialState={{ density: "compact" }}
              muiTableContainerProps={{
                sx: {
                  maxHeight: tableMaxHeight,
                  overflow: isFullscreen ? "auto" : "hidden",
                },
              }}
              muiTableBodyRowProps={{
                onClick: (_, row) => {
                  setSelectedMeter(row.original);
                  onOpen();
                },
                sx: { cursor: "pointer" },
              }}
            />
          </ThemeProvider>
        </Box>
      </Box>
      <MeterModal isOpen={isOpen} onClose={onClose} selectedMeter={selectedMeter} />
    </>
  );
}

const MeterModal = () => null;
