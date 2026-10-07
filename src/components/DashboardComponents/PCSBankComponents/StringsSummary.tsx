import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  Tooltip,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { MdElectricBolt, MdLinkOff } from "react-icons/md";
import { ExpandIcon, SqeezIcon } from "../../../assets/Icons";
import WidgetTitle from "../../Common/WidgetTitle";

import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material/styles";

interface StringData {
  deviceId: string;
  stringId: string;
  status: string;
  voltage: number;
  current: number;
  soc: number;
  soe: number;
  dailyEnergy: number;
  totalEnergy: number;
  deltaV: number;
  balance: string;
}

type TrendType = "up" | "down" | "same";

const TrendArrow = ({ trend }: { trend: TrendType }) => {
  if (trend === "up")
    return (
      <Text color="green.500" fontSize="10px" fontWeight="700">
        ▲
      </Text>
    );

  if (trend === "down")
    return (
      <Text color="red.500" fontSize="10px" fontWeight="700">
        ▼
      </Text>
    );

  return (
    <Text color="gray.400" fontSize="10px" fontWeight="700">
      ▬
    </Text>
  );
};

const ValueBox = ({
  value,
  trend = "same",
}: {
  value: string | number;
  trend?: TrendType;
}) => (
  <HStack
    w="92px"
    h="28px"
    px={2}
    bg="white"
    border="1px solid #E5E7EB"
    borderRadius="8px"
    justifyContent="space-between"
    transition="all .25s ease"
    _hover={{
      transform: "translateY(-2px)",
      borderColor: "#93C5FD",
      boxShadow: "0 10px 20px rgba(59,130,246,.15)",
    }}
  >
    <Text fontSize="11px" fontWeight="600">
      {value}
    </Text>

    <TrendArrow trend={trend} />
  </HStack>
);

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.replace(/\/$/, "") || "";

interface Props {
  selectedDevice?: string;
  rackDevices?: Array<{ device_id: string }>;
  onRackSelect?: (rackId: string) => void;
}

