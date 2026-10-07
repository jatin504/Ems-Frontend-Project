import React, { useMemo, useState } from "react";
import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  Badge,
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

/* =========================================================
   DUMMY DATA
========================================================= */

interface ScheduleItem {
  time: string;
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

/*
 * 15-minute dummy schedule
 */
const DUMMY_SCHEDULE: ScheduleItem[] = [
  {
    time: "00:00",
    load: 4000,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 4000,
    grid: 0,
    soc: 46.15,
    battery: 12.0,
    throughput: 0.0198,
    description:
      "PV supplies 0 kW. BESS discharges 4000 kW from energy above reserve. Grid imports 0 kW.",
  },
  {
    time: "00:15",
    load: 2180,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 2180,
    grid: 0,
    soc: 44.06,
    battery: 11.455,
    throughput: 0.0305,
    description:
      "PV supplies 0 kW. BESS discharges 2180 kW from energy above reserve. Grid imports 0 kW.",
  },
  {
    time: "00:30",
    load: 2150,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 2150,
    grid: 0,
    soc: 41.99,
    battery: 10.918,
    throughput: 0.0412,
    description:
      "PV supplies 0 kW. BESS discharges 2150 kW from energy above reserve. Grid imports 0 kW.",
  },
  {
    time: "00:45",
    load: 2120,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 2120,
    grid: 0,
    soc: 39.95,
    battery: 10.388,
    throughput: 0.0516,
    description:
      "PV supplies 0 kW. BESS discharges 2120 kW from energy above reserve. Grid imports 0 kW.",
  },
  {
    time: "01:00",
    load: 2100,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 2100,
    grid: 0,
    soc: 37.92,
    battery: 9.870,
    throughput: 0.0618,
    description:
      "PV supplies 0 kW. BESS continues discharging during the off-peak period.",
  },
  {
    time: "01:15",
    load: 2080,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 2080,
    grid: 0,
    soc: 35.92,
    battery: 9.360,
    throughput: 0.0718,
    description:
      "BESS supplies the complete load requirement with no grid import.",
  },
  {
    time: "01:30",
    load: 2050,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 2050,
    grid: 0,
    soc: 33.95,
    battery: 8.858,
    throughput: 0.0817,
    description:
      "BESS discharges to support the load while maintaining reserve energy.",
  },
  {
    time: "01:45",
    load: 2020,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 2020,
    grid: 0,
    soc: 32.01,
    battery: 8.363,
    throughput: 0.0915,
    description:
      "BESS supplies 2020 kW and grid import remains at 0 kW.",
  },
  {
    time: "02:00",
    load: 2000,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 2000,
    grid: 0,
    soc: 30.10,
    battery: 7.875,
    throughput: 0.1012,
    description:
      "BESS discharges 2000 kW from available battery energy.",
  },
  {
    time: "02:15",
    load: 1980,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 1980,
    grid: 0,
    soc: 28.22,
    battery: 7.395,
    throughput: 0.1108,
    description:
      "BESS continues discharge operation with zero grid import.",
  },
  {
    time: "02:30",
    load: 1950,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 1950,
    grid: 0,
    soc: 26.37,
    battery: 6.923,
    throughput: 0.1203,
    description:
      "Battery energy is used to meet the complete load requirement.",
  },
  {
    time: "02:45",
    load: 1920,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 1920,
    grid: 0,
    soc: 24.56,
    battery: 6.458,
    throughput: 0.1296,
    description:
      "BESS discharges 1920 kW while maintaining the reserve target.",
  },
  {
    time: "03:00",
    load: 1900,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 1900,
    grid: 0,
    soc: 22.77,
    battery: 6.005,
    throughput: 0.1388,
    description:
      "BESS continues supplying the load during off-peak hours.",
  },
  {
    time: "03:15",
    load: 1880,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 1880,
    grid: 0,
    soc: 21.00,
    battery: 5.558,
    throughput: 0.1480,
    description:
      "Battery discharge continues with no PV generation.",
  },
  {
    time: "03:30",
    load: 1850,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 1850,
    grid: 0,
    soc: 19.25,
    battery: 5.125,
    throughput: 0.1570,
    description:
      "BESS supplies load while preserving the minimum reserve.",
  },
  {
    time: "03:45",
    load: 1820,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 1820,
    grid: 0,
    soc: 17.53,
    battery: 4.698,
    throughput: 0.1659,
    description:
      "BESS discharge operation continues at 1820 kW.",
  },
  {
    time: "04:00",
    load: 1800,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 1800,
    grid: 0,
    soc: 15.83,
    battery: 4.285,
    throughput: 0.1747,
    description:
      "BESS supplies the load from available stored energy.",
  },
  {
    time: "04:15",
    load: 1750,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 1750,
    grid: 0,
    soc: 14.18,
    battery: 3.888,
    throughput: 0.1832,
    description:
      "Battery discharge continues during the off-peak period.",
  },
  {
    time: "04:30",
    load: 1700,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 1700,
    grid: 0,
    soc: 12.55,
    battery: 3.505,
    throughput: 0.1915,
    description:
      "BESS supplies 1700 kW with zero grid import.",
  },
  {
    time: "04:45",
    load: 1650,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 1650,
    grid: 0,
    soc: 11.02,
    battery: 3.138,
    throughput: 0.1995,
    description:
      "BESS continues discharge while approaching reserve level.",
  },
  {
    time: "05:00",
    load: 1600,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 1600,
    grid: 0,
    soc: 9.53,
    battery: 2.785,
    throughput: 0.2073,
    description:
      "BESS supplies 1600 kW from available stored energy.",
  },
  {
    time: "05:15",
    load: 1550,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 1550,
    grid: 0,
    soc: 8.08,
    battery: 2.448,
    throughput: 0.2148,
    description:
      "BESS discharge continues while maintaining reserve.",
  },
  {
    time: "05:30",
    load: 1500,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 1500,
    grid: 0,
    soc: 6.67,
    battery: 2.125,
    throughput: 0.2221,
    description:
      "BESS supplies the load from battery energy.",
  },
  {
    time: "05:45",
    load: 1450,
    pv: 0,
    tariff: 2.0,
    state: "Off Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 1450,
    grid: 0,
    soc: 5.30,
    battery: 1.818,
    throughput: 0.2291,
    description:
      "BESS reaches the minimum reserve threshold.",
  },
  {
    time: "06:00",
    load: 2200,
    pv: 400,
    tariff: 4.5,
    state: "Peak",
    decision: "Discharge",
    charge: 0,
    discharge: 1800,
    grid: 0,
    soc: 4.95,
    battery: 1.700,
    throughput: 0.2380,
    description:
      "PV supplies 400 kW and BESS supports the remaining load during peak tariff.",
  },
  {
    time: "06:15",
    load: 2400,
    pv: 550,
    tariff: 4.5,
    state: "Peak",
    decision: "Charge",
    charge: 500,
    discharge: 0,
    grid: 1350,
    soc: 7.20,
    battery: 2.450,
    throughput: 0.2405,
    description:
      "PV generation increases. BESS begins charging using available excess energy.",
  },
  {
    time: "06:30",
    load: 2600,
    pv: 800,
    tariff: 4.5,
    state: "Peak",
    decision: "Charge",
    charge: 700,
    discharge: 0,
    grid: 1100,
    soc: 10.10,
    battery: 3.450,
    throughput: 0.2440,
    description:
      "BESS charges to restore energy reserve while PV contributes to the load.",
  },
  {
    time: "06:45",
    load: 2800,
    pv: 1100,
    tariff: 4.5,
    state: "Peak",
    decision: "Charge",
    charge: 800,
    discharge: 0,
    grid: 900,
    soc: 13.40,
    battery: 4.450,
    throughput: 0.2480,
    description:
      "BESS charging continues as PV generation increases.",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

const NextDaySchedule: React.FC = () => {
  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const selected =
    DUMMY_SCHEDULE[selectedIndex];

  /* =========================================================
     SUMMARY
  ========================================================= */

  const summary = useMemo(() => {
    const intervalHours = 0.25;

    const totalCharge = DUMMY_SCHEDULE.reduce(
      (sum, item) =>
        sum +
        (item.charge * intervalHours) /
          1000,
      0
    );

    const totalDischarge =
      DUMMY_SCHEDULE.reduce(
        (sum, item) =>
          sum +
          (item.discharge *
            intervalHours) /
            1000,
        0
      );

    const totalGridImport =
      DUMMY_SCHEDULE.reduce(
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
  }, []);

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
      width="100%"
      height="100%"
      minHeight="0"
      bg="#FFFFFF"
      borderRadius="16px"
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
              22 Sep 2026
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
                {DUMMY_SCHEDULE.map(
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