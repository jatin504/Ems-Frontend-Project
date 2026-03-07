import React, { useMemo, useState, useRef, useEffect } from "react";
import { Box, Text, IconButton } from "@chakra-ui/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { FiMaximize, FiMinimize } from "react-icons/fi";

export type TimelineItem = {
  action: string;
  start: string;
  end: string;
  window_state: string;
  load: number;
  duration_hours: number;
  p_max_kw: number;
  energy_charged_kwh: number;
  energy_used_kwh: number;
  dynamic_threshold_kw: number | null;
  soc_before_percent: number;
  soc_after_percent: number;
  shortfall_kwh: number;
  soft_limit_kw: number | null;
};

interface PeakShavingTableProps {
  timelineData?: TimelineItem[];
}

export default function PeakShavingTable({
  timelineData = [],
}: PeakShavingTableProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const theme = useMemo(() => createTheme({ palette: { mode: "light" } }), []);

  /* ================= ALL COLUMNS ================= */

  const allColumns = useMemo<MRT_ColumnDef<TimelineItem>[]>(
    () => [
      {
        accessorKey: "start",
        header: "Start",
        Cell: ({ cell }) => (
          <Text fontSize="10px" whiteSpace="nowrap">
            {cell.getValue<string>()}
          </Text>
        ),
      },
      {
        accessorKey: "end",
        header: "End",
        Cell: ({ cell }) => (
          <Text fontSize="10px" whiteSpace="nowrap">
            {cell.getValue<string>()}
          </Text>
        ),
      },
      { accessorKey: "window_state", header: "Window" },
      { accessorKey: "action", header: "Action" },
      { accessorKey: "load", header: "Load (kW)" },
      { accessorKey: "duration_hours", header: "Duration (h)" },
      { accessorKey: "p_max_kw", header: "P Max (kW)" },
      { accessorKey: "energy_charged_kwh", header: "Energy Charged" },
      { accessorKey: "energy_used_kwh", header: "Energy Used" },
      {
        accessorKey: "dynamic_threshold_kw",
        header: "Threshold",
        Cell: ({ cell }) => (
          <Text fontSize="10px">{cell.getValue<number>() ?? "-"}</Text>
        ),
      },
      {
        accessorKey: "soc_before_percent",
        header: "SOC Before",
        Cell: ({ cell }) => (
          <Text fontSize="10px">{cell.getValue<number>()}%</Text>
        ),
      },
      {
        accessorKey: "soc_after_percent",
        header: "SOC After",
        Cell: ({ cell }) => (
          <Text fontSize="10px">{cell.getValue<number>()}%</Text>
        ),
      },
      { accessorKey: "shortfall_kwh", header: "Shortfall" },
      {
        accessorKey: "soft_limit_kw",
        header: "Soft Limit",
        Cell: ({ cell }) => (
          <Text fontSize="10px">{cell.getValue<number>() ?? "-"}</Text>
        ),
      },
    ],
    []
  );

  /* ===== NORMAL VIEW -> 3 COLUMNS ===== */

  const columns = useMemo(
    () => (isFullscreen ? allColumns : allColumns.slice(0, 3)),
    [isFullscreen, allColumns]
  );

  return (
    <Box ref={panelRef} width="100%">
      {/* FULLSCREEN BUTTON */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <IconButton
          aria-label="fullscreen"
          size="xs"
          icon={isFullscreen ? <FiMinimize /> : <FiMaximize />}
          onClick={toggleFullscreen}
        />
      </Box>

      <ThemeProvider theme={theme}>
        <MaterialReactTable
          columns={columns}
          data={timelineData}
          enablePagination
          initialState={{
            pagination: { pageIndex: 0, pageSize: isFullscreen ? 10 : 4 },
          }}
          muiTableHeadCellProps={{
            align: "center",
            sx: {
              textAlign: "center",
              whiteSpace: "nowrap",
              py: 1,
              px: 1,
              fontSize: "12px",
              fontWeight: 600,
            },
          }}
          muiTableBodyCellProps={{
            align: "center",
            sx: {
              textAlign: "center",
              whiteSpace: "nowrap",
              py: 0.75,
              px: 1,
              fontSize: "10px",
            },
          }}
          muiTableContainerProps={{
            sx: {
              height: isFullscreen ? "calc(100vh - 120px)" : 150,
              maxHeight: isFullscreen ? "calc(100vh - 120px)" : 150,
              overflowY: "auto",
              overflowX: isFullscreen ? "auto" : "hidden",
              border: "1px solid #e6e9ef",
              borderRadius: "8px",
            },
          }}
          enableGlobalFilter={false}
          enableColumnFilters={false}
          enableFilters={false}
          enableColumnActions={false}
          enableDensityToggle={false}
          enableHiding={false}
          enableTopToolbar={false}
          enableFullScreenToggle={false}
        />
      </ThemeProvider>
    </Box>
  );
}