import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  useColorModeValue,
  HStack,
  useMediaQuery,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_PaginationState,
} from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { MdElectricBolt, MdLinkOff } from "react-icons/md";
import { TbCircuitDiodeZener } from "react-icons/tb";
import { FiMaximize, FiMinimize } from "react-icons/fi";

/* ================= TYPES ================= */

interface PCSRow {
  id: string;
  status: any;
  [key: string]: any;
}

/* ================= COMPONENT ================= */

export default function PlantViewTable() {
  const primaryBg = useColorModeValue("primary.light", "primary.dark");
  const primaryColor = useColorModeValue(
    "primaryText.light",
    "primaryText.dark"
  );
  const primaryBorder = useColorModeValue(
    "primaryBorder.light",
    "primaryBorder.dark"
  );

  const tableMode = useColorModeValue("light", "dark");

  const theme = useMemo(
    () => createTheme({ palette: { mode: tableMode } }),
    [tableMode]
  );

  const [activeTab, setActiveTab] = useState(0);
  const [dataMap, setDataMap] = useState<Record<string, any>>({});

  const [isShortScreen] = useMediaQuery("(max-width: 900px)");

  const panelRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  /* ===== PAGINATION STATE ===== */
  const [pagination, setPagination] = useState<MRT_PaginationState>({
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

  /* ================= COLUMNS ================= */

  const pcsCol = [
    "ID",
    "DC_Volt",
    "DC_Current_B1",
    "DC_Current_B2",
    "DC_Current_B3",
    "DC_Current_Total",
    "DC_Volt_Total",
    "DC_Volt_B1",
    "DC_Volt_B2",
    "DC_Volt_B3",
    "AC_Current_L1",
    "AC_Current_L2",
    "AC_Current_L3",
    "PF",
    "Apparent_Power",
    "Active_Power",
    "Reactive_Power",
    "AC_Volt_L1L2",
    "AC_Volt_L2L3",
    "AC_Volt_L3L1",
    "Grid_Frequency",
  ];

  const keys = pcsCol.slice(1);

  /* ===== BACKEND KEY MAP ===== */
  const COLUMN_KEY_MAP: Record<string, string> = {
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

  /* ===== UI HEADER MAP ===== */
  const COLUMN_HEADER_MAP: Record<string, string> = {
    DC_Volt: "Volt",
    DC_Current_B1: "Power",
    DC_Current_B2: "Reactive Power",
    DC_Current_B3: "Apparent Power",
    DC_Current_Total: "Amps",
  };

  /* ================= API ================= */

  useEffect(() => {
    fetch(
      "http://75.119.146.115:5179/api/lastest-direct-data/multiple-latest-devices",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device_id_patterns: ["_bank_bank_"],
        }),
      }
    )
      .then((r) => r.json())
      .then((j) => j.success && setDataMap(j.data))
      .catch(console.error);
  }, []);

  /* ================= STATUS ICON ================= */

  const renderStatusIcon = (row: any) => {
    const trip = row?.Trip_tag_value?.value ?? 0;
    const lastTs = row?.timestamp?.value ?? 0;
    const activePower =
      row?.Active_power?.value ?? row?.Active_Power?.value ?? 0;
    const now = Date.now();

    if (trip > 0)
      return (
        <HStack spacing={1}>
          <TbCircuitDiodeZener color="purple" size={14} />
          <Text fontSize="10px" color="purple">
            Trip
          </Text>
        </HStack>
      );

    if (!lastTs || now - lastTs > 10 * 60 * 1000)
      return (
        <HStack spacing={1}>
          <MdLinkOff color="orange" size={14} />
          <Text fontSize="10px" color="orange">
            Non-Comm
          </Text>
        </HStack>
      );

    if (activePower > 0)
      return (
        <HStack spacing={1}>
          <MdElectricBolt color="green" size={14} />
          <Text fontSize="10px" color="green">
            Gen
          </Text>
        </HStack>
      );

    return (
      <HStack spacing={1}>
        <MdElectricBolt color="red" size={14} />
        <Text fontSize="10px" color="red">
          Stop
        </Text>
      </HStack>
    );
  };

  /* ================= ROWS ================= */

  const buildRows = (prefix: string) => {
    const devices = Object.values(dataMap);
    const count = Math.max(devices.length, 6);

    return Array.from({ length: count }).map((_, index) => {
      const row = devices[index] ?? {};
      const mapped: PCSRow = {
        id: `${prefix}-${index + 1}`,
        status: row,
      };

      keys.forEach((k) => {
        mapped[k] = row?.[COLUMN_KEY_MAP[k] ?? k]?.value ?? "-";
      });

      return mapped;
    });
  };

  const pcsRows = useMemo(() => buildRows("PCS"), [dataMap]);
  const invRows = useMemo(() => buildRows("INV"), [dataMap]);

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
      size: 100,
      Cell: ({ cell }) => (
        <Text
          fontSize="10px"
          textAlign="center"
          whiteSpace="nowrap"
        >
          {cell.getValue<string>()}
        </Text>
      ),
    })),
  ], []);

  const columns = useMemo(
    () => (isShortScreen ? allColumns.slice(0, 5) : allColumns),
    [isShortScreen, allColumns]
  );

  /* ================= RENDER ================= */

  return (
    <Box ref={panelRef} bg={primaryBg} color={primaryColor} p="12px" h="100%">
      <Flex align="center" mb={3}>
        <Tabs index={activeTab} onChange={setActiveTab} variant="unstyled">
          <TabList
            bg={useColorModeValue("gray.100", "gray.700")}
            borderRadius="lg"
            p="2px"
            boxShadow="sm"
          >
            <Tab
              px={5}
              py={1.5}
              fontSize="12px"
              fontWeight="600"
              borderRadius="md"
              _selected={{ bg: "blue.500", color: "white" }}
            >
              INV
            </Tab>
            <Tab
              px={5}
              py={1.5}
              fontSize="12px"
              fontWeight="600"
              borderRadius="md"
              _selected={{ bg: "blue.500", color: "white" }}
            >
              PCS
            </Tab>
          </TabList>
        </Tabs>

        <IconButton
          ml="auto"
          variant="ghost"
          aria-label="Toggle fullscreen"
          icon={isFullscreen ? <FiMinimize /> : <FiMaximize />}
          onClick={toggleFullscreen}
          size="sm"
        />
      </Flex>

      <ThemeProvider theme={theme}>
        <MaterialReactTable
          columns={columns}
          data={activeTab === 1 ? pcsRows : invRows}
          layoutMode="grid"

          enablePagination
          enableBottomToolbar
          state={{ pagination }}
          onPaginationChange={setPagination}

          muiTableHeadCellProps={{
            align: "center",
            sx: {
              textAlign: "center",
              whiteSpace: "nowrap",
              py: isShortScreen ? 0.25 : 0.75,
              px: 1,
              fontSize: isShortScreen ? "9px" : "10px",
            },
          }}

          muiTableBodyCellProps={{
            align: "center",
            sx: {
              textAlign: "center",
              whiteSpace: "nowrap",
              py: isShortScreen ? 0.25 : 0.75,
              px: 1,
              fontSize: isShortScreen ? "9px" : "10px",
            },
          }}

          muiTableRowProps={{
            sx: {
              height: isShortScreen ? 24 : 32,
            },
          }}

          muiPaginationProps={{
            rowsPerPageOptions: isFullscreen ? [10, 15, 20] : [4, 6, 10],
            showFirstButton: true,
            showLastButton: true,
          }}

          muiTableContainerProps={{
  sx: {
    height: isFullscreen ? "calc(100vh - 120px)" : 190,   
    maxHeight: isFullscreen ? "calc(100vh - 120px)" : 190,
    overflowY: "auto",
    overflowX: isFullscreen ? "auto" : "hidden",
    border: `1px solid ${primaryBorder}`,
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
