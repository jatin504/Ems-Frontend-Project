import { useMemo, useState } from "react";
import {
  Box,
  Badge,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import MuiSwitch from "@mui/material/Switch";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

import { ThemeProvider, createTheme } from "@mui/material/styles";

interface LoadRow {
  loadName: string;
  category: string;
  priority: string;
  currentLoad: number;
  maxReduce: number;
  reductionNow: number;
  status: string;
  control: number;
  schedule: string;
}

const tableData: LoadRow[] = [
  {
    loadName: "HVAC - AHU 1,2,3",
    category: "Semi-Critical",
    priority: "High",
    currentLoad: 0.85,
    maxReduce: 0.40,
    reductionNow: 0.30,
    status: "Active",
    control: 70,
    schedule: "14:00 - 16:00",
  },
  {
    loadName: "Chiller Plant",
    category: "Semi-Critical",
    priority: "High",
    currentLoad: 1.10,
    maxReduce: 0.50,
    reductionNow: 0.40,
    status: "Active",
    control: 80,
    schedule: "13:30 - 16:30",
  },
  {
    loadName: "Lighting - Zone B",
    category: "Non-Critical",
    priority: "Medium",
    currentLoad: 0.35,
    maxReduce: 0.35,
    reductionNow: 0.35,
    status: "Active",
    control: 100,
    schedule: "13:00 - 17:00",
  },
  {
    loadName: "Water Pump - Secondary",
    category: "Non-Critical",
    priority: "Medium",
    currentLoad: 0.45,
    maxReduce: 0.25,
    reductionNow: 0.15,
    status: "Active",
    control: 60,
    schedule: "13:30 - 15:30",
  },
  {
    loadName: "Production Line B",
    category: "Non-Critical",
    priority: "Low",
    currentLoad: 0.75,
    maxReduce: 0.50,
    reductionNow: 0.15,
    status: "Standby",
    control: 0,
    schedule: "Not Scheduled",
  },
  {
    loadName: "Air Compressor 2",
    category: "Non-Critical",
    priority: "Low",
    currentLoad: 0.50,
    maxReduce: 0.30,
    reductionNow: 0.00,
    status: "Off",
    control: 0,
    schedule: "Not Scheduled",
  },
];

export default function ControllableLoads() {
  const bg = useColorModeValue("#ffffff", "#071A2B");
  const head = useColorModeValue("#F8FAFC", "#0B2438");
  const headText = useColorModeValue("#0F172A", "#FFFFFF");
  const tableBg = useColorModeValue("#FFFFFF", "#071A2B");
  const bodyText = useColorModeValue("#0F172A", "#E2E8F0");
  const headCellBg = useColorModeValue("#F8FAFC", "#0A2134");
  const headCellColor = useColorModeValue("#475569", "#94A3B8");
  const rowHoverBg = useColorModeValue("#F1F5F9", "#0C2B44");
  const scrollbarThumb = useColorModeValue("#CBD5E1", "#1F3B53");

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

  const [tableRows, setTableRows] = useState<LoadRow[]>(tableData);

  const updateControlValue = (
    rowIndex: number,
    enabled: boolean
  ) => {
    setTableRows((prevRows) =>
      prevRows.map((row, idx) =>
        idx === rowIndex
          ? {
              ...row,
              control: enabled ? 100 : 0,
              reductionNow: Number(
                (row.maxReduce * (enabled ? 100 : 0) / 100).toFixed(2)
              ),
            }
          : row
      )
    );
  };

  const columns = useMemo<MRT_ColumnDef<LoadRow>[]>(
    () => [
      {
        accessorKey: "loadName",
        header: "Load Name",
        size: 140,
      },

      {
        accessorKey: "category",
        header: "Category",
        size: 90,
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();

          return (
            <Badge
              px={2}
              py={1}
              borderRadius="5px"
              fontSize="10px"
              bg={
                value === "Semi-Critical"
                  ? "#5A3B09"
                  : "#1E4D2B"
              }
              color={
                value === "Semi-Critical"
                  ? "#F59E0B"
                  : "#7ED957"
              }
            >
              {value}
            </Badge>
          );
        },
      },

      {
        accessorKey: "priority",
        header: "Priority",
        size: 68,
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();

          const bg =
            value === "High"
              ? "#4A1F24"
              : value === "Medium"
              ? "#4A360C"
              : "#0F2E57";

          const color =
            value === "High"
              ? "#EF4444"
              : value === "Medium"
              ? "#F59E0B"
              : "#60A5FA";

          return (
            <Badge
              bg={bg}
              color={color}
              px={2}
              py={1}
              borderRadius="5px"
              fontSize="10px"
            >
              {value}
            </Badge>
          );
        },
      },

      {
        accessorKey: "currentLoad",
        header: "Current Load (MW)",
        size: 82,
        Cell: ({ cell }) =>
          Number(cell.getValue()).toFixed(2),
      },

      {
        accessorKey: "status",
        header: "Status",
        size: 90,
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();

          const color =
            value === "Active"
              ? "#5BC248"
              : value === "Standby"
              ? "#3B82F6"
              : "#64748B";

          return (
            <HStack spacing={1} justify="center">
              <Box
                w="8px"
                h="8px"
                borderRadius="full"
                bg={color}
              />

              <Text
                color={color}
                fontWeight="600"
                fontSize="11px"
              >
                {value}
              </Text>
            </HStack>
          );
        },
      },

      {
        accessorKey: "control",
        header: "Control Action",
        size: 120,
        Cell: ({ row }) => {
          const checked = row.original.control > 0;

          return (
            <MuiSwitch
              checked={checked}
              color="success"
              onChange={(e) =>
                updateControlValue(row.index, e.target.checked)
              }
            />
          );
        },
      },

      {
        accessorKey: "schedule",
        header: "Schedule",
        size: 110,
      },
    ],
    [bodyText]
  );
    return (
    <Box
      bg={bg}
      borderRadius="12px"
      overflow="hidden"
    >
      <HStack
        justify="space-between"
        px={4}
        h="34px"
        bg={head}
        borderBottom="1px solid #12334C"
      >
        <Text
          fontWeight="700"
          fontSize="14px"
          color={headText}
        >
          Controllable Loads
        </Text>
      </HStack>

      <ThemeProvider theme={theme}>
        <MaterialReactTable
          columns={columns}
          data={tableRows}
          enableTopToolbar={false}
          enableBottomToolbar={false}
          enableColumnActions={false}
          enableColumnFilters={false}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          enableHiding={false}
          enableSorting={false}
          enablePagination={false}
          enableStickyHeader
          layoutMode="semantic"
          initialState={{
            density: "compact",
          }}
          muiTablePaperProps={{
            elevation: 0,
            sx: {
              height: "240px",
              background: tableBg,
              borderRadius: 0,
              boxShadow: "none",
            },
          }}
          muiTableContainerProps={{
            sx: {
              height: "240px",
              overflowY: "auto",
              overflowX: "auto",

              "& .MuiTable-root": {
                minWidth: "760px",
              },

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
            sx: {
              textAlign: "center",
              background: headCellBg,
              color: headCellColor,
              fontWeight: 600,
              fontSize: "11px",
              borderBottom: "1px solid #17324A",
              py: "6px",
              px: "8px",
              whiteSpace: "nowrap",

              "& .Mui-TableHeadCell-Content": {
                justifyContent: "center",
              },
            },
          }}
          muiTableBodyCellProps={{
            sx: {
              textAlign: "center",
              verticalAlign: "middle",
              background: tableBg,
              color: bodyText,
              fontSize: "11px",
              borderBottom:
                "1px solid rgba(255,255,255,0.05)",
              py: "5px",
              px: "8px",
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

        {/* Footer */}
        <Box
          borderTop="1px solid"
          borderColor="#17324A"
          bg={tableBg}
        >
          <HStack
            h="24px"
            px={3}
            justify="space-between"
            fontWeight="700"
          >
            <Text color={bodyText} fontSize="11px">
              Total
            </Text>

            <HStack spacing="36px">
              <Text color={bodyText} fontSize="11px">
                4.00
              </Text>

              <Text color={bodyText} fontSize="11px">
                2.30
              </Text>

              <Text color="#65D64B" fontSize="11px">
                1.35
              </Text>

              <Box w="255px" />
            </HStack>
          </HStack>

        </Box>
      </ThemeProvider>
    </Box>
  );
}