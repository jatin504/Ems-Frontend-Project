import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  Badge,
  IconButton,
  Progress,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import {
  FiCalendar,
  FiFileText,
  FiSun,
  FiZap,
  FiArrowUp,
  FiArrowDown,
  FiBattery,
  FiRefreshCw,
  FiGrid,
} from "react-icons/fi";
import { ExpandIcon, SqeezIcon } from "../../../assets/Icons";
const emsScheduleUrl = new URL(import.meta.env.VITE_API_BASE);
emsScheduleUrl.port = import.meta.env.VITE_API_PORT;
emsScheduleUrl.pathname = "/api/ems-schedule";
const EMS_SCHEDULE_API = emsScheduleUrl.toString();
interface ScheduleItem {
  time: string;
  timeStamp: string;
  load: number;
  pv: number;
  tariff: number;
  state: string;
  decision: string;
  charge: number;
  discharge: number;
  grid: number;
  soc: number;
  battery: number;
  throughput: number;
  description: string;
}
interface ApiSchedule {
  time_stamp?: string;
  load_kw?: number;
  pv_kw?: number;
  tariff_per_kw?: number;
  load_state?: string;
  decision?: string;
  charge_kw?: number;
  discharge_kw?: number;
  grid_import_kw?: number;
  soc_percent?: number;
  battery_energy_mwh?: number;
  throughput_cycles?: number;
  description?: string;
  is_pass?: boolean;
}
interface EMScheduleResponse {
  success: boolean;
  count: number;
  schedule: ApiSchedule[];
  message?: string;
  error?: string;
}
const toNumber = (value: unknown, fallback = 0): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};
const formatTime = (timestamp?: string): string => {
  if (!timestamp) return "--";
  const parts = timestamp.split(" ");
  return parts[1]?.substring(0, 5) || parts[0]?.substring(0, 5) || "--";
};
const formatDate = (timestamp?: string): string => {
  if (!timestamp) return "--";
  const datePart = timestamp.split(" ")[0];
  const [year, month, day] = datePart.split("-").map(Number);
  if (!year || !month || !day) return "--";
  return `${day} ${new Date(year, month - 1, day).toLocaleString("en-US", {
    month: "short",
  })} ${year}`;
};
const mapApiSchedule = (item: ApiSchedule): ScheduleItem => ({
  time: formatTime(item.time_stamp),
  timeStamp: item.time_stamp || "",
  load: toNumber(item.load_kw),
  pv: toNumber(item.pv_kw),
  tariff: toNumber(item.tariff_per_kw),
  state: item.load_state || "--",
  decision: item.decision || "--",
  charge: toNumber(item.charge_kw),
  discharge: toNumber(item.discharge_kw),
  grid: toNumber(item.grid_import_kw),
  soc: toNumber(item.soc_percent),
  battery: toNumber(item.battery_energy_mwh),
  throughput: toNumber(item.throughput_cycles),
  description: item.description || "--",
});
/* =========================================================
   COMPONENT
========================================================= */
const NextDaySchedule: React.FC = () => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [schedules, setSchedules] =
    useState<ScheduleItem[]>([]);
  const [selectedIndex, setSelectedIndex] =
    useState(0);
  const [isFullscreen, setIsFullscreen] =
    useState(false);
  useEffect(() => {
    let mounted = true;
    const fetchSchedule = async () => {
      try {
        const response = await fetch(EMS_SCHEDULE_API, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`API failed: ${response.status}`);
        }
        const result: EMScheduleResponse = await response.json();
        if (!result.success) {
          throw new Error(
            result.message ||
              result.error ||
              "EMS schedule API failed"
          );
        }
        const mappedSchedules = Array.isArray(result.schedule)
          ? result.schedule
              .filter((item) => item.is_pass === true)
              .map(mapApiSchedule)
          : [];
        if (mounted) {
          setSchedules(mappedSchedules);
          setSelectedIndex(0);
        }
      } catch (error) {
        console.error("EMS Schedule API Error:", error);
        if (mounted) {
          setSchedules([]);
        }
      }
    };
    fetchSchedule();
    return () => {
      mounted = false;
    };
  }, []);
  const selected =
    schedules.length > 0
      ? schedules[Math.min(selectedIndex, schedules.length - 1)]
      : null;
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === widgetRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    const widget = widgetRef.current;
    if (!widget) return;

    try {
      if (document.fullscreenElement === widget) {
        await document.exitFullscreen();
      } else {
        await widget.requestFullscreen();
      }
    } catch (error) {
      console.error("Failed to toggle schedule fullscreen:", error);
    }
  };
  /* =========================================================
     SUMMARY
  ========================================================= */
  const summary = useMemo(() => {
    const intervalHours = 0.25;
    const totalCharge = schedules.reduce(
      (sum, item) =>
        sum +
        (item.charge * intervalHours) /
          1000,
      0
    );
    const totalDischarge =
      schedules.reduce(
        (sum, item) =>
          sum +
          (item.discharge *
            intervalHours) /
            1000,
        0
      );
    const totalGridImport =
      schedules.reduce(
        (sum, item) =>
          sum +
          (item.grid * intervalHours) /
            1000,
        0
      );
    return {
      charge: totalCharge,
      discharge: totalDischarge,
      grid: totalGridImport,
    };
  }, [schedules]);
  if (!selected) {
    return null;
  }
  /* =========================================================
     DECISION STYLE
  ========================================================= */
  const getDecisionStyle = (
    decision: string
  ) => {
    if (
      decision.toLowerCase() ===
      "discharge"
    ) {
      return {
        bg: "#FFE1E4",
        color: "#EF4444",
      };
    }
    if (
      decision.toLowerCase() ===
      "charge"
    ) {
      return {
        bg: "#DDF7EC",
        color: "#10A568",
      };
    }
    return {
      bg: "#E5E7EB",
      color: "#374151",
    };
  };
  /* =========================================================
     STATE STYLE
  ========================================================= */
  const getStateStyle = (
    state: string
  ) => {
    if (
      state.toLowerCase() ===
      "peak"
    ) {
      return {
        bg: "#FFF0E5",
        color: "#EA580C",
      };
    }
    return {
      bg: "#DDEEFF",
      color: "#0878E8",
    };
  };
  const decisionStyle =
    getDecisionStyle(
      selected.decision
    );
  const stateStyle =
    getStateStyle(
      selected.state
    );
  /* =========================================================
     NUMBER FORMAT
  ========================================================= */
  const formatNumber = (
    value: number,
    decimals = 0
  ) => {
    return value.toLocaleString(
      "en-IN",
      {
        minimumFractionDigits:
          decimals,
        maximumFractionDigits:
          decimals,
      }
    );
  };
  /* =========================================================
     UI
  ========================================================= */
  return (
    <Box
      ref={widgetRef}
      width={isFullscreen ? "100vw" : "100%"}
      height={isFullscreen ? "100vh" : "100%"}
      minHeight="0"
      position={isFullscreen ? "fixed" : "relative"}
      top={isFullscreen ? 0 : "auto"}
      left={isFullscreen ? 0 : "auto"}
      right={isFullscreen ? 0 : "auto"}
      bottom={isFullscreen ? 0 : "auto"}
      bg="#FFFFFF"
      borderRadius={isFullscreen ? 0 : "16px"}
      border="1px solid #E4EAF1"
      overflow="hidden"
      boxShadow="0 3px 14px rgba(20, 40, 70, 0.05)"
    >
      {/* ===================================================
          HEADER
      =================================================== */}
      <Flex
        height="70px"
        px="24px"
        align="center"
        justify="space-between"
        borderBottom="1px solid #E6EBF1"
      >
        {/* LEFT */}
        <HStack spacing="13px">
          <Box
            width="30px"
            height="30px"
            borderRadius="7px"
            bg="#EAF3FF"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon
              as={FiCalendar}
              boxSize="17px"
              color="#075DBB"
            />
          </Box>
          <Text
            fontSize="17px"
            fontWeight="700"
            color="#102452"
            letterSpacing="-0.3px"
          >
            Next Day Schedule
          </Text>
          <Box
            width="1px"
            height="34px"
            bg="#D6DCE5"
            mx="4px"
          />
          {/* DATE */}
          <Flex
            height="32px"
            px="9px"
            borderRadius="8px"
            bg="#F5F8FC"
            border="1px solid #E4EAF1"
            align="center"
            gap="6px"
          >
            <Icon
              as={FiCalendar}
              boxSize="17px"
              color="#40506A"
            />
            <Text
              fontSize="10px"
              fontWeight="700"
              color="#243552"
            >
              {selected?.timeStamp
                ? formatDate(selected.timeStamp)
                : "--"}
            </Text>
          </Flex>
          <Box
            width="40px"
            height="40px"
            borderRadius="50%"
            bg="#F4F7FB"
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            color="#243552"
            _hover={{
              bg: "#E8F1FD",
              color: "#1769D2",
            }}
          >
            <Text
              fontSize="25px"
              mt="-3px"
            >
              ›
            </Text>
          </Box>
        </HStack>
        {/* =================================================
            SUMMARY CARDS
        ================================================= */}
        <HStack spacing="12px">
          <SummaryCard
            icon={FiZap}
            iconColor="#10B981"
            title="Total Charge"
            value={`${formatNumber(
              summary.charge,
              1
            )} MWh`}
          />
          <SummaryCard
            icon={FiZap}
            iconColor="#F97316"
            title="Total Discharge"
            value={`${formatNumber(
              summary.discharge,
              1
            )} MWh`}
          />
          <SummaryCard
            icon={FiGrid}
            iconColor="#253858"
            title="Total Grid Import"
            value={`${formatNumber(
              summary.grid,
              1
            )} MWh`}
          />
          <IconButton
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            icon={isFullscreen ? <SqeezIcon /> : <ExpandIcon />}
            size="xs"
            w="32px"
            h="32px"
            minW="32px"
            borderRadius="4px"
            variant="outline"
            borderColor="#D7E0EA"
            bg="white"
            color="#243552"
            _hover={{ bg: "#E8F1FD", color: "#1769D2" }}
            onClick={toggleFullscreen}
          />
        </HStack>
      </Flex>
      {/* ===================================================
          BODY
      =================================================== */}
      <Flex
        width="100%"
        height="calc(100% - 70px)"
        minHeight="0"
      >
        {/* =================================================
            LEFT TABLE
        ================================================= */}
        <Box
          width="70%"
          borderRight="1px solid #E5EAF0"
          px="14px"
          py="10px"
        >
          <TableContainer
            height="100%"
            maxHeight="none"
            overflowY="auto"
            overflowX="hidden"
            sx={{
              "&::-webkit-scrollbar": {
                width: "7px",
              },
              "&::-webkit-scrollbar-track":
                {
                  background:
                    "#F4F6F8",
                  borderRadius:
                    "10px",
                },
              "&::-webkit-scrollbar-thumb":
                {
                  background:
                    "#B9C3D0",
                  borderRadius:
                    "10px",
                },
            }}
          >
            <Table
              size="sm"
              variant="simple"
              sx={{
                tableLayout:
                  "fixed",
              }}
            >
              <Thead
                position="sticky"
                top={0}
                zIndex={2}
                bg="#F8FAFD"
              >
                <Tr>
                  <TableHeader width="7%">
                    Time
                  </TableHeader>
                  <TableHeader width="9%">
                    Load
                    <br />
                    (kW)
                  </TableHeader>
                  <TableHeader width="8%">
                    PV
                    <br />
                    (kW)
                  </TableHeader>
                  <TableHeader width="10%">
                    Tariff
                    <br />
                    (₹/kWh)
                  </TableHeader>
                  <TableHeader width="11%">
                    State
                  </TableHeader>
                  <TableHeader width="12%">
                    Decision
                  </TableHeader>
                  <TableHeader width="10%">
                    Charge
                    <br />
                    (kW)
                  </TableHeader>
                  <TableHeader width="11%">
                    Discharge
                    <br />
                    (kW)
                  </TableHeader>
                  <TableHeader width="9%">
                    Grid
                    <br />
                    (kW)
                  </TableHeader>
                  <TableHeader width="7%">
                    SOC
                    <br />
                    (%)
                  </TableHeader>
                  <TableHeader width="11%">
                    Battery
                    <br />
                    (MWh)
                  </TableHeader>
                </Tr>
              </Thead>
              <Tbody>
                {schedules.map(
                  (item, index) => {
                    const itemDecision =
                      getDecisionStyle(
                        item.decision
                      );
                    const itemState =
                      getStateStyle(
                        item.state
                      );
                    const selectedRow =
                      index ===
                      selectedIndex;
                    return (
                      <Tr
                        key={item.time}
                        onClick={() =>
                          setSelectedIndex(
                            index
                          )
                        }
                        cursor="pointer"
                        bg={
                          selectedRow
                            ? "#EAF4FF"
                            : "#FFFFFF"
                        }
                        transition="0.15s"
                        borderBottom="1px solid #EDF1F5"
                        _hover={{
                          bg: "#F3F8FE",
                        }}
                      >
                        <TableCell
                          fontWeight={
                            selectedRow
                              ? "700"
                              : "500"
                          }
                          color="#172B4D"
                        >
                          {
                            item.time
                          }
                        </TableCell>
                        <TableCell>
                          {formatNumber(
                            item.load
                          )}
                        </TableCell>
                        <TableCell>
                          {formatNumber(
                            item.pv
                          )}
                        </TableCell>
                        <TableCell>
                          {formatNumber(
                            item.tariff,
                            1
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            px="5px"
                            py="3px"
                            borderRadius="5px"
                            bg={
                              itemState.bg
                            }
                            color={
                              itemState.color
                            }
                            fontSize="7px"
                            fontWeight="600"
                          >
                            {
                              item.state
                            }
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            px="5px"
                            py="3px"
                            borderRadius="5px"
                            bg={
                              itemDecision.bg
                            }
                            color={
                              itemDecision.color
                            }
                            fontSize="7px"
                            fontWeight="700"
                          >
                            {
                              item.decision
                            }
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatNumber(
                            item.charge
                          )}
                        </TableCell>
                        <TableCell>
                          {formatNumber(
                            item.discharge
                          )}
                        </TableCell>
                        <TableCell>
                          {formatNumber(
                            item.grid
                          )}
                        </TableCell>
                        <TableCell fontWeight="600">
                          {formatNumber(
                            item.soc,
                            2
                          )}
                        </TableCell>
                        <TableCell fontWeight="600">
                          {formatNumber(
                            item.battery,
                            3
                          )}
                        </TableCell>
                      </Tr>
                    );
                  }
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
        {/* =================================================
            RIGHT DETAILS
        ================================================= */}
        <Box
          width="30%"
          px="18px"
          py="10px"
          overflowY="auto"
          height="100%"
        >
          {/* SELECTED TIME */}
          <Flex
            height="48px"
            px="16px"
            borderRadius="11px"
            bg="#EAF3FF"
            align="center"
            justify="space-between"
            mb="9px"
          >
            <Text
              fontSize="17px"
              fontWeight="800"
              color="#132D61"
            >
              {selected.time}
            </Text>
            <Badge
              px="7px"
              py="3px"
              borderRadius="5px"
              bg={stateStyle.bg}
              color={stateStyle.color}
              fontSize="7px"
              fontWeight="700"
            >
              {selected.state}
            </Badge>
          </Flex>
          {/* DETAILS */}
          <DetailRow
            icon={FiFileText}
            iconColor="#253858"
            label="Load"
            value={`${formatNumber(
              selected.load
            )} kW`}
          />
          <DetailRow
            icon={FiSun}
            iconColor="#F59E0B"
            label="PV"
            value={`${formatNumber(
              selected.pv
            )} kW`}
          />
          <DetailRow
            icon={FiZap}
            iconColor="#F59E0B"
            label="Tariff"
            value={`₹ ${formatNumber(
              selected.tariff,
              1
            )} /kWh`}
          />
          <DetailRow
            icon={FiZap}
            iconColor="#2563EB"
            label="Decision"
            value={
              <Badge
                px="5px"
                py="3px"
                borderRadius="5px"
                bg={
                  decisionStyle.bg
                }
                color={
                  decisionStyle.color
                }
                fontSize="7px"
                fontWeight="700"
              >
                {
                  selected.decision
                }
              </Badge>
            }
          />
          <DetailRow
            icon={FiArrowUp}
            iconColor="#16A34A"
            label="Charge"
            value={`${formatNumber(
              selected.charge
            )} kW`}
          />
          <DetailRow
            icon={FiArrowDown}
            iconColor="#EF4444"
            label="Discharge"
            value={`${formatNumber(
              selected.discharge
            )} kW`}
          />
          <DetailRow
            icon={FiGrid}
            iconColor="#253858"
            label="Grid Import"
            value={`${formatNumber(
              selected.grid
            )} kW`}
          />
          {/* =================================================
              SOC
          ================================================= */}
          <Box
            py="5px"
            borderBottom="1px solid #E9EEF4"
          >
            <Flex
              align="center"
              justify="space-between"
              mb="6px"
            >
              <HStack spacing="6px">
                <Icon
                  as={FiBattery}
                  boxSize="13px"
                  color="#2563EB"
                />
                <Text
                  fontSize="9px"
                  color="#263B5B"
                >
                  SOC
                </Text>
              </HStack>
              <Text
                fontSize="9px"
                fontWeight="700"
                color="#172B4D"
              >
                {formatNumber(
                  selected.soc,
                  2
                )}{" "}
                %
              </Text>
            </Flex>
            <Progress
              value={selected.soc}
              height="6px"
              borderRadius="10px"
              bg="#E8EDF3"
              sx={{
                "& > div": {
                  background:
                    "linear-gradient(90deg, #3B82F6, #3BA4F5)",
                  borderRadius:
                    "10px",
                },
              }}
            />
          </Box>
          {/* =================================================
              BATTERY ENERGY
          ================================================= */}
          <Box
            py="5px"
            borderBottom="1px solid #E9EEF4"
          >
            <Flex
              align="center"
              justify="space-between"
              mb="6px"
            >
              <HStack spacing="6px">
                <Icon
                  as={FiBattery}
                  boxSize="13px"
                  color="#10B981"
                />
                <Text
                  fontSize="9px"
                  color="#263B5B"
                >
                  Battery Energy
                </Text>
              </HStack>
              <Text
                fontSize="9px"
                fontWeight="700"
                color="#172B4D"
              >
                {formatNumber(
                  selected.battery,
                  3
                )}{" "}
                MWh
              </Text>
            </Flex>
            <Progress
              value={Math.min(
                100,
                (selected.battery /
                  26) *
                  100
              )}
              height="6px"
              borderRadius="10px"
              bg="#E8EDF3"
              sx={{
                "& > div": {
                  background:
                    "linear-gradient(90deg, #16C79A, #14C9B0)",
                  borderRadius:
                    "10px",
                },
              }}
            />
          </Box>
          {/* THROUGHPUT */}
          <DetailRow
            icon={FiRefreshCw}
            iconColor="#2563EB"
            label="Throughput Cycles"
            value={formatNumber(
              selected.throughput,
              4
            )}
          />
          {/* =================================================
              DESCRIPTION
          ================================================= */}
          <Box
            mt="6px"
            p="8px"
            borderRadius="7px"
            bg="#EEF6FF"
          >
            <HStack
              spacing="6px"
              mb="5px"
            >
              <Icon
                as={FiFileText}
                boxSize="18px"
                color="#2563EB"
              />
              <Text
                fontSize="9px"
                fontWeight="700"
                color="#163B73"
              >
                Description
              </Text>
            </HStack>
            <Text
              fontSize="8px"
              lineHeight="1.35"
              color="#385274"
            >
              {
                selected.description
              }
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};
/* =========================================================
   SUMMARY CARD
========================================================= */
interface SummaryCardProps {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  value: string;
}
const SummaryCard: React.FC<
  SummaryCardProps
> = ({
  icon,
  iconColor,
  title,
  value,
}) => {
  return (
    <Box
      minWidth="105px"
      height="42px"
      px="8px"
      borderRadius="8px"
      bg="#F7F9FC"
      border="1px solid #E6EBF1"
      display="flex"
      alignItems="center"
      gap="6px"
    >
      <Icon
        as={icon}
        boxSize="15px"
        color={iconColor}
      />
      <VStack
        align="start"
        spacing={0}
      >
        <Text
          fontSize="8px"
          color="#52627A"
          lineHeight="1.1"
        >
          {title}
        </Text>
        <Text
          fontSize="11px"
          fontWeight="800"
          color="#14213D"
          lineHeight="1.2"
        >
          {value}
        </Text>
      </VStack>
    </Box>
  );
};
/* =========================================================
   TABLE HEADER
========================================================= */
const TableHeader = ({
  children,
  width,
}: {
  children: React.ReactNode;
  width: string;
}) => {
  return (
    <Th
      width={width}
      px="4px"
      py="6px"
      textAlign="center"
      fontSize="8px"
      fontWeight="700"
      color="#1D2D47"
      whiteSpace="nowrap"
      textTransform="none"
      borderBottom="1px solid #E2E8F0"
    >
      {children}
    </Th>
  );
};
/* =========================================================
   TABLE CELL
========================================================= */
const TableCell = ({
  children,
  fontWeight,
  color,
}: {
  children: React.ReactNode;
  fontWeight?: string | number;
  color?: string;
}) => {
  return (
    <Td
      px="4px"
      py="5px"
      textAlign="center"
      fontSize="9px"
      fontWeight={
        fontWeight || "500"
      }
      color={
        color || "#26364F"
      }
      whiteSpace="nowrap"
      borderBottom="1px solid #EDF1F5"
    >
      {children}
    </Td>
  );
};
/* =========================================================
   DETAIL ROW
========================================================= */
interface DetailRowProps {
  icon: React.ElementType;
  iconColor: string;
  label: string;
  value: React.ReactNode;
}
const DetailRow: React.FC<
  DetailRowProps
> = ({
  icon,
  iconColor,
  label,
  value,
}) => {
  return (
    <Flex
      minHeight="29px"
      align="center"
      justify="space-between"
      borderBottom="1px solid #E9EEF4"
    >
      <HStack spacing="6px">
        <Icon
          as={icon}
          boxSize="13px"
          color={iconColor}
        />
        <Text
          fontSize="9px"
          color="#263B5B"
        >
          {label}
        </Text>
      </HStack>
      <Box
        fontSize="9px"
        fontWeight="700"
        color="#172B4D"
      >
        {value}
      </Box>
    </Flex>
  );
};
export default NextDaySchedule;