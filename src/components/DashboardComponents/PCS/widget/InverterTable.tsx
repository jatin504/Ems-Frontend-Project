import React, { useState, useEffect, useRef, useMemo } from "react";
import { Box, Flex, Text, useColorModeValue, Button, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
// Inline MiniBar (previously a separate file)
const MiniBar = ({
  value = 0,
  max = 1,
  height = "8px",
  width = "100%",
}: any) => {

  const toNum = (v: any) => {
    if (typeof v === "number") return v;

    if (
      v === null ||
      v === undefined
    ) {
      return 0;
    }

    const match = String(v).match(
      /-?\d+(\.\d+)?/
    );

    return match
      ? parseFloat(match[0])
      : 0;
  };

  const numVal = toNum(value);

  const numMax = toNum(max);

  const pct =
    numMax > 0
      ? Math.max(
          0,
          Math.min(
            1,
            numVal / numMax
          )
        )
      : 0;

  return (
    <Box
      bg="gray.100"
      w={width}
      h={height}
      borderRadius="6px"
      overflow="hidden"
    >
      <Box
        bg="#6bbf59"
        h="100%"
        w={`${pct * 100}%`}
      />
    </Box>
  );
};
// removed unused SpineGraph, timeseries hook and time handle from this table view
// MPPT and String graphs removed from this view
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMediaQuery } from "@chakra-ui/react";
import { MdElectricBolt, MdLinkOff } from "react-icons/md";

/* ================= TYPES ================= */

interface InverterData {
  deviceId: string;
  name: string;
  status: any;
  rawData?: any;
  [key: string]: any;
}

/* ================= COMPONENT ================= */

