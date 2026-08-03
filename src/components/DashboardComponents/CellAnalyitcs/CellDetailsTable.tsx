import { useMemo } from "react";
import {
  Box,
  Badge,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

import { ThemeProvider, createTheme } from "@mui/material/styles";

interface CellRow {
  cellNo: string;
  module: string;
  voltage: number;
  deviation: number;
  temperature: number;
  ir: number;
  status: string;
  health: number;
}

const tableData: CellRow[] = [
  {
    cellNo: "023",
    module: "M03",
    voltage: 3.365,
    deviation: 10,
    temperature: 44.83,
    ir: 0.42,
    status: "Balancing",
    health: 92,
  },
  {
    cellNo: "021",
    module: "M03",
    voltage: 3.364,
    deviation: 9,
    temperature: 43.10,
    ir: 0.45,
    status: "Balancing",
    health: 93,
  },
  {
    cellNo: "008",
    module: "M01",
    voltage: 3.361,
    deviation: 6,
    temperature: 41.20,
    ir: 0.43,
    status: "Idle",
    health: 95,
  },
  {
    cellNo: "199",
    module: "M06",
    voltage: 3.360,
    deviation: 5,
    temperature: 40.30,
    ir: 0.44,
    status: "Idle",
    health: 95,
  },
  {
    cellNo: "187",
    module: "M06",
    voltage: 3.359,
    deviation: 4,
    temperature: 39.80,
    ir: 0.45,
    status: "Idle",
    health: 95,
  },
  {
    cellNo: "198",
    module: "M06",
    voltage: 3.347,
    deviation: -8,
    temperature: 31.10,
    ir: 0.51,
    status: "Idle",
    health: 90,
  },
  {
    cellNo: "167",
    module: "M05",
    voltage: 3.348,
    deviation: -7,
    temperature: 30.25,
    ir: 0.52,
    status: "Idle",
    health: 90,
  },
  {
    cellNo: "171",
    module: "M05",
    voltage: 3.348,
    deviation: -7,
    temperature: 30.60,
    ir: 0.50,
    status: "Idle",
    health: 90,
  },
  {
    cellNo: "152",
    module: "M05",
    voltage: 3.349,
    deviation: -6,
    temperature: 31.30,
    ir: 0.51,
    status: "Balancing",
    health: 91,
  },
  {
    cellNo: "134",
    module: "M04",
    voltage: 3.349,
    deviation: -6,
    temperature: 31.40,
    ir: 0.50,
    status: "Idle",
    health: 91,
  },
];

export default function CellDetailsTable() {
  const bg = useColorModeValue("#ffffff", "#071A2B");
  const head = useColorModeValue("#F8FAFC", "#0B2438");
  const headText = useColorModeValue("#0F172A", "#FFFFFF");
  const tableBg = useColorModeValue("#FFFFFF", "#071A2B");
  const bodyText = useColorModeValue("#0F172A", "#E2E8F0");
  const headCellBg = useColorModeValue("#F8FAFC", "#0A2134");
  const headCellColor = useColorModeValue("#475569", "#94A3B8");
  const rowHoverBg = useColorModeValue("#F1F5F9", "#0C2B44");
  const scrollbarThumb = useColorModeValue("#CBD5E1", "#1F3B53");
  const footerBg = useColorModeValue("#FFFFFF", "#071A2B");
  const warning = useColorModeValue("#B45309", "#F59E0B");

  const muiMode = useColorModeValue("light", "dark");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: muiMode,
        },
      }),
    [muiMode]
  );

  const columns = useMemo<MRT_ColumnDef<CellRow>[]>(
    () => [
      {
        accessorKey: "cellNo",
        header: "Cell No.",
        size: 60,
      },
      {
        accessorKey: "module",
        header: "Module",
        size: 60,
      },
      {
        accessorKey: "voltage",
        header: "Voltage (V)",
        size: 70,
        Cell: ({ cell }) => Number(cell.getValue()).toFixed(3),
      },
      {
        accessorKey: "deviation",
        header: "Deviation (mV)",
        size: 75,
        Cell: ({ cell }) => {
          const value = Number(cell.getValue());

          return (
            <Text
              color={value > 0 ? "#EF4444" : "#38BDF8"}
              fontWeight="700"
            >
              {value > 0 ? "+" : ""}
              {value.toFixed(1)}
            </Text>
          );
        },
      },
      {
        accessorKey: "temperature",
        header: "Temp. (°C)",
        size: 70,
        Cell: ({ cell }) => Number(cell.getValue()).toFixed(2),
      },
      {
        accessorKey: "ir",
        header: "IR (mΩ)",
        size: 55,
        Cell: ({ cell }) => Number(cell.getValue()).toFixed(2),
      },
      {
        accessorKey: "status",
        header: "Balance Status",
        size: 95,
        Cell: ({ cell }) => (
          <Text
            fontWeight="600"
            color={
              cell.getValue<string>() === "Balancing"
                ? "#F59E0B"
                : "#E2E8F0"
            }
          >
            {cell.getValue<string>()}
          </Text>
        ),
      },
      {
        accessorKey: "health",
        header: "Health",
        size: 60,
        Cell: ({ cell }) => (
          <Badge
            bg="#65A30D"
            color="white"
            px={2}
            py={1}
            borderRadius="6px"
          >
            {cell.getValue<number>()}
          </Badge>
        ),
      },
    ],
    []
  );

  return (
    <Box
      h="100%"
      bg={bg}
      borderRadius="12px"
      overflow="hidden"
      border="1px solid"
      borderColor="#12334C"
    >
      <HStack
        justify="space-between"
        px={4}
        h="42px"
        bg={head}
        borderBottom="1px solid #12334C"
      >
        <Text fontWeight="700" fontSize="14px" color={headText}>
          Cell Details (Top 20 by Voltage Deviation)
        </Text>
      </HStack>

      {/* Part-2 se yaha MaterialReactTable add hoga - wrapped in ThemeProvider */}
      <ThemeProvider theme={theme}>
        <MaterialReactTable
          columns={columns}
          data={tableData}
          enableTopToolbar={false}
          enableBottomToolbar={false}
          enableColumnActions={false}
          enableColumnFilters={false}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          enableHiding={false}
          enableSorting={false}
          enablePagination={false}
          layoutMode="semantic"
          initialState={{
            density: "compact",
          }}
          muiTablePaperProps={{
            elevation: 0,
            sx: {
              height: "385px",
              background: tableBg,
              borderRadius: 0,
              boxShadow: "none",
            },
          }}
          muiTableContainerProps={{
            sx: {
              height: "340px",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: scrollbarThumb,
                borderRadius: "10px",
              },
            },
          }}
          muiTableHeadCellProps={{
            align: "center",
            sx: {
              background: headCellBg,
              color: headCellColor,
              fontWeight: 600,
              fontSize: "11px",
              borderBottom: "1px solid #17324A",
              py: "6px",
              whiteSpace: "nowrap",
            },
          }}
          muiTableBodyCellProps={{
            align: "center",
            sx: {
              background: tableBg,
              color: bodyText,
              fontSize: "11px",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              py: "5px",
            },
          }}
          muiTableBodyRowProps={{
            sx: {
              "&:hover td": {
                background: rowHoverBg,
              },
            },
          }}
        />

        <Box
          h="42px"
          px={3}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          borderTop="1px solid"
          borderColor="#12334C"
          bg={footerBg}
        >
          <Text fontSize="10px" color={headCellColor}>
            Note: IR = Internal Resistance
          </Text>

          <HStack spacing={4}>
            <HStack spacing={1}>
              <Box w="10px" h="10px" bg="#65A30D" borderRadius="2px" />
              <Text fontSize="10px" color={bodyText}>
                Good (&lt;0.60mΩ)
              </Text>
            </HStack>

            <HStack spacing={1}>
              <Box w="10px" h="10px" bg={warning} borderRadius="2px" />
              <Text fontSize="10px" color={bodyText}>
                Warning (0.60–1.00mΩ)
              </Text>
            </HStack>

            <HStack spacing={1}>
              <Box w="10px" h="10px" bg="#DC2626" borderRadius="2px" />
              <Text fontSize="10px" color={bodyText}>
                Poor (&gt;1.00mΩ)
              </Text>
            </HStack>
          </HStack>
        </Box>
      </ThemeProvider>
    </Box>
  );
}
