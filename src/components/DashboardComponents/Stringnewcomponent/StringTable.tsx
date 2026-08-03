import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  IconButton,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ExpandIcon, SqeezIcon } from "../../../assets/Icons";
import StringGroupSummary from "./StringGroupSummary";

/* ================= TYPES ================= */

interface StringRow {
  [key: string]: any;
}

/* ================= COMPONENT ================= */

export default function StringTable() {
  const panelRef = useRef<HTMLDivElement>(null);

  const tableMode = useColorModeValue("light", "dark");
  const bodyBg = useColorModeValue("gray.50", "gray.900");

  const [isShortScreen] = useMediaQuery("(max-width: 900px)");

  const theme = useMemo(
    () => createTheme({ palette: { mode: tableMode } }),
    [tableMode]
  );

  const BASE_URL = import.meta.env.VITE_API_BASE;

  const [rows, setRows] = useState<StringRow[]>([]);
  const [dataMap, setDataMap] = useState<Record<string, any>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);

  const extractTrailingNumber = (s: string) => {
    const m = String(s).match(/(\d+)(?!.*\d)/);
    return m ? parseInt(m[1], 10) : NaN;
  };

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  /* ================= BACKEND KEY MAP ================= */

  // const KEY_MAP: Record<keyof Omit<StringRow, "stringName" | "status">, string> =
  //   {
  //     current: "Active_Power",
  //     voltage: "String_6_Current",
  //     power: "Phase_A_active_power",
  //     temperature: "DCDC_Cabinet_temperature",
  //     irradiance: "Fan_speed_5",
  //     health: "Fan_speed_4",
  //   };

  /* ================= FULLSCREEN ================= */

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      panelRef.current?.requestFullscreen();
      setIsFullscreen(true);
      setPagination({ pageIndex: 0, pageSize: 15 });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      setPagination({ pageIndex: 0, pageSize: 5 });
    }
  };

  useEffect(() => {
    const fn = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      setPagination({ pageIndex: 0, pageSize: fs ? 15 : 5 });
    };
    document.addEventListener("fullscreenchange", fn);
    return () => document.removeEventListener("fullscreenchange", fn);
  }, []);

  /* ================= API ================= */

  useEffect(() => {
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
      .then((j) => j.success && setDataMap(j.data))
      .catch(console.error);
  }, [BASE_URL]);

  /* ================= MAP DATA ================= */

  useEffect(() => {

  const mapped: StringRow[] = [];

  // sort device entries by trailing number in device id (handles inverter1, inverter10, ...)
  Object.entries(dataMap)
    .sort((a, b) => {
      const na = extractTrailingNumber(a[0]);
      const nb = extractTrailingNumber(b[0]);
      if (Number.isNaN(na) && Number.isNaN(nb)) return a[0].localeCompare(b[0]);
      if (Number.isNaN(na)) return 1;
      if (Number.isNaN(nb)) return -1;
      return na - nb;
    })
    .forEach(([deviceId, d]: any) => {
      const suffix = deviceId.split("_").pop();

      const row: StringRow = {
        device: `Inverter_${suffix}`,
      };

      Object.keys(d).forEach((key) => {
        if (key.toLowerCase().includes("string")) {
          const value = d[key]?.value;
          const unit = d[key]?.unit ?? "";

          row[key] =
            value !== null &&
            value !== undefined &&
            value !== ""
              ? `${value} ${unit}`.trim()
              : null;
        }
      });

      mapped.push(row);
    });

  // sort mapped rows by trailing number in the device label
  mapped.sort((r1, r2) => {
    const n1 = extractTrailingNumber(r1.device);
    const n2 = extractTrailingNumber(r2.device);
    if (Number.isNaN(n1) && Number.isNaN(n2)) return 0;
    if (Number.isNaN(n1)) return 1;
    if (Number.isNaN(n2)) return -1;
    return n1 - n2;
  });

  setRows(mapped);

}, [dataMap]);

  /* ================= COMMON CELL STYLE ================= */

  const headCell = {
  sx: {
    textAlign: "center",
    px: "4px",
    py: "4px",
    whiteSpace: "nowrap",
    fontSize: "10px",
    fontWeight: 700,
  },
};

  const bodyCell = {
  sx: {
    textAlign: "center",
    px: "4px",
    py: "2px",
    whiteSpace: "nowrap",
    fontSize: "10px",
  },
};

  /* ================= COLUMNS (STATUS = 2nd) ================= */

  const allColumns = useMemo<MRT_ColumnDef<StringRow>[]>(() => {

  if (!rows.length) return [];

  const keys = Object.keys(rows[0]);

  const getKeyNum = (k: string) => {
    const m = String(k).match(/(\d+)(?!.*\d)/);
    return m ? parseInt(m[1], 10) : NaN;
  };

  keys.sort((a, b) => {
    if (a === "device") return -1;
    if (b === "device") return 1;
    const na = getKeyNum(a);
    const nb = getKeyNum(b);
    const hasNa = !Number.isNaN(na);
    const hasNb = !Number.isNaN(nb);
    if (hasNa && hasNb) return na - nb;
    if (hasNa) return -1;
    if (hasNb) return 1;
    return a.localeCompare(b);
  });

  const prettify = (k: string) => {
    if (k === "device") return "Device";
    return String(k)
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return keys.map((key) => ({
    accessorKey: key,
    header: prettify(key),
    size: 140,
    muiTableHeadCellProps: headCell,
    muiTableBodyCellProps: bodyCell,
  }));

}, [rows]);

  const columns = useMemo(() => {

  // short screen → 7 columns
  if (isShortScreen && !isFullscreen) {
    return allColumns.slice(0, 7);
  }

  // fullscreen → all columns
  return allColumns;

}, [allColumns, isShortScreen, isFullscreen]);

  /* ================= RENDER ================= */

  return (
    <Box
      ref={panelRef}
      w="100%"
      minW={0}
      h={"320px"}
      overflow="hidden"
      bg={useColorModeValue("white", "gray.800")}
      borderRadius="md"
    >
      <Tabs
        variant="soft-rounded"
        colorScheme="blue"
        size="sm"
        isLazy
      >
        <Flex justify="space-between" align="center" px={4} py={3}>
          <Flex align="center" gap={4}>
            <Text fontSize="lg" fontWeight="bold">
              String
            </Text>

            <TabList w="fit-content">
              <Tab>Detail</Tab>
              <Tab>Summary</Tab>
            </TabList>
          </Flex>

          <IconButton
            aria-label="Toggle fullscreen"
            icon={isFullscreen ? <SqeezIcon /> : <ExpandIcon />}
            onClick={toggleFullscreen}
            variant="ghost"
            size="sm"
          />
        </Flex>

        <TabPanels>
          <TabPanel p={0}>
            <Box px={2} py={2} bg={bodyBg}>
              <ThemeProvider theme={theme}>
                <MaterialReactTable
                  columns={columns}
                  data={rows}
                  layoutMode="grid"
                  state={{ pagination }}
                  onPaginationChange={setPagination}
                  initialState={{ density: "compact" }}
                  muiTableProps={{ sx: { tableLayout: "fixed" } }}
                  muiTableContainerProps={{
                    sx: {
                      maxHeight: isFullscreen ? "calc(100vh - 160px)" : "230px",
                      overflowY: "auto",

                      // short screen → no horizontal slider
                      overflowX: isFullscreen ? "auto" : "hidden",
                    },
                  }}
                  enableColumnFilters={false}
                  enableGlobalFilter={false}
                  enableDensityToggle={false}
                  enableFullScreenToggle={false}
                />
              </ThemeProvider>
            </Box>
          </TabPanel>

          <TabPanel p={0}>
            <Box px={2} py={2} bg={bodyBg}>
              <StringGroupSummary />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
