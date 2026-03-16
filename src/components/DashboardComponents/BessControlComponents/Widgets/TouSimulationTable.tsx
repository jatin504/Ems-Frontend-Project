import { useMemo, useState, useRef, useEffect } from "react";
import { Box, Text, IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { FiMaximize, FiMinimize } from "react-icons/fi";

interface Props {
  timelineData?: any[];
  summary?: {
    energy_cost: number;
    energy_revenue: number;
    net_profit: number;
    initial_soc: number;
    final_soc: number;
    total_charge_kwh: number;
    total_discharge_kwh: number;
  };
}

export default function TouSimulationTable({
  timelineData = [],
  summary,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { colorMode } = useColorMode();
  const cardBorder = useColorModeValue("#e6e9ef", "#24303a");
  const tickerBg = useColorModeValue("#f8fafc", "#1a202c");
  const tickerText = useColorModeValue("gray.800", "gray.200");

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
    () => createTheme({ palette: { mode: colorMode } }),
    [colorMode]
  );

  /* ===== ALL COLUMNS ===== */

  const allColumns = useMemo<MRT_ColumnDef<any>[]>(() =>
    [
      { accessorKey: "start", header: "Start" },
      { accessorKey: "end", header: "End" },
      { accessorKey: "state", header: "Window" },
      { accessorKey: "action", header: "Action" },
      { accessorKey: "price", header: "Price" },
      { accessorKey: "duration_hours", header: "Duration" },
      { accessorKey: "energy_charged_kwh", header: "Energy Charged" },
      { accessorKey: "energy_discharged_kwh", header: "Energy Discharged" },
      { accessorKey: "soc_before_percent", header: "SOC Before" },
      { accessorKey: "soc_after_percent", header: "SOC After" },
    ].map((col) => ({
      ...col,

      size: 90,
      minSize: 70,
      maxSize: 100,

      Cell: ({ cell }: any) => (
        <Text fontSize="10px" whiteSpace="nowrap">
          {cell.getValue() ?? "-"}
        </Text>
      ),
    })),
  []);

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


          muiTableProps={{
            sx: {
              tableLayout: "fixed",
            },
          }}

          muiTableContainerProps={{
            sx: {
              height: isFullscreen ? "calc(100vh - 120px)" : 200,
              maxHeight: isFullscreen ? "calc(100vh - 120px)" : 200,
              overflowY: "auto",
              overflowX: "hidden",
              border: `1px solid ${cardBorder}`,
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
              Energy Cost: ₹{summary.energy_cost}
            </Text>

            <Text as="span" fontSize="11px" mr={8} color={tickerText}>
              Revenue: ₹{summary.energy_revenue}
            </Text>

            <Text as="span" fontSize="11px" mr={8} color={tickerText}>
              Net Profit: ₹{summary.net_profit}
            </Text>

            <Text as="span" fontSize="11px" color={tickerText}>
              Discharge: {summary.total_discharge_kwh} kWh
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
}