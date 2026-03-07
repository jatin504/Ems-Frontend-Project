import React, { useMemo, useState, useRef, useEffect } from "react";
import { Box, Text, IconButton } from "@chakra-ui/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { FiMaximize, FiMinimize } from "react-icons/fi";

interface CappedDynamicTableProps {
  timelineData?: any[];
}

export default function CappedDynamicTable({
  timelineData = [],
}: CappedDynamicTableProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  /* ✅ pagination state */
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

  /* fullscreen detect */
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  /* ✅ change rows when fullscreen changes */
  useEffect(() => {
    setPagination({
      pageIndex: 0,
      pageSize: isFullscreen ? 15 : 4,
    });
  }, [isFullscreen]);

  const theme = useMemo(() => createTheme({ palette: { mode: "light" } }), []);

  /* ===== ALL COLUMNS FROM API ===== */

  const allColumns = useMemo<MRT_ColumnDef<any>[]>(() => {
    if (!timelineData.length) return [];

    const keys = Object.keys(timelineData[0]);

    return keys.map((key) => ({
      accessorKey: key,
      header: key.replaceAll("_", " ").toUpperCase(),
      Cell: ({ cell }: any) => (
        <Text fontSize="10px" whiteSpace="nowrap">
          {cell.getValue() ?? "-"}
        </Text>
      ),
    }));
  }, [timelineData]);

  /* ===== NORMAL VIEW → 3 COLUMNS ===== */

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

          /* ✅ controlled pagination */
          state={{ pagination }}
          onPaginationChange={setPagination}

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