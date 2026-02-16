import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Tabs,
  TabList,
  Tab,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ExpandIcon, SqeezIcon } from "../../../assets/Icons";

/* ================= TYPES ================= */

interface StringRow {
  stringName: string;
  status: string | null;
  current: number | null;
  voltage: number | null;
  power: number | null;
  temperature: number | null;
  irradiance: number | null;
  health: number | null;
}

/* ================= COMPONENT ================= */

export default function StringTable() {
  const panelRef = useRef<HTMLDivElement>(null);

  const tableMode = useColorModeValue("light", "dark");
  const bodyBg = useColorModeValue("gray.50", "gray.900");

  const theme = useMemo(
    () => createTheme({ palette: { mode: tableMode } }),
    [tableMode]
  );

  const [rows, setRows] = useState<StringRow[]>([]);
  const [dataMap, setDataMap] = useState<Record<string, any>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  /* ================= BACKEND KEY MAP ================= */

  const KEY_MAP: Record<keyof Omit<StringRow, "stringName" | "status">, string> =
    {
      current: "DCDC1_Bus_side_current",
      voltage: "DCDC1_Bus_side_voltage",
      power: "Phase_A_active_power",
      temperature: "DCDC_Cabinet_temperature",
      irradiance: "Fan_speed_5",
      health: "Fan_speed_4",
    };

  /* ================= FULLSCREEN ================= */

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      panelRef.current?.requestFullscreen();
      setIsFullscreen(true);
      setPagination({ pageIndex: 0, pageSize: 15 });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      setPagination({ pageIndex: 0, pageSize: 5 });
    }
  };

  useEffect(() => {
    const fn = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      setPagination({ pageIndex: 0, pageSize: fs ? 15 : 5 });
    };
    document.addEventListener("fullscreenchange", fn);
    return () => document.removeEventListener("fullscreenchange", fn);
  }, []);

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

  /* ================= MAP DATA ================= */

  useEffect(() => {
    const mapped: StringRow[] = [];

    Object.entries(dataMap).forEach(([deviceId, d]: any) => {
      const suffix = deviceId.split("_").pop();
      const stringName = suffix ? `String-${suffix}` : deviceId;

      const v = (k: keyof typeof KEY_MAP) =>
        d?.[KEY_MAP[k]]?.value ?? null;

      mapped.push({
        stringName,
        current: v("current"),
        voltage: v("voltage"),
        power: v("power"),
        temperature: v("temperature"),
        irradiance: v("irradiance"),
        health: v("health"),
        status:
          v("current") === null || v("voltage") === null
            ? "Fault"
            : "Healthy",
      });
    });

    setRows(mapped);
  }, [dataMap]);

  /* ================= COMMON CELL STYLE ================= */

  const headCell = {
    sx: {
      textAlign: "right",
      px: "12px",
      whiteSpace: "nowrap",
    },
  };

  const bodyCell = {
    sx: {
      textAlign: "right",
      px: "12px",
      whiteSpace: "nowrap",
    },
  };

  /* ================= COLUMNS (STATUS = 2nd) ================= */

  const columns = useMemo<MRT_ColumnDef<StringRow>[]>(() => [
    {
      accessorKey: "stringName",
      header: "String",
      size: 140,
      muiTableHeadCellProps: { sx: { textAlign: "left", px: "12px" } },
      muiTableBodyCellProps: { sx: { textAlign: "left", px: "12px" } },
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 120,
      muiTableHeadCellProps: { sx: { textAlign: "center", px: "12px" } },
      muiTableBodyCellProps: { sx: { textAlign: "center", px: "12px" } },
      Cell: ({ cell }) => (
        <Text
          fontWeight="600"
          color={cell.getValue() === "Fault" ? "red.400" : "green.400"}
        >
          {cell.getValue()}
        </Text>
      ),
    },
    { accessorKey: "current", header: "Current (A)", size: 130, muiTableHeadCellProps: headCell, muiTableBodyCellProps: bodyCell },
    { accessorKey: "voltage", header: "Voltage (V)", size: 130, muiTableHeadCellProps: headCell, muiTableBodyCellProps: bodyCell },
    { accessorKey: "power", header: "Power (kW)", size: 120, muiTableHeadCellProps: headCell, muiTableBodyCellProps: bodyCell },
    { accessorKey: "temperature", header: "Temp (°C)", size: 120, muiTableHeadCellProps: headCell, muiTableBodyCellProps: bodyCell },
    { accessorKey: "irradiance", header: "Irradiance (W/m²)", size: 150, muiTableHeadCellProps: headCell, muiTableBodyCellProps: bodyCell },
    { accessorKey: "health", header: "Health (%)", size: 110, muiTableHeadCellProps: headCell, muiTableBodyCellProps: bodyCell },
  ], []);

  /* ================= RENDER ================= */

  return (
    <Box ref={panelRef} w="100%" bg={useColorModeValue("white", "gray.800")} borderRadius="md">
      <Flex justify="space-between" align="center" px={4} py={3}>
        <Flex align="center" gap={4}>
          <Text fontSize="lg" fontWeight="bold">String</Text>
          <Tabs variant="soft-rounded" colorScheme="blue" size="sm">
            <TabList>
              <Tab>Table</Tab>
            </TabList>
          </Tabs>
        </Flex>
        <IconButton
          aria-label="Toggle fullscreen"
          icon={isFullscreen ? <SqeezIcon /> : <ExpandIcon />}
          onClick={toggleFullscreen}
          variant="ghost"
          size="sm"
        />
      </Flex>

      <Box px={2} py={2} bg={bodyBg}>
        <ThemeProvider theme={theme}>
          <MaterialReactTable
            columns={columns}
            data={rows}
            layoutMode="grid"
            state={{ pagination }}
            onPaginationChange={setPagination}
            initialState={{ density: "compact" }}
            muiTableProps={{ sx: { tableLayout: "fixed" } }}
            muiTableContainerProps={{
              sx: {
                maxHeight: isFullscreen ? "calc(100vh - 160px)" : "230px",
                overflowY: "auto",
              },
            }}
            enableColumnFilters={false}
            enableGlobalFilter={false}
            enableDensityToggle={false}
            enableFullScreenToggle={false}
          />
        </ThemeProvider>
      </Box>
    </Box>
  );
}