export default function InvertersPanel() {
  const navigate = useNavigate();
  const [isShortScreen] = useMediaQuery("(max-width: 900px)");
  const bodyBg = useColorModeValue("gray.50", "gray.900");
  const tableMode = useColorModeValue("light", "dark");
  const BASE_URL = import.meta.env.VITE_API_BASE;
  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode: tableMode },
      }),
    [tableMode]
  );

  const [rows, setRows] = useState<InverterData[]>([]);
  const [dataMap, setDataMap] = useState<Record<string, any>>({});
  // modal removed; no selected inverter state required

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

  const getValueWithUnit = (
    deviceId: string,
    columnKey: keyof typeof COLUMN_KEY_MAP
  ) => {
    const field = dataMap?.[deviceId]?.[COLUMN_KEY_MAP[columnKey]];

    const value = field?.value;
    const unit = field?.unit ?? "";

    if (
      value === null ||
      value === undefined ||
      value === "" ||
      Number.isNaN(value)
    ) {
      return "--";
    }

    return `${value} ${unit}`.trim();
  };

  /* ---------- backend key map (use lowercase API keys) ---------- */

  const INVERTER_COLUMNS = [
    "Active Power",
    "Reactive Power",
    "DC Voltage",
    "DC Power",
    "AC Current L1",
    "AC Current L2",
    "AC Current L3",
    "PF",
    "Daily Energy",
    "Apparent Power",
    "AC Volt L1L2",
    "AC Volt L2L3",
    "AC Volt L3L1",
    "Frequency",
    "Temperature",
  ];

  const COLUMN_KEY_MAP: Record<string, string> = {
    "Active Power": "active_power",
    "Reactive Power": "reactive_power",
    "DC Voltage": "voltage",
    "DC Power": "reactive_power",
    "AC Current L1": "current",
    "AC Current L2": "dc_current",
    "AC Current L3": "ac_current",
    PF: "efficiency",
    "Daily Energy": "energy_today",
    "Apparent Power": "apparent_power",
    "AC Volt L1L2": "battery_voltage",
    "AC Volt L2L3": "Alarm1",
    "AC Volt L3L1": "grid_voltage",
    Frequency: "frequency",
    Temperature: "battery_soc",
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
        pageSize: 20,
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
        pageSize: fs ? 20 : 5,
      }));
    };

    document.addEventListener("fullscreenchange", fn);
    return () => document.removeEventListener("fullscreenchange", fn);
  }, []);

  /* ---------- API ---------- */

  useEffect(() => {

    const fetchData = () => {
      fetch(
        `${BASE_URL}/api/lastest-direct-data/multiple-latest-devices`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            device_id_patterns: ["_inverter_inverter_"],
          }),
        }
      )
        .then((r) => r.json())
        .then((j) => {
          if (j.success) {
            setDataMap(j.data);
          }
        })
        .catch(console.error);
    };

    // first load
    fetchData();

    // auto refresh every 1 minute
    const interval = setInterval(() => {
      fetchData();
    }, 60 * 1000);

    return () => clearInterval(interval);

  }, []);

  /* ---------- map data ---------- */

  useEffect(() => {
    const mapped: InverterData[] = [];

    Object.entries(dataMap).forEach(([deviceId, d]: any) => {
      const suffix = deviceId.match(/_(\d+)$/)?.[1];
      const name = suffix ? `PCS-${suffix}` : deviceId;
      const row: InverterData = {
        deviceId,
        name,
        status: d,
        rawData: d,
      };

      INVERTER_COLUMNS.forEach((key) => {
        const field = d?.[COLUMN_KEY_MAP[key]];
        const value = field?.value;
        const unit = field?.unit ?? "";
        row[key] =
          value !== null && value !== undefined && value !== ""
            ? `${value} ${unit}`.trim()
            : "--";
      });

      mapped.push(row);
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
      header: "ID",
      size: 120,
      muiTableHeadCellProps: { sx: { textAlign: "left", pl: 1, fontSize: "9px" } },
      muiTableBodyCellProps: { sx: { textAlign: "left", pl: 1, fontSize: "9px" } },
      Cell: ({ row }) => {
        return (
          <Text
            fontSize="10px"
            textAlign="left"
            style={{ width: "100%", cursor: "pointer", textDecoration: "underline" }}
            onClick={() =>
              navigate("/devices/inv/details", {
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
        );
      },
    },
    {
      id: "status",
      header: "Status",
      enableSorting: false,
      size: 110,
      muiTableHeadCellProps: { sx: { textAlign: "left", pl: 1, fontSize: "9px" } },
      muiTableBodyCellProps: { sx: { textAlign: "left", pl: 1, fontSize: "9px" } },
      Cell: ({ row }) => {
        const deviceData = row.original.status ?? row.original.rawData ?? dataMap?.[row.original.deviceId];

        const lastTs =
          deviceData?.Time_Stamp?.value
            ? new Date(deviceData.Time_Stamp.value).getTime()
            : 0;

        const activePower =
          deviceData?.active_power?.value ??
          0;

        const now = Date.now();

        if (!lastTs || now - lastTs > 4 * 60 * 1000) {
          return (
            <HStack spacing={1}>
              <MdLinkOff color="orange" size={14} />
              <Text fontSize="10px" color="orange">
                Non-Comm
              </Text>
            </HStack>
          );
        }

        if (activePower > 0) {
          return (
            <HStack spacing={1}>
              <MdElectricBolt color="green" size={14} />
              <Text fontSize="10px" color="green">
                Running
              </Text>
            </HStack>
          );
        }

        return (
          <HStack spacing={1}>
            <MdElectricBolt color="red" size={14} />
            <Text fontSize="10px" color="red">
              Stop
            </Text>
          </HStack>
        );
      },
    },
    ...INVERTER_COLUMNS.map((key) => ({
      accessorKey: key,
      header: key,
      size: 110,
      Cell: ({ cell }: { cell: any }) => (
        <Text fontSize="10px" textAlign="center" whiteSpace="nowrap">
          {cell.getValue() as string}
        </Text>
      ),
    })),
  ];

  const columns = useMemo(
    () => (isShortScreen ? allColumns.slice(0, 9) : allColumns),
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
              PCS 
            </Text>
          </Flex>
          <Button aria-label="Toggle fullscreen" onClick={toggleFullscreen} variant="ghost" size="sm">
            ⤢
          </Button>
        </Flex>

        <Box px={1} py={2} bg={bodyBg} h="calc(100% - 50px)">
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
                  borderCollapse: "collapse",

                  "& .MuiTableCell-root": {
                    paddingLeft: "8px",
                    paddingRight: "8px",
                  },
                },
              }}
              muiTableBodyCellProps={{
                sx: {
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "visible",
                  textOverflow: "ellipsis",
                  padding: "4px 8px",
                  fontSize: "10px",
                },
              }}
              muiTableHeadCellProps={{
                sx: {
                  textAlign: "center",
                  padding: "6px 8px",
                  fontSize: "10px",

                  "& .Mui-TableHeadCell-Content": {
                    justifyContent: "center",
                    gap: "4px",
                  },
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
        </Box>
      </Box>

      {/* Inverter modal removed */}
    </>
  );
}

// base url from env