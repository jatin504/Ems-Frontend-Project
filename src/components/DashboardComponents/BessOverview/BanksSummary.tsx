import React, { useMemo, useState } from "react";
import {
  Box,
  Text,
  HStack,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

import {
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";

interface BankData {
  bank: string;
  status: string;
  soc: number;
  soh: number;
  voltage: number;
  current: number;
  power: number;
  temperature: number;
}

const BanksSummary = () => {
  const tableMode = useColorModeValue("light", "dark");

  const bodyBg = useColorModeValue("white", "#1A202C");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: tableMode,
        },
      }),
    [tableMode]
  );

  const data = useMemo<BankData[]>(
    () => [
      {
        bank: "Bank-1",
        status: "Charging",
        soc: 84,
        soh: 98,
        voltage: 812,
        current: 124,
        power: 101,
        temperature: 28,
      },
      {
        bank: "Bank-2",
        status: "Charging",
        soc: 82,
        soh: 97,
        voltage: 808,
        current: 118,
        power: 96,
        temperature: 29,
      },
      {
        bank: "Bank-3",
        status: "Charging",
        soc: 76,
        soh: 96,
        voltage: 805,
        current: 115,
        power: 92,
        temperature: 27,
      },
      {
        bank: "Bank-4",
        status: "Discharging",
        soc: 63,
        soh: 95,
        voltage: 796,
        current: 142,
        power: 108,
        temperature: 31,
      },
      {
        bank: "Bank-5",
        status: "Discharging",
        soc: 91,
        soh: 99,
        voltage: 818,
        current: 121,
        power: 104,
        temperature: 30,
      },
      {
        bank: "Bank-6",
        status: "Discharging",
        soc: 45,
        soh: 90,
        voltage: 780,
        current: 110,
        power: 85,
        temperature: 32,
      },
    ],
    []
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const columns = useMemo<MRT_ColumnDef<BankData>[]>(
    () => [
      {
        accessorKey: "bank",
        header: "Bank",
        size: 100,
      },

      {
        accessorKey: "status",
        header: "Status",
        size: 120,

        Cell: ({ cell }) => {
          const value = cell.getValue<string>();

          let color = "#38A169"; // default green

          switch (value) {
            case "Charging":
              color = "#7AC70C";
              break;

            case "Discharging":
              color = "#28A5FF";
              break;

            case "Standby":
              color = "#F6AD55";
              break;

            case "Fault":
              color = "#E53E3E";
              break;

            case "Running":
              color = "#22C55E";
              break;
          }

          return (
            <Text
              fontSize="13px"
              fontWeight="700"
              color={color}
              textAlign="center"
              letterSpacing="0.2px"
              textShadow={`0 0 6px ${color}66`}
            >
              {value}
            </Text>
          );
        },
      },

      {
        accessorKey: "soc",
        header: "SOC (%)",
        size: 90,
      },

      {
        accessorKey: "soh",
        header: "SOH (%)",
        size: 90,
      },

      {
        accessorKey: "voltage",
        header: "Voltage (V)",
        size: 110,
      },

      {
        accessorKey: "current",
        header: "Current (A)",
        size: 110,
      },

      {
        accessorKey: "power",
        header: "Power (kW)",
        size: 110,
      },
    ],
    []
  );
    return (
    <Box
      w="100%"
      h="100%"
      bg={bodyBg}
      borderRadius="12px"
      overflow="hidden"
      border="1px solid"
      borderColor={useColorModeValue(
        "gray.200",
        "whiteAlpha.200"
      )}
    >
      <HStack
        justify="space-between"
        px={4}
        py={3}
      >
        <Text
          fontSize="15px"
          fontWeight="600"
        >
          Banks Summary
        </Text>

        <Text
          fontSize="12px"
          color="gray.500"
        >
          Total Banks : {data.length}
        </Text>
      </HStack>

      <ThemeProvider theme={theme}>
        <MaterialReactTable
          columns={columns}
          data={data}
          enableTopToolbar={false}
          enableBottomToolbar
          enableColumnActions={false}
          enableColumnFilters={false}
          enableDensityToggle={false}
          enableFullScreenToggle
          enableHiding={false}
          enableSorting={false}
          enablePagination
          state={{ pagination }}
          onPaginationChange={setPagination}
          manualPagination={false}
          rowCount={data.length}
          layoutMode="semantic"
          initialState={{
            density: "compact",
            pagination: {
              pageIndex: 0,
              pageSize: 5,
            },
          }}
          muiTableContainerProps={{
            sx: {
              height: "250px",
              maxHeight: "250px",
              overflowY: "auto",
            },
          }}
          muiTableProps={{
            sx: {
              tableLayout: "fixed",
            },
          }}
          muiTableHeadCellProps={{
            align: "center",
            sx: {
              fontSize: "11px",
              fontWeight: 600,
              textAlign: "center",

              "& .Mui-TableHeadCell-Content": {
                width: "100%",
                justifyContent: "center",
              },
            },
          }}
          muiTableBodyCellProps={{
            align: "center",
            sx: {
              fontSize: "11px",
              textAlign: "center",
              verticalAlign: "middle",

              "& .MuiTypography-root": {
                width: "100%",
                textAlign: "center",
              },
            },
          }}
          muiBottomToolbarProps={{
            sx: {
              minHeight: "42px",
              "& .MuiTablePagination-root": {
                minHeight: "42px",
              },
              "& .MuiTablePagination-toolbar": {
                minHeight: "42px",
                padding: "0 8px",
              },
            },
          }}
          muiPaginationProps={{
            rowsPerPageOptions: [5, 10],
            showFirstButton: true,
            showLastButton: true,
          }}
        />
      </ThemeProvider>
    </Box>
  );
  };

export default BanksSummary;