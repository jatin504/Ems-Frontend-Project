import { useMemo, useState } from "react";
import {
  Box,
  Badge,
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

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
    newValue: number
  ) => {
    setTableRows((prevRows) =>
      prevRows.map((row, idx) =>
        idx === rowIndex
          ? {
              ...row,
              control: newValue,
              reductionNow: Number(
                (row.maxReduce * newValue / 100).toFixed(2)
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
        size: 170,
      },

      {
        accessorKey: "category",
        header: "Category",
        size: 110,
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
        size: 80,
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
        size: 95,
        Cell: ({ cell }) =>
          Number(cell.getValue()).toFixed(2),
      },

      {
        accessorKey: "maxReduce",
        header: "Max Reduce (MW)",
        size: 95,
        Cell: ({ cell }) =>
          Number(cell.getValue()).toFixed(2),
      },

      {
        accessorKey: "reductionNow",
        header: "Reduction Now (MW)",
        size: 100,
        Cell: ({ cell }) => (
          <Text
            color="#6AD64B"
            fontWeight="700"
          >
            {Number(cell.getValue()).toFixed(2)}
          </Text>
        ),
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
        size: 150,
        Cell: ({ cell, row }) => {
          const value = Number(cell.getValue());

          return (
            <HStack
              w="100%"
              justify="center"
              align="center"
              spacing={2}
              px={1}
            >
              <Box w="70px">
                <Slider
                  value={value}
                  min={0}
                  max={100}
                  focusThumbOnChange={false}
                  onChange={(v) => updateControlValue(row.index, v)}
                >
                  <SliderTrack
                    h="4px"
                    bg="#4B5563"
                    borderRadius="full"
                  >
                    <SliderFilledTrack
                      bg="#3B82F6"
                      borderRadius="full"
                    />
                  </SliderTrack>

                  <SliderThumb
                    w="10px"
                    h="10px"
                    bg="#3B82F6"
                    borderRadius="2px"
                    border="none"
                    boxShadow="none"
                    top="50%"
                    transform="translate(-50%, -50%)"
                    _focus={{ boxShadow: "none" }}
                  />
                </Slider>
              </Box>

              <Text
                w="34px"
                textAlign="right"
                fontSize="11px"
                fontWeight="600"
                color={bodyText}
              >
                {value}%
              </Text>
            </HStack>
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
          layoutMode="semantic"
          initialState={{
            density: "compact",
          }}
          muiTablePaperProps={{
            elevation: 0,
            sx: {
              height: "220px",
              background: tableBg,
              borderRadius: 0,
              boxShadow: "none",
            },
          }}
          muiTableContainerProps={{
            sx: {
              height: "180px",
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
            sx: {
              textAlign: "center",
              background: headCellBg,
              color: headCellColor,
              fontWeight: 600,
              fontSize: "11px",
              borderBottom: "1px solid #17324A",
              py: "6px",
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
            h="32px"
            px={4}
            justify="space-between"
            fontWeight="700"
          >
            <Text color={bodyText}>
              Total
            </Text>

            <HStack spacing="54px">
              <Text color={bodyText}>
                4.00
              </Text>

              <Text color={bodyText}>
                2.30
              </Text>

              <Text color="#65D64B">
                1.35
              </Text>

              <Box w="255px" />
            </HStack>
          </HStack>

          <Text
            px={4}
            py={2}
            fontSize="10px"
            color={headCellColor}
            borderTop="1px solid"
            borderColor="#17324A"
          >
            Note: Critical loads are always protected and cannot be shed.
          </Text>
        </Box>
      </ThemeProvider>
    </Box>
  );
}