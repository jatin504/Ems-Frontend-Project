import React, { useEffect, useMemo } from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  FaBolt,
  FaBatteryThreeQuarters,
  FaLeaf,
  FaCheckCircle,
} from "react-icons/fa";

import {
  MdElectricBolt,
  MdOutlinePower,
} from "react-icons/md";

import { BsLightningCharge } from "react-icons/bs";
import { GiBatteryPack } from "react-icons/gi";

import useTimeseriesData from "../../../hooks/useTimeseriesData";
import type { TimeseriesDataSource } from "../../../types/timeseries/datasource";

interface CardProps {
  icon: any;
  iconColor: string;
  title: string;
  value: string;
  unit?: string;
}

const SummaryCard = ({
  icon,
  iconColor,
  title,
  value,
  unit,
}: CardProps) => {
  const bg = useColorModeValue("#ffffff", "#0F172A");
  const border = useColorModeValue("#E2E8F0", "#233244");
  const titleColor = useColorModeValue("#64748B", "#94A3B8");
  const valueColor = useColorModeValue("#1E293B", "#F8FAFC");

  return (
    <Box
      flex="1"
      h="76px"
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="10px"
      px={4}
      display="flex"
      alignItems="center"
    >
      <HStack spacing={3} w="100%">
        <Box
          w="38px"
          h="38px"
          borderRadius="full"
          border="1px solid"
          borderColor={iconColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon
            as={icon}
            color={iconColor}
            boxSize={4}
          />
        </Box>

        <VStack
          spacing={0}
          align="start"
        >
          <Text
            fontSize="11px"
            color={titleColor}
          >
            {title}
          </Text>

          <Text
            fontSize="18px"
            fontWeight="700"
            color={valueColor}
            lineHeight="20px"
          >
            {value}

            {unit && (
              <Text
                as="span"
                ml={1}
                fontSize="13px"
                fontWeight="500"
              >
                {unit}
              </Text>
            )}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

interface Props {
  rackId: string;
}

interface SeriesPoint {
  ts: number;
  value: number;
}

interface RackTimeseriesData {
  [key: string]: SeriesPoint[] | any;
}

export default function RackSummary({ rackId }: Props) {
  const {
    data,
    loading,
    error,
    fetchData,
  } = useTimeseriesData();

  /*
   * -------------------------------------------------------
   * TIMESERIES REQUEST
   * -------------------------------------------------------
   *
   * Only the selected rack device_id is sent.
   *
   * Example:
   *
   * plant_1_pcs_2_bank_bank_1_rack_rack_3
   *
   */

  const rackFetch: TimeseriesDataSource = useMemo(
    () => ({
      devices: {
        patterns: [],
        ids: rackId ? [rackId] : [],
      },

      keys: [
        {
          key: "total_voltage",
          alias: "Rack Voltage",
          keyType: "common",
        },
        {
          key: "current",
          alias: "Rack Current",
          keyType: "common",
        },
        {
          key: "soc",
          alias: "SOC",
          keyType: "common",
        },
        {
          key: "soe",
          alias: "SOE",
          keyType: "common",
        },
        {
          key: "soh",
          alias: "SOH",
          keyType: "common",
        },
        {
          key: "available_energy",
          alias: "Available Energy",
          keyType: "common",
        },
        {
          key: "active_power",
          alias: "Rack Power",
          keyType: "common",
        },
      ],

      aggregation: {
        func: "last",
        interval: 1,
        intervalType: "minute",
      },

      timeRange: {
        type: "relative",
        relativeType: "currentDaySoFar",
      },

      orderBy: "DESC",
    }),
    [rackId]
  );

  /*
   * -------------------------------------------------------
   * FETCH SELECTED RACK DATA
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (!rackId) {
      return;
    }

    fetchData(rackFetch);
  }, [rackId, rackFetch]);

  /*
   * -------------------------------------------------------
   * GET SELECTED RACK RESPONSE
   * -------------------------------------------------------
   */

  const rackData = useMemo(() => {
    if (!data || !rackId) {
      return null;
    }

    const root = (data as any)?.data ?? data;

    return (root?.[rackId] ?? null) as RackTimeseriesData | null;
  }, [data, rackId]);

  /*
   * -------------------------------------------------------
   * GET LAST VALUE FROM TIMESERIES
   * -------------------------------------------------------
   */

  const getValue = (
    aliases: string[],
    fallback = "--"
  ): string => {
    if (!rackData) {
      return fallback;
    }

    for (const alias of aliases) {
      const series = rackData[alias];

      if (
        Array.isArray(series) &&
        series.length > 0
      ) {
        const point = series[0];

        if (
          point?.value !== null &&
          point?.value !== undefined
        ) {
          return String(point.value);
        }
      }
    }

    return fallback;
  };

  /*
   * -------------------------------------------------------
   * VALUES
   * -------------------------------------------------------
   */

  const voltage = getValue([
    "Rack Voltage",
    "voltage",
    "Voltage",
  ]);

  const current = getValue([
    "Rack Current",
    "current",
    "Current",
  ]);

  const soc = getValue([
    "SOC",
    "soc",
    "SoC",
  ]);

  const soe = getValue([
    "SOE",
    "soe",
    "SoE",
  ]);

  const soh = getValue([
    "SOH",
    "soh",
    "SoH",
  ]);

  const availableEnergy = getValue([
    "Available Energy",
    "available_energy",
    "Available_Energy",
  ]);

  const rackPower = getValue([
    "Rack Power",
    "active_power",
    "Active_power",
    "Active_Power",
  ]);

  /*
   * -------------------------------------------------------
   * STATUS
   * -------------------------------------------------------
   */

  const status = loading
    ? "Loading"
    : error
      ? "Error"
      : rackData
        ? "Normal"
        : "No Data";

  return (
    <HStack spacing={4} mb={0}>

      <SummaryCard
        icon={FaBolt}
        iconColor="#22C55E"
        title="Rack Voltage"
        value={voltage}
        unit="V"
      />

      <SummaryCard
        icon={MdElectricBolt}
        iconColor="#38BDF8"
        title="Rack Current"
        value={current}
        unit="A"
      />

      <SummaryCard
        icon={FaBatteryThreeQuarters}
        iconColor="#84CC16"
        title="SOC"
        value={soc}
        unit="%"
      />

      <SummaryCard
        icon={GiBatteryPack}
        iconColor="#A855F7"
        title="SOE"
        value={soe}
        unit="%"
      />

      <SummaryCard
        icon={FaLeaf}
        iconColor="#22C55E"
        title="SOH"
        value={soh}
        unit="%"
      />

      <SummaryCard
        icon={BsLightningCharge}
        iconColor="#F59E0B"
        title="Available Energy"
        value={availableEnergy}
        unit="kWh"
      />

      <SummaryCard
        icon={MdOutlinePower}
        iconColor="#06B6D4"
        title="Rack Power"
        value={rackPower}
        unit="kW"
      />

      <SummaryCard
        icon={FaCheckCircle}
        iconColor="#22C55E"
        title="Status"
        value={status}
      />

    </HStack>
  );
}
