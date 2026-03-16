import React, { useMemo, useState, useEffect, useRef } from "react";
import { Box, Text, IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
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
  summary?: {
    initial_soc: number;
    final_soc: number;
    total_energy_discharged: number;
    windows_simulated: number;
  };
}

const PeakShavingTable: React.FC<PeakShavingTableProps> = ({
  timelineData = [],
  summary,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const { colorMode } = useColorMode();
  const cardBorder = useColorModeValue("#e6e9ef", "#24303a");
  const tickerBg = useColorModeValue("#f8fafc", "#1a202c");
  const tickerText = useColorModeValue("gray.800", "gray.200");

  const [isFullscreen, setIsFullscreen] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 6,
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
      pageSize: isFullscreen ? 15 : 6,
    });
  }, [isFullscreen]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode: colorMode },
      }),
    [colorMode]
  );

  /* ===== ALL COLUMNS ===== */

  const allColumns = useMemo<MRT_ColumnDef<TimelineItem>[]>(() => [
    {
      accessorKey: "start",
      header: "Start",

      size: 90,
      minSize: 70,
      maxSize: 100,

      Cell: ({ cell }) => {
        const d = new Date(cell.getValue<string>());
        return (
          <Text fontSize="10px">
            {d.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        );
      },
    },
    {
      accessorKey: "end",
      header: "End",

      size: 90,
      minSize: 70,
      maxSize: 100,

      Cell: ({ cell }) => {
        const d = new Date(cell.getValue<string>());
        return (
          <Text fontSize="10px">
            {d.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        );
      },
    },
    {
      accessorKey: "window_state",
      header: "Window",
      size: 90,
      minSize: 70,
      maxSize: 100,
    },
    {
      accessorKey: "action",
      header: "Action",
      size: 90,
      minSize: 70,
      maxSize: 100,
    },
    {
      accessorKey: "load",
      header: "Load",
      size: 90,
      minSize: 70,
      maxSize: 100,
    },
    {
      accessorKey: "duration_hours",
      header: "Duration",
      size: 90,
      minSize: 70,
      maxSize: 100,
    },
    {
      accessorKey: "p_max_kw",
      header: "P Max",
      size: 90,
      minSize: 70,
      maxSize: 100,
    },
    {
      accessorKey: "energy_charged_kwh",
      header: "Energy Charged",
      size: 90,
      minSize: 70,
      maxSize: 100,
    },
    {
      accessorKey: "energy_used_kwh",
      header: "Energy Used",
      size: 90,
      minSize: 70,
      maxSize: 100,
    },
    {
      accessorKey: "dynamic_threshold_kw",
      header: "Threshold",
      size: 90,
      minSize: 70,
      maxSize: 100,
    },
    {
      accessorKey: "soc_before_percent",
      header: "SOC Before",
      size: 90,
      minSize: 70,
      maxSize: 100,
      Cell: ({ cell }) => <Text fontSize="10px">{cell.getValue<number>()}%</Text>,
    },
    {
      accessorKey: "soc_after_percent",
      header: "SOC After",
      size: 90,
      minSize: 70,
      maxSize: 100,
      Cell: ({ cell }) => <Text fontSize="10px">{cell.getValue<number>()}%</Text>,
    },
    {
      accessorKey: "shortfall_kwh",
      header: "Shortfall",
      size: 90,
      minSize: 70,
      maxSize: 100,
    },
    {
      accessorKey: "soft_limit_kw",
      header: "Soft Limit",
      size: 90,
      minSize: 70,
      maxSize: 100,
    },
  ], []);

  /* ===== NORMAL VIEW → 6 COLUMNS ===== */

  const columns = useMemo(
    () => (isFullscreen ? allColumns : allColumns.slice(0, 6)),
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
          layoutMode="grid-no-grow"
          enablePagination

          state={{ pagination }}
          onPaginationChange={setPagination}

          muiTableHeadCellProps={{
            align: "center",
            sx: {
              textAlign: "center",
              whiteSpace: "nowrap",
              py: 0.25,
              px: 0.5,
              fontSize: "8.5px",
            },
          }}

          muiTableBodyCellProps={{
            align: "center",
            sx: {
              textAlign: "center",
              whiteSpace: "nowrap",
              py: 0.25,
              px: 0.5,
              fontSize: "10px",
            },
          }}

          muiTableRowProps={{
            sx: {
              height: 26,
            },
          }}

          muiTableProps={{
            sx: {
              tableLayout: "fixed",
            },
          }}

          muiTableContainerProps={{
            sx: {
              height: isFullscreen ? "calc(100vh - 120px)" : 190,
              maxHeight: isFullscreen ? "calc(100vh - 120px)" : 190,
              overflowY: "auto",
              overflowX: "hidden",
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

      {summary && (
        <Box
          mt="4px"
          height="20px"
          overflow="hidden"
          borderTop={`1px solid ${cardBorder}`}
          bg={tickerBg}
          position="relative"
        >
          <Box
            position="absolute"
            whiteSpace="nowrap"
            sx={{
              animation: "tickerMove 18s linear infinite",
            }}
          >
            <Text as="span" fontSize="11px" mr={8} color={tickerText}>
              Initial SOC: {summary.initial_soc}%
            </Text>

            <Text as="span" fontSize="11px" mr={8} color={tickerText}>
              Final SOC: {summary.final_soc}%
            </Text>

            <Text as="span" fontSize="11px" mr={8} color={tickerText}>
              Energy Discharged: {summary.total_energy_discharged} kWh
            </Text>

            <Text as="span" fontSize="11px" color={tickerText}>
              Windows Simulated: {summary.windows_simulated}
            </Text>
          </Box>

          <style>
            {`
              @keyframes tickerMove {
                0% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
              }
            `}
          </style>
        </Box>
      )}
    </Box>
  );
};

export default PeakShavingTable;