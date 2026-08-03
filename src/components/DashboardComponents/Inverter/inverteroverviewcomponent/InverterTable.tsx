import { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import WidgetTitle from "../../../Common/WidgetTitle";
import { useNavigate } from "react-router-dom";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMediaQuery } from "@chakra-ui/react";
import { MdElectricBolt, MdLinkOff } from "react-icons/md";
import { SqeezIcon, ExpandIcon } from "../../../../assets/Icons";

/* ================= TYPES ================= */

interface InverterData {
  deviceId: string;
  name: string;
  status: any;
  rawData?: any;
  [key: string]: any;
}

/* ================= COMPONENT ================= */

type TrendType = "up" | "down" | "same";

const TrendArrow = ({ trend }: { trend: TrendType }) => {
  if (trend === "up") {
    return (
      <Text color="green.500" fontWeight="700">
        ▲
      </Text>
    );
  }

  if (trend === "down") {
    return (
      <Text color="red.500" fontWeight="700">
        ▼
      </Text>
    );
  }

  return (
    <Text color="gray.400" fontWeight="700">
      ▬
    </Text>
  );
};

export default function InvertersPanel() {
  const navigate = useNavigate();
  const [isShortScreen] = useMediaQuery("(max-width: 900px)");
  const { colorMode } = useColorMode();
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
  const previousValues = useRef<Record<string, number>>({});
  const [trendMap, setTrendMap] = useState<Record<string, TrendType>>({});
  // modal removed; no selected inverter state required

  const [isFullscreen, setIsFullscreen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  /* ===== PAGINATION STATE ===== */
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: isShortScreen ? 4 : 15,
  });

  /* ---------- backend key map (use lowercase API keys) ---------- */

  const INVERTER_COLUMNS = [
    "Active Power",
    "Reactive Power",
    "Daily Energy",
    "Power (kVA)",
    "DC Voltage",
    "DC Power",
    "AC Current L1",
    "AC Current L2",
    "AC Current L3",
    "PF",
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
    "Power (kVA)": "apparent_power",
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
        pageSize: 15,
      }));
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);

      // NORMAL 5 ROWS
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
        pageSize: isShortScreen ? 4 : 15,
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
        pageSize: fs ? 20 : (isShortScreen ? 4 : 15),
      }));
    };

    document.addEventListener("fullscreenchange", fn);
    return () => document.removeEventListener("fullscreenchange", fn);
  }, [isShortScreen]);

  useEffect(() => {
    if (!isFullscreen) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
        pageSize: isShortScreen ? 4 : 15,
      }));
    }
  }, [isShortScreen, isFullscreen]);

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
    const trends: Record<string, TrendType> = {};

    Object.entries(dataMap).forEach(([deviceId, d]: any) => {
      const suffix = deviceId.match(/_(\d+)$/)?.[1];
      const name = suffix ? `Inverter-${suffix}` : deviceId;
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

        const trendKey = `${deviceId}_${key}`;

        const current = Number(value);
        const previous = previousValues.current[trendKey];

        if (!Number.isNaN(current)) {
          if (previous === undefined) {
            trends[trendKey] = "same";
          } else if (current > previous) {
            trends[trendKey] = "up";
          } else if (current < previous) {
            trends[trendKey] = "down";
          } else {
            trends[trendKey] = "same";
          }

          previousValues.current[trendKey] = current;
        }

        row[key] =
          value !== null && value !== undefined && value !== ""
            ? `${value} ${unit}`.trim()
            : "--";
      });

      mapped.push(row);
    });

    setTrendMap(trends);
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
      size: isShortScreen ? 80 : 120,
      minSize: isShortScreen ? 80 : 120,
      maxSize: isShortScreen ? 80 : 120,
      muiTableHeadCellProps: { align: "center", sx: { textAlign: "center", padding: "0 !important", fontSize: "11px" } },
      muiTableBodyCellProps: { align: "center", sx: { textAlign: "center", padding: "0 !important", fontSize: "11px" } },
      Cell: ({ row }) => {
        return (
          <Text
            w="100%"
            fontSize="11px"
            fontWeight={500}
            textAlign="center"
            color="#2563EB"
            style={{ cursor: "pointer", textDecoration: "underline" }}
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
      size: isShortScreen ? 88 : 110,
      minSize: isShortScreen ? 88 : 110,
      maxSize: isShortScreen ? 88 : 110,
      muiTableHeadCellProps: { sx: { textAlign: "left", pl: 1, fontSize: "11px" } },
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
            <Box w="100%" h="100%" display="flex" justifyContent="center" alignItems="center">
              <Tooltip
                label="Non-Comm"
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
                  bg="#FFF7E6"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                >
                  <MdLinkOff color="orange" size={12} />
                </Box>
              </Tooltip>
            </Box>
          );
        }

        if (activePower > 0) {
          return (
            <Box w="100%" h="100%" display="flex" justifyContent="center" alignItems="center">
              <Tooltip
                label="Running"
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
                  bg="#EAFBF0"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                >
                  <MdElectricBolt color="#16A34A" size={13} />
                </Box>
              </Tooltip>
            </Box>
          );
        }

        return (
          <Box w="100%" h="100%" display="flex" justifyContent="center" alignItems="center">
            <Tooltip
              label="Stop"
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
                bg="#FDECEC"
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
              >
                <MdElectricBolt color="red" size={13} />
              </Box>
            </Tooltip>
          </Box>
        );
      },
    },
    ...INVERTER_COLUMNS.map((key) => ({
      accessorKey: key,
      header: key,
      size: isShortScreen ? 88 : 110,
      minSize: isShortScreen ? 88 : 110,
      maxSize: isShortScreen ? 88 : 110,
      Cell: ({ row, cell }: { row: any; cell: any }) => {
        const trend = trendMap[`${row.original.deviceId}_${key}`] ?? "same";
        return (
          <HStack
            key={`${colorMode}-${row.original.deviceId}-${key}`}
            w="100%"
            minW="0"
            maxW="100%"
            h="28px"
            px={2}
            spacing={2}
            bg={colorMode === "dark" ? "#000000" : "#FFFFFF"}
            borderRadius="8px"
            border={
              colorMode === "dark"
                ? "1px solid #2D3748"
                : "1px solid #E5E7EB"
            }
            justifyContent="space-between"
            alignItems="center"
            overflow="hidden"
            transition=".25s"
            _hover={{
              borderColor: "#94A3B8",
              boxShadow: "0 8px 18px rgba(15,23,42,.08)",
            }}
          >
            <Text
              color={colorMode === "dark" ? "#FFFFFF" : "#000000"}
              fontWeight="600"
              fontSize={isShortScreen ? "9px" : "11px"}
              noOfLines={1}
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {cell.getValue() as string}
            </Text>
            <TrendArrow trend={trend} />
          </HStack>
        );
      },
    })),
  ];

  const columns = useMemo(
    () => (isFullscreen ? allColumns : allColumns.slice(0, 7)),
    [isFullscreen, colorMode, isShortScreen, trendMap]
  );

  /* ================= RENDER ================= */

  const borderColor = useColorModeValue("#EEF2F7", "whiteAlpha.200");
  const headerBg = useColorModeValue("#FFFFFF", "#111827");
  const textColor = useColorModeValue("#0F172A", "#F9FAFB");
  const subTextColor = useColorModeValue("gray.500", "gray.300");
  const tableTextColor = useColorModeValue("#0F172A", "#F8FAFC");
  const totalBoxBg = useColorModeValue("#F4F8FF", "rgba(255,255,255,0.08)");
  const totalBoxBorder = useColorModeValue("1px solid #E5EEFF", "1px solid rgba(255,255,255,0.12)");
  const totalBoxText = useColorModeValue("#0F172A", "#F8FAFC");

  return (
    <Box
      ref={panelRef}
      w="760px"
      h="600px"
      bg={bodyBg}
      overflow="hidden"
      border="1px solid"
      borderColor={borderColor}
      display="flex"
      flexDirection="column"
    >
      <HStack
        justify="space-between"
        px={3}
        py={0.5}
        bg={headerBg}
        borderBottom="1px solid"
        borderColor={borderColor}
      >
        <HStack spacing={2} alignItems="center">
          

          <Box lineHeight="1">
            <WidgetTitle color={textColor}>Inverter Table</WidgetTitle>
            <Text fontSize="13px" color={subTextColor}>
              {/* Real-time status and performance overview */}
            </Text>
          </Box>
        </HStack>

        <HStack spacing={2} alignItems="center">
          <Box
            px={2}
            py={1}
            bg={totalBoxBg}
            borderRadius="12px"
            border={totalBoxBorder}
          >
            <Text color={totalBoxText} fontWeight="500" fontSize="11px">
              Total Inverters :
              <Text as="span" color="#2563EB" fontWeight="700" ml={1} fontSize="11px">
                {rows.length}
              </Text>
            </Text>
          </Box>

          <IconButton
            aria-label="Fullscreen"
            icon={isFullscreen ? <SqeezIcon /> : <ExpandIcon />}
            onClick={toggleFullscreen}
            variant="ghost"
            size="xs"
            _hover={{ bg: "transparent", color: "gray.500" }}
          />
        </HStack>
      </HStack>

      <Box
        flex="1"
        h="calc(280px - 44px)"
        px={1}
        pt={2}
        pb={0}
        bg={bodyBg}
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        <ThemeProvider theme={theme}>
          <MaterialReactTable
            key={colorMode}
            columns={columns}
            data={sortedRows}
            enableTopToolbar={false}
            enableBottomToolbar={true}
            enableColumnActions={false}
            enableColumnFilters={false}
            enableDensityToggle={false}
            enableFullScreenToggle={false}
            enableHiding={false}
            enablePagination={true}
            layoutMode="semantic"
            state={{ pagination }}
            onPaginationChange={setPagination}
            manualPagination={false}
            rowCount={sortedRows.length}
            initialState={{ density: "compact", pagination: { pageIndex: 0, pageSize: isShortScreen ? 4 : 15 } }}
            muiTablePaperProps={{
              sx: {
                position: "relative",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transformStyle: "preserve-3d",
                boxShadow: useColorModeValue("0 28px 80px rgba(15, 23, 42, 0.18)", "0 32px 90px rgba(0, 0, 0, 0.45)"),
                background: useColorModeValue("linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)", "linear-gradient(180deg, #111827 0%, #111827 100%)"),
                overflow: "hidden",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(circle at top center, rgba(255,255,255,0.18), transparent 28%), radial-gradient(circle at bottom right, rgba(59,130,246,0.16), transparent 24%)",
                  opacity: 0.8,
                  pointerEvents: "none",
                  animation: "pulseGlow 6s ease-in-out infinite",
                },
                "@keyframes pulseGlow": {
                  "0%, 100%": {
                    opacity: 0.7,
                  },
                  "50%": {
                    opacity: 0.95,
                  },
                },
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: useColorModeValue("0 34px 100px rgba(15, 23, 42, 0.22)", "0 38px 110px rgba(0, 0, 0, 0.55)"),
                },
              },
            }}
            muiTableContainerProps={{
              sx: {
                flex: 1,
                height: "100%",
                minHeight: 0,
                overflowY: "auto",
                overflowX: isFullscreen ? "auto" : "hidden",
                perspective: "1600px",
                transformStyle: "preserve-3d",
                "& .MuiTableHead-root": {
                  background: useColorModeValue("#F8FAFC", "#111827"),
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                  transform: "translateZ(6px)",
                  boxShadow: "0 10px 32px rgba(15,23,42,0.08)",
                  "& .MuiTableCell-root": {
                    fontWeight: 700,
                    fontSize: "13px",
                    color: tableTextColor,
                    borderBottom: "none",
                    background: useColorModeValue("#F8FAFC", "#111827"),
                  },
                },
                "& .MuiTableBody-root .MuiTableRow-root": {
                  background: useColorModeValue("rgba(255,255,255,0.96)", "rgba(255,255,255,0.05)"),
                  boxShadow: useColorModeValue("0 10px 24px rgba(15,23,42,.08)", "0 10px 24px rgba(255,255,255,.04)"),
                  transition: "transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease",
                  minHeight: "30px",
                  height: "auto",
                  transform: "translateZ(0)",
                },
                "& .MuiTableBody-root .MuiTableRow-root:hover": {
                  transform: "translateY(-6px) translateZ(10px)",
                  boxShadow: "0 18px 42px rgba(15,23,42,.18)",
                },
                "& .MuiTableCell-root": {
                  transition: "transform 0.3s ease, background 0.3s ease, color 0.3s ease",
                },
              },
            }}
            muiTableProps={{
              sx: {
                tableLayout:
                  isFullscreen || isShortScreen
                    ? "fixed"
                    : "auto",
                width: isFullscreen ? "max-content" : "100%",
                minWidth: isFullscreen ? "max-content" : "100%",
                borderSpacing: "0",
                borderCollapse: "collapse",
                "& .MuiTableCell-root": {
                  padding: "4px 8px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                },
              },
            }}
            muiTableHeadCellProps={{
              align: "center",
              sx: {
                px: 0,
                py: 0,
                textAlign: "center",
                color: tableTextColor,
                "& .Mui-TableHeadCell-Content": {
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                },
                "& .MuiTableCell-root": {
                  padding: "4px 8px",
                  minWidth: 0,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  color: tableTextColor,
                },
              },
            }}
            muiTableBodyCellProps={{
              align: "center",
              sx: {
                px: 0,
                py: 0,
                textAlign: "center",
                color: tableTextColor,
                "& .MuiTableCell-root": {
                  textAlign: "center",
                  padding: "4px 8px",
                  minWidth: 0,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  color: tableTextColor,
                },
                "& .MuiTypography-root": {
                  width: "100%",
                  textAlign: "center",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  color: tableTextColor,
                },
              },
            }}
            muiBottomToolbarProps={{
              sx: {
                minHeight: "34px",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                "& .MuiTablePagination-root": {
                  minHeight: "34px",
                  marginTop: "-10px",
                },
                "& .MuiTablePagination-toolbar": {
                  minHeight: "34px",
                  padding: "0 6px",
                },
                "& .MuiTablePagination-selectRoot": {
                  display: "none",
                },
                "& .MuiTablePagination-selectLabel": {
                  display: "none",
                },
                "& .MuiTablePagination-spacer": {
                  display: "none",
                },
                "& .MuiTablePagination-displayedRows": {
                  display: "none",
                },
                "& .MuiIconButton-root": {
                  padding: "2px",
                },
              },
            }}
            muiPaginationProps={{
              rowsPerPageOptions: [4, 5, 10, 15],
              showRowsPerPage: false,
              showFirstButton: true,
              showLastButton: true,
            }}
          />
        </ThemeProvider>
      </Box>
    </Box>
  );
}

// base url from env