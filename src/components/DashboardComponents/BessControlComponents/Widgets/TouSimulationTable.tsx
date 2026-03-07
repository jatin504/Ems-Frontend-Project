import React, { useMemo, useState, useRef, useEffect } from "react";
import { Box, Text, IconButton } from "@chakra-ui/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { FiMaximize, FiMinimize } from "react-icons/fi";

interface Props {
  timelineData?: any[];
}

export default function TouSimulationTable({ timelineData = [] }: Props) {

  const panelRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 4,
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
      pageSize: isFullscreen ? 15 : 4,
    });
  }, [isFullscreen]);

  const theme = useMemo(() => createTheme({ palette: { mode: "light" } }), []);

  /* ===== ALL COLUMNS ===== */

  const allColumns = useMemo<MRT_ColumnDef<any>[]>((
    () => [
      { accessorKey: "start", header: "Start" },
      { accessorKey: "end", header: "End" },
      { accessorKey: "state", header: "Window" },
      { accessorKey: "action", header: "Action" },
      { accessorKey: "price", header: "Price" },
      { accessorKey: "duration_hours", header: "Duration (h)" },
      { accessorKey: "energy_charged_kwh", header: "Energy Charged" },
      { accessorKey: "energy_discharged_kwh", header: "Energy Discharged" },
      { accessorKey: "soc_before_percent", header: "SOC Before %" },
      { accessorKey: "soc_after_percent", header: "SOC After %" },
    ].map(col => ({
      ...col,
      Cell: ({ cell }: any) => (
        <Text fontSize="10px" whiteSpace="nowrap">
          {cell.getValue() ?? "-"}
        </Text>
      )
    }))
  ), []);

  /* NORMAL MODE → 3 columns */

  const columns = useMemo(
    () => (isFullscreen ? allColumns : allColumns.slice(0, 3)),
    [isFullscreen, allColumns]
  );

  return (
    <Box ref={panelRef} width="100%">

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
          state={{ pagination }}
          onPaginationChange={setPagination}

          muiTableHeadCellProps={{
            align: "center",
            sx: {
              textAlign: "center",
              whiteSpace: "nowrap",
              fontSize: "12px",
              fontWeight: 600,
            },
          }}

          muiTableBodyCellProps={{
            align: "center",
            sx: {
              textAlign: "center",
              whiteSpace: "nowrap",
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