import { useMemo, useState, useRef, useEffect } from "react";
import { Box, Text, IconButton } from "@chakra-ui/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { FiMaximize, FiMinimize } from "react-icons/fi";

interface CappedDynamicTableProps {
    timelineData?: any[];
    summary?: {
        cycles_used_today: number;
        energy_cost: number;
        energy_revenue: number;
        net_profit: number;
        initial_soc: number;
        final_soc: number;
        total_charge_kwh: number;
        total_discharge_kwh: number;
    };
}

export default function CappedDynamicTable({
    timelineData = [],
    summary,
}: CappedDynamicTableProps) {
    const panelRef = useRef<HTMLDivElement>(null);

    const [isFullscreen, setIsFullscreen] = useState(false);

    /* pagination state */
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

    /* fullscreen detect */
    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", handler);
        return () => document.removeEventListener("fullscreenchange", handler);
    }, []);

    /*  change rows when fullscreen changes */
    useEffect(() => {
        setPagination({
            pageIndex: 0,
            pageSize: isFullscreen ? 15 : 6,
        });
    }, [isFullscreen]);

    const theme = useMemo(() => createTheme({ palette: { mode: "light" } }), []);

    /* ===== ALL COLUMNS FROM API ===== */

    const allColumns = useMemo<MRT_ColumnDef<any>[]>(() => {
        if (!timelineData.length) return [];

        const keys = Object.keys(timelineData[0]);

        return keys.map((key) => ({
            accessorKey: key,
            header: (() => {
                const label = key.replace(/_/g, " ").toUpperCase();
                return label.length > 12 ? label.slice(0, 10) + "..." : label;
            })(),

            size: isFullscreen ? 160 : 90,
            minSize: isFullscreen ? 120 : 70,
            maxSize: isFullscreen ? 220 : 100,

            Cell: ({ cell }: any) => (
                <Text fontSize="10px" whiteSpace="nowrap">
                    {cell.getValue() ?? "-"}
                </Text>
            ),
        }));
    }, [timelineData, isFullscreen]);

    /* ===== NORMAL VIEW → 6 COLUMNS ===== */

    const columns = useMemo(
        () => (isFullscreen ? allColumns : allColumns.slice(0, 6)),
        [isFullscreen, allColumns]
    );

    return (
        <Box ref={panelRef} width="100%">
            {/* FULLSCREEN BUTTON */}
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

                    /* controlled pagination */
                    state={{ pagination }}
                    onPaginationChange={setPagination}

                    muiTableHeadCellProps={{
                        align: "center",
                        sx: {
                            textAlign: "center",
                            py: 0.25,
                            px: 0.5,
                            fontSize: isFullscreen ? "12px" : "7px",

                            "& .Mui-TableHeadCell-Content": {
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "block",
                                width: "100%",
                            },

                            "& .Mui-TableHeadCell-Content-Labels": {
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            },
                        },
                    }}

                    muiTableBodyCellProps={{
                        align: "center",
                        sx: {
                            textAlign: "center",
                            whiteSpace: "nowrap",
                            py: 0.25,
                            px: 0.5,
                            fontSize: isFullscreen ? "13px" : "10px",
                        },
                    }}
                    muiTableBodyRowProps={{
                        sx: {
                            height: isFullscreen ? 38 : 26,
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
                            border: "1px solid #e6e9ef",
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
                    borderTop="1px solid #e6e9ef"
                    bg="#f8fafc"
                    position="relative"
                >
                    <Box
                        position="absolute"
                        whiteSpace="nowrap"
                        sx={{
                            animation: "tickerMove 20s linear infinite",
                        }}
                    >
                        <Text as="span" fontSize="11px" mr={8}>
                            Initial SOC: {summary.initial_soc}%
                        </Text>

                        <Text as="span" fontSize="11px" mr={8}>
                            Final SOC: {summary.final_soc}%
                        </Text>

                        <Text as="span" fontSize="11px" mr={8}>
                            Cycles Used: {summary.cycles_used_today}
                        </Text>

                        <Text as="span" fontSize="11px" mr={8}>
                            Energy Cost: ₹{summary.energy_cost}
                        </Text>

                        <Text as="span" fontSize="11px" mr={8}>
                            Energy Revenue: ₹{summary.energy_revenue}
                        </Text>

                        <Text as="span" fontSize="11px" mr={8}>
                            Net Profit: ₹{summary.net_profit}
                        </Text>

                        <Text as="span" fontSize="11px" mr={8}>
                            Total Charge: {summary.total_charge_kwh} kWh
                        </Text>

                        <Text as="span" fontSize="11px">
                            Total Discharge: {summary.total_discharge_kwh} kWh
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