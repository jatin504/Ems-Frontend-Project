import { useEffect, useMemo, useState, useRef } from "react";
import {
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  useColorModeValue,
  HStack,
  Button,
} from "@chakra-ui/react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
} from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { MdElectricBolt, MdLinkOff } from "react-icons/md";
import { TbCircuitDiodeZener } from "react-icons/tb";
const BASE_URL = import.meta.env.VITE_API_BASE;

type TrendType = "up" | "down" | "same";

const TrendArrow = ({ trend }: { trend: TrendType }) => {
  if (trend === "up")
    return (
      <Text color="green.500" fontWeight="700">
        ▲
      </Text>
    );

  if (trend === "down")
    return (
      <Text color="red.500" fontWeight="700">
        ▼
      </Text>
    );

  return (
    <Text color="gray.400" fontWeight="700">
      ▬
    </Text>
  );
};

/* ================= TYPES ================= */

interface PCSRow {
  id: string;
  status: any;
  [key: string]: any;
}

/* ================= COMPONENT ================= */

export default function PlantViewTable() {
  const primaryColor = useColorModeValue(
    "primaryText.light",
    "primaryText.dark"
  );

  const tableMode = useColorModeValue("light", "dark");

  const theme = useMemo(
    () => createTheme({ palette: { mode: tableMode } }),
    [tableMode]
  );

  const [activeTab, setActiveTab] = useState(0);
  const [pcsDataMap, setPcsDataMap] = useState<Record<string, any>>({});
  const [invDataMap, setInvDataMap] = useState<Record<string, any>>({});

  const previousValues = useRef<Record<string, Record<string, number>>>({});

  const panelRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  /* ===== PAGINATION STATE ===== */
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 4,
  });

  const toggleFullscreen = async () => {
    console.time("fullscreen");

    if (!document.fullscreenElement) {
      await panelRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }

    console.timeEnd("fullscreen");
  };

  useEffect(() => {
    const handler = () => {
      console.time("render");
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handler);

    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(() => {
    setPagination({
      pageIndex: 0,
      pageSize: isFullscreen ? 15 : 4,
    });
  }, [isFullscreen]);

  useEffect(() => {
    console.timeEnd("render");
  }, [isFullscreen]);

  const getTrend = (
    current: number,
    previous: number | undefined
  ): TrendType => {
    if (previous === undefined) return "same";

    if (current > previous) return "up";

    if (current < previous) return "down";

    return "same";
  };

  /* ================= COLUMNS ================= */

  const pcsCol = [
    "ID",
    "Active_Power",
    
    "Reactive_Power",
    
    // "DC_Current_B1",
    
    "DC_Current_B3",
    "DC_Current_Total",
    
    "DC_Volt_B1",
    "DC_Volt_B2",
    "DC_Volt_B3",
    "AC_Current_L1",
    "AC_Current_L2",
    "AC_Current_L3",
    "DC_Current_B2",
    
    "DC_Volt_Total",
    
    "AC_Volt_L1L2",
    "AC_Volt_L2L3",
    "AC_Volt_L3L1",
    "Grid_Frequency",
  ];

  const invCol = [
    "ID",
    "Active Power",
    "Reactive Power",
    "DC Voltage",
    "DC Power",
    "AC Current L1",
    "AC Current L2",
   "Apparent Power",
    
    "Daily Energy",
  "PF",
    // "AC Volt L1L2",
    // "AC Volt L2L3",
    // "AC Volt L3L1",
    "Frequency",
    "Temperature",
  ];

  const keys = activeTab === 0 ? invCol.slice(1) : pcsCol.slice(1);

  /* ===== BACKEND KEY MAP ===== */
  const PCS_KEY_MAP: Record<string, string> = {
    DC_Current_B1: "Active_power",
    DC_Current_B2: "DCDC1_Battery_side_current",
    DC_Current_B3: "DCDC1_Bus_side_current",
    DC_Current_Total: "DCDC1_Bus_side_current",
    DC_Volt_B1: "DCDC1_Battery_side_voltage",
    DC_Volt_Total: "Chargeable_capacity",
    PF: "BCU_1_DOD",
    Apparent_Power: "BCU_1_Chargeable_capacity",
    Active_Power: "Active_power",
    AC_Current_L1: "Alarm_1",
    AC_Current_L2: "Alarm_2",
    AC_Volt_L1L2: "Control_unit_cabin_temperature_1",
    AC_Volt_L2L3: "Control_unit_cabin_humidity_1",
    AC_Volt_L3L1: "Control_unit_cabin_dew_point_temperature",
    DC_Volt_B2: "Container_status_1",
    DC_Volt_B3: "Container_status_2",
    DC_Volt: "Container_status_3",
    Grid_Frequency: "DCDC1_ISO_insulation_resistance",
  };

  const INV_KEY_MAP: Record<string, string> = {
    "DC Voltage": "voltage",
    "DC Power": "reactive_power",
    "AC Current L1": "current",
    "AC Current L2": "dc_current",
    
    PF: "power_factor",
    "Daily Energy": "total_energy",
    "Apparent Power": "apparent_power",
    "Active Power": "active_power",
    "Reactive Power": "reactive_power",
    // "AC Volt L1L2": "Volt_CA",
    // "AC Volt L2L3": "Volt_BC",
    // "AC Volt L3L1": "Volt_AB",
    Frequency: "frequency",
    Temperature: "Temperature",
  };

  /* ===== UI HEADER MAP ===== */
  const COLUMN_HEADER_MAP: Record<string, string> = {
    DC_Volt: "Volt",
    DC_Current_B1: "Power",
    DC_Current_B2: "Reactive Power",
    DC_Current_B3: "Apparent Power",
    DC_Current_Total: "DC Current Total",
    "Active Power": "Active Power",
    "Reactive Power": "Reactive Power",
    "DC Voltage": "DC Voltage",
    "DC Power": "DC Power",
    "AC Current L1": "AC Current L1",
    "AC Current L2": "AC Current L2",
    "AC Current L3": "AC Current L3",
    "Daily Energy": "Daily Energy",
    "Apparent Power": "Apparent Power",
    // "AC Volt L1L2": "AC Volt L1L2",
    // "AC Volt L2L3": "AC Volt L2L3",
    // "AC Volt L3L1": "AC Volt L3L1",
    Frequency: "Frequency",
    Temperature: "Temperature",
  };

  /* ================= API ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pcsResponse = await fetch(
          `${BASE_URL}/api/lastest-direct-data/multiple-latest-devices`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              device_id_patterns: ["_bank_bank_"],
            }),
          }
        );
        const pcsJson = await pcsResponse.json();
        if (pcsJson.success) setPcsDataMap(pcsJson.data);

        const invResponse = await fetch(
          `${BASE_URL}/api/lastest-direct-data/multiple-latest-devices`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              device_id_patterns: ["_inverter_inverter_"],
            }),
          }
        );
        const invJson = await invResponse.json();
        if (invJson.success) setInvDataMap(invJson.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    const id = setInterval(fetchData, 60000);

    return () => clearInterval(id);
  }, []);

  /* ================= STATUS ICON ================= */

  const renderStatusIcon = (row: any) => {
    const trip = row?.Trip_tag_value?.value ?? 0;
    const tsValue = row?.Time_Stamp?.value ?? row?.timestamp?.value;
    const lastTs = tsValue ? new Date(tsValue).getTime() : 0;
    const activePower =
      activeTab === 0
        ? row?.active_power?.value ?? 0
        : row?.Active_power?.value ?? 0;
    const now = Date.now();

    let label = "Stop";
    let color = "red.500";
    let icon = <MdElectricBolt color="#E53E3E" size={12} />;

    if (trip > 0) {
      label = "Trip";
      color = "purple.500";
      icon = <TbCircuitDiodeZener color="#805AD5" size={12} />;
    } else if (!lastTs || now - lastTs > 4 * 60 * 1000) {
      label = "Non-Comm";
      color = "orange.500";
      icon = <MdLinkOff color="#DD6B20" size={12} />;
    } else if (activePower > 0) {
      label = "Running";
      color = "green.500";
      icon = <MdElectricBolt color="#38A169" size={12} />;
    }

    return (
      <HStack
        spacing={1.5}
        px={2}
        py={1}
        borderRadius="999px"
        bg={useColorModeValue("white", "gray.800")}
        border="1px solid"
        borderColor={useColorModeValue("gray.200", "whiteAlpha.200")}
        boxShadow="sm"
      >
        {icon}
        <Text fontSize="10px" fontWeight="700" color={color}>
          {label}
        </Text>
      </HStack>
    );
  };

  /* ================= ROWS ================= */

  const buildRows = (
    prefix: string,
    sourceData: Record<string, any>,
    cols: string[],
    keyMap: Record<string, string>
  ) => {
    const devices = Object.values(sourceData);

    return devices.map((row: any, index) => {
      const mapped: PCSRow = {
        id: `${prefix}-${index + 1}`,
        status: row,
      };

      cols.slice(1).forEach((k) => {
        const field = row?.[keyMap[k] ?? k];
        const value =
          field?.value !== null && field?.value !== undefined
            ? Number(field.value)
            : 0;

        mapped[k] =
          field?.value !== null && field?.value !== undefined
            ? `${field.value} ${field.unit ?? ""}`.trim()
            : "--";

        const prev = previousValues.current[mapped.id]?.[k];

        mapped[`${k}_trend`] = getTrend(value, prev);

        if (!previousValues.current[mapped.id]) {
          previousValues.current[mapped.id] = {};
        }

        previousValues.current[mapped.id][k] = value;
      });

      return mapped;
    });
  };

  const pcsRows = useMemo(
    () => buildRows("PCS", pcsDataMap, pcsCol, PCS_KEY_MAP),
    [pcsDataMap]
  );
  const invRows = useMemo(
    () => buildRows("INV", invDataMap, invCol, INV_KEY_MAP),
    [invDataMap]
  );

  /* ================= COLUMNS ================= */

  const allColumns = useMemo<MRT_ColumnDef<PCSRow>[]>(() => [
    {
      accessorKey: "id",
      header: "ID",
      size: 90,
      Cell: ({ row }) => (
        <Box textAlign="center">
          <Text fontWeight="bold" fontSize="10px" noOfLines={1}>
            {row.original.id}
          </Text>
          {renderStatusIcon(row.original.status)}
        </Box>
      ),
    },
    ...keys.map((k) => ({
      accessorKey: k,
      header: COLUMN_HEADER_MAP[k] ?? k,
      size: 150,
      Cell: ({ cell }: { cell: any }) => (
        <HStack
          w="80px"
          h="24px"
          bg={useColorModeValue("#F8FAFF", "gray.800")}
          borderRadius="999px"
          border="1px solid"
          borderColor={useColorModeValue("#E2E8F0", "whiteAlpha.200")}
          justifyContent="space-between"
          px={1.5}
          mx="auto"
        >
          <Text fontSize="10px" fontWeight="600" textAlign="center" whiteSpace="nowrap">
            {String(cell.getValue())}
          </Text>
          <TrendArrow trend={cell.row.original[`${k}_trend`]} />
        </HStack>
      ),
    })),
  ], [keys]);

  const columns = useMemo(() => {
    return isFullscreen ? allColumns : allColumns.slice(0, 7);
  }, [allColumns, isFullscreen]);

  /* ================= RENDER ================= */

  return (
    <Box
      ref={panelRef}
      w="100%"
      h="310px"
      bg={useColorModeValue("#F8FAFC", "gray.950")}
      borderRadius="14px"
      overflow="hidden"
      border="1px solid"
      borderColor={useColorModeValue("#DBEAFE", "whiteAlpha.200")}
      boxShadow={useColorModeValue("0 10px 24px rgba(15, 23, 42, 0.06)", "0 10px 24px rgba(0, 0, 0, 0.24)")}
      display="flex"
      flexDirection="column"
      color={primaryColor}
    >
      <HStack
        justify="space-between"
        px={3}
        py={1.5}
        bg={useColorModeValue(isFullscreen ? "#F8FAFC" : "linear-gradient(90deg, #EFF6FF 0%, #FFFFFF 100%)", isFullscreen ? "#111827" : "linear-gradient(90deg, #1F2937 0%, #111827 100%)")}
        borderBottom="1px solid"
        borderColor={useColorModeValue("#DBEAFE", "whiteAlpha.100")}
      >
        <Box>
          <Tabs index={activeTab} onChange={setActiveTab} variant="unstyled">
            <TabList
              bg={useColorModeValue("gray.100", "gray.700")}
              borderRadius="lg"
              p="2px"
              boxShadow="sm"
            >
              <Tab
                px={4}
                py={1}
                fontSize="11px"
                fontWeight="600"
                borderRadius="md"
                _selected={{ bg: "blue.500", color: "white" }}
              >
                INV
              </Tab>
              <Tab
                px={4}
                py={1}
                fontSize="11px"
                fontWeight="600"
                borderRadius="md"
                _selected={{ bg: "blue.500", color: "white" }}
              >
                PCS
              </Tab>
            </TabList>
          </Tabs>
        </Box>

        <HStack spacing={2}>
          <Box
            px={2.5}
            py={1}
            bg={useColorModeValue("#E0F2FE", "blue.900")}
            borderRadius="999px"
            border="1px solid"
            borderColor={useColorModeValue("#BAE6FD", "blue.700")}
            fontSize="11px"
            fontWeight="700"
            color={useColorModeValue("blue.700", "blue.100")}
          >
            Total : {activeTab === 0 ? invRows.length : pcsRows.length}
          </Box>
          <Button size="xs" variant="ghost" onClick={toggleFullscreen}>
            ⤢
          </Button>
        </HStack>
      </HStack>

      <Box
        flex="1"
        px={1}
        pt={2}
        pb={0}
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        <ThemeProvider theme={theme}>
          <MaterialReactTable
          columns={columns}
          data={activeTab === 1 ? pcsRows : invRows}
          layoutMode="grid"

          enablePagination
          enableBottomToolbar
          state={{ pagination }}
          onPaginationChange={setPagination}

          muiTablePaperProps={{
            sx: {
              position: "relative",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              boxShadow: isFullscreen ? "none" : useColorModeValue("0 16px 40px rgba(15, 23, 42, 0.10)", "0 16px 40px rgba(0, 0, 0, 0.35)"),
              background: useColorModeValue("linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)", "linear-gradient(180deg, #111827 0%, #0f172a 100%)"),
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid",
              borderColor: useColorModeValue("#E2E8F0", "whiteAlpha.200"),
            },
          }}

          muiTableContainerProps={{
            sx: {
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: isFullscreen ? "auto" : "hidden",
              "& .MuiTableHead-root": {
                background: useColorModeValue("#F0F7FF", "#1F2937"),
                position: "sticky",
                top: 0,
                zIndex: 2,
                boxShadow: "0 6px 16px rgba(15,23,42,0.06)",
                "& .MuiTableCell-root": {
                  fontWeight: 700,
                  fontSize: "12px",
                  color: useColorModeValue("#0F172A", "#E5E7EB"),
                  borderBottom: "none",
                  background: useColorModeValue("#F0F7FF", "#1F2937"),
                },
              },
              "& .MuiTableBody-root .MuiTableRow-root": {
                background: useColorModeValue("#FFFFFF", "rgba(17,24,39,0.95)"),
                borderBottom: "1px solid",
                borderColor: useColorModeValue("#F1F5F9", "whiteAlpha.100"),
                transition: "background 0.2s ease, box-shadow 0.2s ease",
                minHeight: "24px",
                height: "auto",
              },
              "& .MuiTableBody-root .MuiTableRow-root:nth-of-type(odd)": {
                background: useColorModeValue("#FCFDFF", "rgba(15,23,42,0.9)"),
              },
              "& .MuiTableBody-root .MuiTableRow-root:hover": {
                background: useColorModeValue("#F8FAFF", "rgba(30,41,59,0.95)"),
              },
              "& .MuiTableCell-root": {
                padding: "3px 8px",
              },
            },
          }}

          muiTableProps={{
            sx: {
              tableLayout: "fixed",
              width: "100%",
              minWidth: isFullscreen ? "1600px" : "100%",
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
              "& .Mui-TableHeadCell-Content": {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
              "& .MuiTableCell-root": {
                padding: "4px 8px",
              },
            },
          }}

          muiTableBodyCellProps={{
            align: "center",
            sx: {
              px: 0,
              py: 0,
              textAlign: "center",
              "& .MuiTableCell-root": {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: "4px 8px",
                minWidth: 0,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              },
              "& .MuiTypography-root": {
                width: "100%",
                textAlign: "center",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              },
            },
          }}

          muiBottomToolbarProps={{
  sx: {
    minHeight: "36px",
    height: "36px",

    "& .MuiToolbar-root": {
      minHeight: "36px",
      height: "36px",
      display: "flex",
      alignItems: "center",
    },

    "& .MuiTablePagination-root": {
      display: "flex",
      alignItems: "center",
      marginTop: "-10px", // ← isse pura pagination upar aa jayega
    },

    "& .MuiTablePagination-toolbar": {
      minHeight: "36px",
      height: "36px",
      display: "flex",
      alignItems: "center",
      padding: "0 8px",
    },
  },
}}

          muiPaginationProps={{
            showFirstButton: false,
            showLastButton: false,
            showRowsPerPage: false,
            sx: {
              minHeight: "24px",
              padding: "0px 8px",
              "& .MuiTablePagination-displayedRows": {
                fontSize: "11px",
                margin: 0,
                position: "relative",
                top: "-2px",
              },
              "& .MuiTablePagination-actions": {
                marginLeft: "4px",
                position: "relative",
                top: "-2px",
              },
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
    </Box>
  );
}
