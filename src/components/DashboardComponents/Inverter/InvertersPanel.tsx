import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  useDisclosure,
  Button,
  useColorModeValue,
  IconButton,
  Tabs,
  TabList,
  Tab,
} from "@chakra-ui/react";
import { ExpandIcon, SqeezIcon } from "../../../assets/Icons";
import MiniBar from "./MiniBar";
import InverterModal from "./InverterModal";
import SpineGraph from "../../Graphs/RevampCharts/SplineGraph";
import useTimeseriesData from "../../../hooks/useTimeseriesData";
import { useTimeHandle } from "../../../Services/TimeWindowSetting";
import MPPTPowerGraph from "./MPPTPowerGraph";
import StringPowerGraph from "./StringPowerGraph";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMediaQuery } from "@chakra-ui/react";

/* ================= TYPES ================= */

interface InverterData {
  deviceId: string;
  name: string;

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

  startTime: string;
  stopTime: string;

  isLive: boolean;
}

/* ================= COMPONENT ================= */

export default function InvertersPanel() {
  const [activeTab, setActiveTab] = useState(0);
  const [isShortScreen] = useMediaQuery("(max-width: 900px)");
  const bodyBg = useColorModeValue("gray.50", "gray.900");
  const tableMode = useColorModeValue("light", "dark");

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode: tableMode },
      }),
    [tableMode]
  );

  const [rows, setRows] = useState<InverterData[]>([]);
  const [dataMap, setDataMap] = useState<Record<string, any>>({});
  const [selectedInverter, setSelectedInverter] =
    useState<InverterData | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  /* ===== PAGINATION STATE ===== */
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const n = (v: any, fallback = "--") =>
    v === null || v === undefined || v === "" || Number.isNaN(v)
      ? fallback
      : v;

  /* ---------- backend key map ---------- */

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

  /* ---------- fullscreen ---------- */

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      panelRef.current?.requestFullscreen();
      setIsFullscreen(true);

      // FULLSCREEN 15 ROWS
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
        pageSize: 15,
      }));
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);

      // NORMAL 5 ROWS
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
        pageSize: 5,
      }));
    }
  };

  useEffect(() => {
    const fn = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);

      // ESC / browser fullscreen exit sync
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
        pageSize: fs ? 15 : 5,
      }));
    };

    document.addEventListener("fullscreenchange", fn);
    return () => document.removeEventListener("fullscreenchange", fn);
  }, []);

  /* ---------- API ---------- */

  useEffect(() => {
    fetch(
      "http://75.119.146.115:5179/api/lastest-direct-data/multiple-latest-devices",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device_id_patterns: ["_bank_bank_"],
        }),
      }
    )
      .then((r) => r.json())
      .then((j) => j.success && setDataMap(j.data))
      .catch(console.error);
  }, []);

  /* ---------- map data ---------- */

  useEffect(() => {
    const mapped: InverterData[] = [];
    const now = Date.now();

    Object.entries(dataMap).forEach(([deviceId, d]: any) => {
      const suffix = deviceId.match(/_(\d+)$/)?.[1];
      const name = suffix ? `Inverter-${suffix}` : deviceId;

      const v = (k: keyof typeof COLUMN_KEY_MAP) =>
        d?.[COLUMN_KEY_MAP[k]]?.value ?? "--";

      const ts = d?.timestamp?.value ?? 0;
      const isLive = !!ts && now - ts < 10 * 60 * 1000;

      mapped.push({
        deviceId,
        name,
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
        startTime: ts ? new Date(ts).toLocaleTimeString() : "--",
        stopTime: ts ? new Date(ts).toLocaleTimeString() : "--",
        isLive,
      });
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

  /* ---------- columns ---------- */

  const allColumns: MRT_ColumnDef<InverterData>[] = [
    {
      accessorKey: "name",
      header: "Inverter",
      muiTableHeadCellProps: { sx: { textAlign: "left", pl: 2 } },
      muiTableBodyCellProps: { sx: { textAlign: "left", pl: 2 } },
      Cell: ({ row }) => (
        <Button
          variant="link"
          fontSize="10px"
          color="blue.400"
          onClick={() => {
            setSelectedInverter(row.original);
            onOpen();
          }}
          style={{ textAlign: "left", justifyContent: "flex-start", width: "100%" }}
        >
          {row.original.name}
        </Button>
      ),
    },
    {
      id: "status",
      header: "Status",
      enableSorting: false,
      muiTableHeadCellProps: { sx: { textAlign: "left", pl: 2 } },
      muiTableBodyCellProps: { sx: { textAlign: "left", pl: 2 } },
      Cell: () => (
        <Box w="10px" h="10px" borderRadius="50%" bg="green.400" />
      ),
    },
    {
      accessorKey: "acPower",
      header: "AC Power",
      Cell: ({ row }) => (
        <Box display="flex" flexDirection="column" alignItems="center" width="60px">
          <MiniBar
            value={Math.min(1, Number(row.original.acPower || 0) / 300)}
            height="4px"
            width="24px"
            style={{ margin: "0 auto" }}
          />
          <Text fontSize="10px" textAlign="center" width="100%">
            {n(row.original.acPower)} kW
          </Text>
        </Box>
      ),
    },
    {
      accessorKey: "dcPower",
      header: "DC Power",
      Cell: ({ row }) => (
        <Box display="flex" flexDirection="column" alignItems="center" maxW="60px">
          <MiniBar
            value={Math.min(1, Number(row.original.dcPower || 0) / 300)}
            height="4px"
            width="16px"
          />
          <Text fontSize="10px">{n(row.original.dcPower)} kW</Text>
        </Box>
      ),
    },
    {
      accessorKey: "performancePct",
      header: "Sp.Power",
      Cell: ({ row }) => (
        <Box display="flex" flexDirection="column" alignItems="center" maxW="60px">
          <MiniBar
            value={Math.min(1, Number(row.original.performancePct || 0) / 100)}
            height="6px"
            width="28px"
          />
          <Text fontSize="10px">{n(row.original.performancePct)}</Text>
        </Box>
      ),
    },
    { accessorKey: "prActual", header: "PR Actual" },
    { accessorKey: "prEst", header: "PR Est" },
    { accessorKey: "setpointP", header: "Setpoint P" },
    { accessorKey: "setpointQ", header: "Setpoint Q" },
    {
      accessorKey: "yieldToday",
      header: "Yield Today",
      Cell: ({ row }) => (
        <Box display="flex" flexDirection="column" alignItems="center" maxW="60px">
          <MiniBar
            value={Math.min(1, Number(row.original.yieldToday || 0) / 50)}
            height="4px"
            width="16px"
          />
          <Text fontSize="10px">{n(row.original.yieldToday)} MWh</Text>
        </Box>
      ),
    },
    {
      accessorKey: "lifetime",
      header: "Yield Lifetime",
      Cell: ({ row }) => (
        <Box display="flex" flexDirection="column" alignItems="center" maxW="60px">
          <MiniBar
            value={Math.min(1, Number(row.original.lifetime || 0) / 1000)}
            height="4px"
            width="16px"
          />
          <Text fontSize="10px">{n(row.original.lifetime)} MWh</Text>
        </Box>
      ),
    },
    { accessorKey: "qKvar", header: "Q (kVAR)" },
    { accessorKey: "startTime", header: "Start Time" },
    { accessorKey: "stopTime", header: "Stop Time" },
  ];

  const columns = useMemo(
    () => (isShortScreen ? allColumns.slice(0, 8) : allColumns),
    [isShortScreen]
  );

  /* ================= RENDER ================= */

  return (
    <>
      <Box
        ref={panelRef}
        w="100%"
        h="100%"
        bg={useColorModeValue("white", "gray.800")}
        borderRadius="md"
        overflow="hidden"
      >
        <Flex justify="space-between" align="center" px={4} py={3}>
          <Flex align="center" gap={4}>
            <Text fontSize="lg" fontWeight="bold">
              Inverter
            </Text>
            <Tabs
              index={activeTab}
              onChange={setActiveTab}
              variant="soft-rounded"
              colorScheme="blue"
              size="sm"
            >
              <TabList>
                <Tab>INV</Tab>
                <Tab>MPPT</Tab>
                <Tab>String</Tab>
              </TabList>
            </Tabs>
          </Flex>
          <IconButton
            aria-label="Toggle fullscreen"
            icon={isFullscreen ? <SqeezIcon /> : <ExpandIcon />}
            onClick={toggleFullscreen}
            variant="ghost"
            size="sm"
          />
        </Flex>

        <Box px={1} py={2} bg={bodyBg} h="calc(100% - 50px)">
          {activeTab === 0 && (
            <ThemeProvider theme={theme}>
              <MaterialReactTable
                columns={columns}
                data={sortedRows}
                enablePagination
                state={{ pagination }}
                onPaginationChange={setPagination}
                initialState={{ density: "compact" }}
                layoutMode="semantic"
                muiTableContainerProps={{
                  sx: {
                    maxHeight: isFullscreen ? "calc(100vh - 160px)" : "230px",
                    overflowY: "auto",
                    overflowX: "hidden",
                  },
                }}

                muiTableProps={{
                  sx: {
                    tableLayout: "fixed",
                    width: "100%",
                  },
                }}
                muiTableBodyCellProps={{
                  sx: {
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    p: "4px 6px",
                  },
                }}
                muiTableHeadCellProps={{
                  sx: {
                    textAlign: "center",
                    p: "6px",
                  },
                }}
                enableColumnFilters={true}
                enableFilters={true}
                enableGlobalFilter={true}
                enableHiding={true}
                enableDensityToggle={true}
                enableFullScreenToggle={false}
              />
            </ThemeProvider>
          )}
          {activeTab === 1 && (
  <Box
    h={isFullscreen ? "calc(100vh - 60px)" : "230px"}
    w="100%"
  >
    <MPPTPowerGraph height={isFullscreen ? 900 : 390} />
  </Box>
)}

{activeTab === 2 && (
  <Box
    h={isFullscreen ? "calc(100vh - 60px)" : "230px"}
    w="100%"
  >
    <StringPowerGraph height={isFullscreen ? 900 : 390} />
  </Box>
)}
        </Box>
      </Box>

      <InverterModal
        isOpen={isOpen}
        onClose={onClose}
        selectedInverter={selectedInverter}
        deviceId={selectedInverter?.deviceId}
        containerRef={panelRef}
      />
    </>
  );
}