const StringsSummary: React.FC<Props> = ({
  selectedDevice,
  rackDevices = [],
  onRackSelect,
}) => {
  const tableMode = useColorModeValue("light", "dark");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: tableMode,
        },
      }),
    [tableMode]
  );

  const title = useColorModeValue("#0F172A", "#F8FAFC");
  const [isShortScreen] = useMediaQuery("(max-width:900px)");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 6,
  });

  const [rows, setRows] = useState<StringData[]>([]);

  useEffect(() => {
    if (!selectedDevice) return;

    const fetchStrings = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/lastest-direct-data/multiple-latest-devices`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              device_id_patterns: ["_bank_bank_"],
            }),
          }
        );

        const result = await response.json();
        if (!result.success) return;

        const bankPrefix = selectedDevice ? `${selectedDevice}_` : "";
        const knownRackIds = new Set(rackDevices.map((device) => device.device_id));
        const getValue = (deviceData: any, keys: string[]) => {
          for (const key of keys) {
            const raw = deviceData?.[key];
            const value = raw && typeof raw === "object" ? raw.value : raw;
            if (value !== null && value !== undefined && value !== "") {
              return Number.isFinite(Number(value)) ? Number(value) : value;
            }
          }
          return 0;
        };

        const mappedRows = Object.entries(result.data || {})
          .filter(([deviceId]) => {
            if (!/_rack_rack_\d+$/i.test(deviceId)) return false;
            if (knownRackIds.size > 0 && !knownRackIds.has(deviceId)) return false;
            return !bankPrefix || deviceId.startsWith(bankPrefix);
          })
          .map(([deviceId, deviceData]: [string, any]) => {
            const rackMatch = deviceId.match(/rack_rack[_-]?(\d+)$/i);
            const stringMatch = deviceId.match(/(?:string|string_string)[_-]?(\d+)$/i);
            const fallbackMatch = deviceId.match(/(?:^|[._-])S(\d+)$/i);
            const stringId = rackMatch
              ? `R${String(rackMatch[1]).padStart(2, "0")}`
              : stringMatch
              ? `S${String(stringMatch[1]).padStart(2, "0")}`
              : fallbackMatch
                ? `S${String(fallbackMatch[1]).padStart(2, "0")}`
                : deviceId.split("_").pop() || deviceId;

            const timestamp = getValue(deviceData, ["Time_Stamp", "timestamp"]);
            const isConnected = timestamp
              ? Date.now() - new Date(String(timestamp)).getTime() < 10 * 60 * 1000
              : true;
            const deltaV = Number(getValue(deviceData, [
              "Delta_V",
              "delta_v",
              "delta_cell_voltage",
              "Cell_Voltage_Delta",
            ]));

            return {
              deviceId,
              stringId,
              status: isConnected ? "Connected" : "Disconnected",
              voltage: Number(getValue(deviceData, ["Voltage", "voltage", "BCU_1_Rack_voltage"])),
              current: Number(getValue(deviceData, ["Current", "current", "BCU_1_Rack_current"])),
              soc: Number(getValue(deviceData, ["SOC", "SoC", "BCU_1_SOC", "soc"])),
              soe: Number(getValue(deviceData, ["SOE", "SoE", "BCU_1_SOE", "soe"])),
              dailyEnergy: Number(getValue(deviceData, ["Daily_Energy", "daily_energy", "daily_active_energy_import"])),
              totalEnergy: Number(getValue(deviceData, ["Total_Energy", "total_energy", "Total_energy_charged"])),
              deltaV: Number.isFinite(deltaV) ? deltaV : 0,
              balance: Number.isFinite(deltaV) && deltaV > 20 ? "Balancing" : "Balanced",
            };
          });

        setRows(mappedRows);
      } catch (error) {
        console.error("Failed to fetch string summary:", error);
      }
    };

    fetchStrings();
    const interval = window.setInterval(fetchStrings, 60_000);
    return () => window.clearInterval(interval);
  }, [selectedDevice]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      panelRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  React.useEffect(() => {
    const fn = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", fn);

    return () => document.removeEventListener("fullscreenchange", fn);
  }, []);

  const allColumns = useMemo<MRT_ColumnDef<StringData>[]>(
    () => [
      {
        accessorKey: "stringId",
        header: "String ID",
        size: 70,
      },

      {
        accessorKey: "status",
        header: "Status",
        size: 110,
        Cell: ({ row }) => {
          const isConnected = /connected|running/i.test(row.original.status);
          const label = isConnected ? "Running" : "Disconnected";
          const iconColor = isConnected ? "#16A34A" : "orange";
          const bgColor = isConnected ? "#EAFBF0" : "#FFF7E6";

          return (
            <Box w="100%" display="flex" justifyContent="center" alignItems="center">
              <Tooltip
                label={label}
                placement="top"
                hasArrow
                openDelay={150}
                borderRadius="10px"
                bg="#0F172A"
                color="white"
                fontSize="11px"
                fontWeight="600"
                px={3}
                py={2}
                boxShadow="0 18px 45px rgba(15,23,42,.35)"
                border="1px solid rgba(255,255,255,.08)"
                arrowShadowColor="rgba(0,0,0,.35)"
                motionProps={{
                  initial: { opacity: 0, y: 8, scale: 0.9 },
                  animate: { opacity: 1, y: 0, scale: 1 },
                }}
              >
                <Box
                  w="24px"
                  h="24px"
                  borderRadius="full"
                  bg={bgColor}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                >
                  {isConnected ? (
                    <MdElectricBolt color={iconColor} size={13} />
                  ) : (
                    <MdLinkOff color={iconColor} size={12} />
                  )}
                </Box>
              </Tooltip>
            </Box>
          );
        },
      },

      {
        accessorKey: "voltage",
        header: "Voltage (V)",
        size: 95,
        Cell: ({ row }) => (
          <ValueBox value={`${row.original.voltage} V`} trend="up" />
        ),
      },

      {
        accessorKey: "current",
        header: "Current (A)",
        size: 95,
        Cell: ({ row }) => (
          <ValueBox value={`${row.original.current} A`} trend="down" />
        ),
      },

      {
        accessorKey: "soc",
        header: "SOC (%)",
        size: 90,
        Cell: ({ row }) => (
          <ValueBox value={`${row.original.soc}%`} trend="up" />
        ),
      },

      {
        accessorKey: "soe",
        header: "SOE (%)",
        size: 90,
        Cell: ({ row }) => (
          <ValueBox value={`${row.original.soe}%`} trend="same" />
        ),
      },

      {
        accessorKey: "dailyEnergy",
        header: "Daily Energy (kWh)",
        size: 110,
        Cell: ({ row }) => (
          <ValueBox value={`${row.original.dailyEnergy} kWh`} trend="up" />
        ),
      },

      {
        accessorKey: "totalEnergy",
        header: "Total Energy (kWh)",
        size: 110,
        Cell: ({ row }) => (
          <ValueBox value={`${row.original.totalEnergy} kWh`} trend="same" />
        ),
      },

      {
        accessorKey: "deltaV",
        header: "Delta V (mV)",
        size: 95,
        Cell: ({ row }) => (
          <ValueBox value={`${row.original.deltaV} mV`} trend="up" />
        ),
      },

      {
        accessorKey: "balance",
        header: "Balance Status",
        size: 110,
        Cell: ({ row }) => {
          const ok = row.original.balance === "Balanced";

          return (
            <Box
              px={2}
              py={0.5}
              borderRadius="999px"
              bg={ok ? "#ECFDF3" : "#FEF3C7"}
              color={ok ? "#15803D" : "#B45309"}
              fontWeight="700"
              fontSize="10px"
              display="inline-block"
            >
              {row.original.balance}
            </Box>
          );
        },
      },
    ],
    [title]
  );

  const columns = useMemo(() => {
    if (isFullscreen) return allColumns;

    return isShortScreen ? allColumns.slice(0, 5) : allColumns.slice(0, 8);
  }, [allColumns, isFullscreen, isShortScreen]);

  return (
    <Box
      ref={panelRef}
      w={isFullscreen ? "100%" : "93%"}
      maxW={isFullscreen ? "100%" : "93%"}
      minW={0}
      h={isFullscreen ? "100vh" : "344px"}
      display="flex"
      flexDirection="column"
      borderRadius="10px"
      overflow="hidden"
      bg={useColorModeValue("#FFFFFF", "#101820")}
      border="1px solid"
      borderColor={useColorModeValue("#E2E8F0", "#243244")}
    >
      {/* Header */}
      <Flex
        h="40px"
        px={3}
        align="center"
        justify="space-between"
        bg={useColorModeValue("#FFFFFF", "#111827")}
        borderBottom="1px solid"
        borderColor={useColorModeValue("#EEF2F7", "whiteAlpha.100")}
      >
        <HStack spacing={2}>
          

          <Box lineHeight={1}>
            <WidgetTitle>Strings Summary</WidgetTitle>

            <Text fontSize="10px" color="gray.500">
              Battery string performance overview
            </Text>
          </Box>
        </HStack>

        <HStack spacing={2}>
          <Box
            px={2}
            py={1}
            bg="#F4F8FF"
            borderRadius="12px"
            border="1px solid #E5EEFF"
          >
            <Text fontSize="11px">
              Total :
              <Text as="span" ml={1} color="#2563EB" fontWeight="700">
                {rows.length}
              </Text>
            </Text>
          </Box>

          <Button size="xs" variant="ghost" onClick={toggleFullscreen}>
            {isFullscreen ? <SqeezIcon /> : <ExpandIcon />}
          </Button>

          <InfoOutlineIcon color="gray.500" boxSize={4} />
        </HStack>
      </Flex>

      <Box
        flex={1}
        minW={0}
        minH={0}
        w="100%"
        maxW="100%"
        overflow="hidden"
      >
        <ThemeProvider theme={theme}>
          <MaterialReactTable
            columns={columns}
            data={rows}
            enableTopToolbar={false}
            enableBottomToolbar
            enableColumnActions={false}
            enableColumnFilters={false}
            enableSorting={false}
            enableDensityToggle={false}
            enableHiding={false}
            enableFullScreenToggle={false}
            enablePagination
            layoutMode="grid"
            state={{
              pagination,
            }}
            onPaginationChange={setPagination}
            muiTablePaperProps={{
              sx: {
                perspective: "1600px",
                transformStyle: "preserve-3d",
                position: "relative",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                borderRadius: "18px",
                boxShadow: "0 28px 80px rgba(15,23,42,.18)",
                background:
                  "linear-gradient(180deg,#F8FAFC 0%,#E2E8F0 100%)",
                transition: "all .25s ease",

                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at top center,rgba(255,255,255,.18),transparent 30%)",
                  pointerEvents: "none",
                },

                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 34px 90px rgba(15,23,42,.22)",
                },
              },
            }}
            muiTableContainerProps={{
              sx: {
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
                perspective: "1600px",
                transformStyle: "preserve-3d",
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                overflowX: isFullscreen ? "auto" : "hidden",

                "& .MuiTableHead-root": {
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                  background: "#F8FAFC",
                  boxShadow: "0 10px 25px rgba(15,23,42,.08)",
                },

                "& .MuiTableBody-root .MuiTableRow-root": {
                  background: "#FFFFFF",
                  transition:
                    "transform .25s ease, box-shadow .25s ease, background .25s ease",
                  transform: "translateZ(0)",
                  boxShadow: "0 2px 8px rgba(15,23,42,.04)",
                },

                "& .MuiTableBody-root .MuiTableRow-root:hover": {
                  transform: "translateY(-3px) translateZ(8px)",
                  boxShadow: "0 10px 24px rgba(15,23,42,.14)",
                  background: "#FFFFFF",
                },
              },
            }}
            muiTableProps={{
              sx: {
                tableLayout: "fixed",
                width: "100%",
                minWidth: "100%",
                maxWidth: "100%",
                borderCollapse: "collapse",
                "& th, & td": {
                  boxSizing: "border-box",
                },
              },
            }}
            muiTableBodyRowProps={({ row }) => ({
              onClick: () => {
                if (row.original.deviceId) {
                  onRackSelect?.(row.original.deviceId);
                }
              },
              sx: {
                cursor: "pointer",

                "& td": {
                  borderBottom: "1px solid #E5E7EB",
                  background: "transparent",
                  transition: "background .25s ease",
                },

                "&:hover td": {
                  background: "transparent",
                },
              },
            })}
            muiTableHeadCellProps={{
              align: "center",
              sx: {
                background: "#F8FAFC",
                color: "#0F172A",
                fontSize: "13px",
                fontWeight: 700,
                borderBottom: "1px solid #E5E7EB",
                textAlign: "center",
                py: "6px",
                height: "38px",

                "& .Mui-TableHeadCell-Content": {
                  justifyContent: "center",
                },

                "& .MuiTableCell-root": {
                  width: "auto",
                  maxWidth: "none",
                },
              },
            }}
            muiTableBodyCellProps={{
              align: "center",
              sx: {
                fontSize: "12px",
                py: "4px",
                height: "36px",
                minHeight: "36px",
                borderBottom: "1px solid #F1F5F9",
                textAlign: "center",
              },
            }}
            muiBottomToolbarProps={{
              sx: {
                minHeight: "34px",

                "& .MuiTablePagination-root": {
                  minHeight: "34px",
                  marginTop: "-10px",
                },

                "& .MuiTablePagination-toolbar": {
                  minHeight: "34px",
                  padding: "0 6px",
                },

                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-selectRoot, & .MuiTablePagination-displayedRows": {
                  fontSize: "11px",
                },

                "& .MuiTablePagination-selectRoot": {
                  display: "none",
                },

                "& .MuiIconButton-root": {
                  padding: "2px",
                },
              },
            }}
            muiPaginationProps={{
              rowsPerPageOptions: [8, 15, 25],
              showRowsPerPage: false,
              showFirstButton: true,
              showLastButton: true,
            }}
            positionPagination="bottom"
          />
        </ThemeProvider>
      </Box>
    </Box>
  );
};

export default StringsSummary;