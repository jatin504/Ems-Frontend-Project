import { useMemo, useState, useRef, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
} from "material-react-table";

import {
  Box,
  Button,
  Flex,
  Text,
  Tooltip,
  useColorModeValue,
  useMediaQuery,
  IconButton,
  HStack,
} from "@chakra-ui/react";

import Papa from "papaparse";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { FiMaximize, FiMinimize } from "react-icons/fi";

// NORMALIZE ROWS
const normalizeRows = (data: any, keysCfg: any[]) => {
  const rows: any[] = [];

  if (Array.isArray(data)) return data;
  if (!data) return rows;

  Object.entries(data).forEach(([devId, devData]: any) => {
    const row: any = { device: devId };

    if (keysCfg.length > 0) {
      keysCfg.forEach((kCfg) => {
        const possibleKeys = [kCfg.key, kCfg.alias].filter(Boolean);
        let series = undefined;

        for (const p of possibleKeys) {
          if (devData[p] !== undefined) {
            series = devData[p];
            break;
          }
        }

        if (Array.isArray(series) && series.length > 0) {
          const last = series[series.length - 1];
          row[kCfg.key] = last?.value ?? last?.v ?? null;
          row[kCfg.key + "_ts"] = last?.ts ?? null;
        } else if (series && typeof series === "object") {
          row[kCfg.key] = series.value ?? series.v ?? null;
          row[kCfg.key + "_ts"] = series.ts ?? null;
        } else {
          row[kCfg.key] = null;
          row[kCfg.key + "_ts"] = null;
        }
      });
    } else {
      Object.entries(devData).forEach(([propKey, series]: [string, any]) => {
        if (Array.isArray(series) && series.length > 0) {
          const last = series[series.length - 1];
          row[propKey] = last?.value ?? last?.v ?? last ?? null;
          row[`${propKey}_ts`] = last?.ts ?? last?.timestamp ?? null;
        } else if (series && typeof series === "object") {
          row[propKey] = series.value ?? series.v ?? null;
          row[`${propKey}_ts`] = series.ts ?? series.timestamp ?? null;
        } else {
          row[propKey] = series;
          row[`${propKey}_ts`] = null;
        }
      });
    }

    rows.push(row);
  });

  // Always sort by device in ASC order using natural sort
  return rows.sort((a, b) => {
    const aDevice = String(a.device || "");
    const bDevice = String(b.device || "");
    return aDevice.localeCompare(bDevice, undefined, { numeric: true, sensitivity: 'base' });
  });
};

// STATUS DOT LOGIC (UNCHANGED)
const computeStatus = (
  row: any,
  statusKey: string,
  staleThresholdSeconds: number
) => {
  const now = Date.now();
  const ts = row[`${statusKey}_ts`];

  if (ts && now - Number(ts) > staleThresholdSeconds * 1000) {
    return { color: "gray", reason: "stale" };
  }

  const v = Number(row[statusKey]);
  if (!isNaN(v)) {
    if (v > 0) return { color: "green", reason: "gt_zero" };
    if (v === 0) return { color: "red", reason: "zero" };
  }

  return { color: "green", reason: "truthy" };
};

// TABLE CONTENT COMPONENT - Rendered inside ThemeProvider
const TableContent = ({
  columns,
  rows,
  pagination,
  setPagination,
  isFullscreen,
  toggleFullscreen,
}: any) => {
  const tableConfig = {
    columns,
    data: rows,
    enablePagination: true,
    enableRowVirtualization: false,
    enableStickyHeader: true,
    state: { pagination },
    onPaginationChange: setPagination,
    enableFullScreenToggle: false,
    enableDensityToggle: true,
    muiPaginationProps: {
      rowsPerPageOptions: [5, 10, 15, 20],
      showFirstButton: true,
      showLastButton: true,
    },
    renderTopToolbarCustomActions: () => (
      <Box w="100%" display="flex" justifyContent="flex-end" pr={2}>
        <IconButton
          variant="ghost"
          aria-label="Toggle fullscreen"
          icon={isFullscreen ? <FiMinimize /> : <FiMaximize />}
          onClick={toggleFullscreen}
          size="lg"
          mt={3}
        />
      </Box>
    ),
  } as any;

  const table = useMaterialReactTable(tableConfig);

  return <MaterialReactTable table={table} />;
};

// MAIN COMPONENT
const AdvanceTableWidgetRenderer_MRT = ({ config, data }: any) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const [isShortScreen] = useMediaQuery("(max-width: 900px)");

  const panelRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      panelRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(() => {
    setPagination({
      pageIndex: 0,
      pageSize: isFullscreen ? 15 : isShortScreen ? 5 : 5,
    });
  }, [isFullscreen, isShortScreen]);

  const keysCfg = config?.dataSource?.keys || [];
  const statusKey = config?.dataSource?.statusKey || keysCfg[0]?.key;
  const staleThreshold =
    config?.dataSource?.staleThresholdSeconds || 300;

  const tableData = data || {};

  const rows = useMemo(
    () => normalizeRows(tableData, keysCfg),
    [tableData, keysCfg]
  );

  const statusCache = useMemo(() => new Map(), []);

  const getStatus = (row: any) => {
    const key = row.device;
    if (statusCache.has(key)) return statusCache.get(key);

    const st = computeStatus(row, statusKey, staleThreshold);
    statusCache.set(key, st);
    return st;
  };

  // BUILD COLUMNS
  const columns = useMemo<MRT_ColumnDef<any>[]>(() => {
    const cols: MRT_ColumnDef<any>[] = [
      {
        accessorKey: "device",
        header: "Device",
      },
      {
        id: "status",
        header: "Status",
        size: 60,
        muiTableHeadCellProps: {
          align: "center",
        },
        muiTableBodyCellProps: {
          align: "center",
          sx: {
            padding: "0 !important",
          },
        },
        Cell: ({ row }) => {
          const st = getStatus(row.original);
          const color =
            st.color === "green"
              ? "#5EDA70"
              : st.color === "red"
              ? "#FF4646"
              : "#A0AEC0";

          return (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="100%"
              h="100%"
            >
              <Box
                w="12px"
                h="12px"
                borderRadius="50%"
                bg={color}
              />
            </Box>
          );
        },
      },
    ];

    keysCfg.forEach((k) =>
      cols.push({
        accessorKey: k.key,
        header: k.label || k.key,
      })
    );

    return cols;
  }, [keysCfg, statusKey, staleThreshold]);

  const theme = createTheme({
    palette: { 
      mode: "light",
    },
  });

  return (
    <Box
      ref={panelRef}
      w="100%"
      h="100%"
      minH="300px"
      bg={bgColor}
      overflow="auto"
    >
      <ThemeProvider theme={theme}>
        <TableContent
          columns={columns}
          rows={rows}
          pagination={pagination}
          setPagination={setPagination}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
        />
      </ThemeProvider>
    </Box>
  );
};

export default AdvanceTableWidgetRenderer_MRT;
