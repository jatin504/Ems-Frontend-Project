import React, { useEffect, useMemo } from "react";
import {
  Box,
  Divider,
  HStack,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import useTimeseriesData from "../../../hooks/useTimeseriesData";
import type { TimeseriesDataSource } from "../../../types/timeseries/datasource";

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

const Row = ({
  label,
  value,
  color,
  sub,
}: {
  label: string;
  value: string;
  color: string;
  sub?: string;
}) => (
  <HStack justify="space-between" align="flex-start" py="8px">
    <Text fontSize="12px" color="gray.500">
      {label}
    </Text>

    <VStack spacing={0} align="flex-end">
      <Text
        fontSize="20px"
        fontWeight="700"
        color={color}
        lineHeight="18px"
      >
        {value}
      </Text>

      {sub && (
        <Text fontSize="10px" color="gray.500">
          {sub}
        </Text>
      )}
    </VStack>
  </HStack>
);

export default function DeltaSummary({ rackId }: Props) {
  const bg = useColorModeValue("#ffffff", "#0F172A");
  const border = useColorModeValue("#E2E8F0", "#243447");
  const title = useColorModeValue("#1E293B", "white");
  const label = useColorModeValue("#64748B", "#94A3B8");

  const { data, loading, error, fetchData } = useTimeseriesData();

  const deltaFetch: TimeseriesDataSource = useMemo(
    () => ({
      devices: {
        patterns: [],
        ids: rackId ? [rackId] : [],
      },
      keys: [
        { key: "maximum_cell_voltage", alias: "Max Cell Voltage", keyType: "common" },
        { key: "minimum_cell_voltage", alias: "Min Cell Voltage", keyType: "common" },
        { key: "maximum_cell_voltage_point_no", alias: "Max Cell Voltage Point", keyType: "common" },
        { key: "minimum_cell_voltage_point_no", alias: "Min Cell Voltage Point", keyType: "common" },

        { key: "maximum_cell_temperature", alias: "Max Cell Temperature", keyType: "common" },
        { key: "minimum_cell_temperature", alias: "Min Cell Temperature", keyType: "common" },
        { key: "average_cell_temperature", alias: "Avg Cell Temperature", keyType: "common" },
        { key: "maximum_cell_temperature_point_no", alias: "Max Cell Temperature Point", keyType: "common" },
        { key: "minimum_cell_temperature_point_no", alias: "Min Cell Temperature Point", keyType: "common" },
      ],
      aggregation: {
        func: "none",
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

  useEffect(() => {
    if (!rackId || !deltaFetch?.keys?.length) return;

    fetchData(deltaFetch);

    // fetchData ko dependency me nahi rakhenge
    // warna hook ke reference change hone par API repeat ho sakti hai
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rackId]);

  const rackData = useMemo(() => {
    if (!data || !rackId) return null;

    const root = (data as any)?.data ?? data;
    return (root?.[rackId] ?? null) as RackTimeseriesData | null;
  }, [data, rackId]);

  const formatValue = (value: number | string | null | undefined): string => {
    if (value === null || value === undefined || value === "") return "--";

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return String(value);

    return Number(numericValue.toFixed(2)).toString();
  };

  const getValue = (aliases: string[], fallback = "--"): string => {
    if (!rackData) return fallback;

    for (const alias of aliases) {
      const series = rackData[alias];
      if (Array.isArray(series) && series.length > 0) {
        const point = series[0];
        if (point?.value !== null && point?.value !== undefined) {
          return formatValue(point.value);
        }
      }
    }

    return fallback;
  };

  const getCellLabel = (aliases: string[], fallback = "--"): string => {
    if (!rackData) return fallback;

    for (const alias of aliases) {
      const series = rackData[alias];
      if (Array.isArray(series) && series.length > 0) {
        const point = series[0];
        if (point?.value !== null && point?.value !== undefined) {
          const value = Number(point.value);
          return Number.isFinite(value) ? `Cell ${value}` : String(point.value);
        }
      }
    }

    return fallback;
  };

  const maxCellVoltage = getValue(["Max Cell Voltage", "maximum_cell_voltage", "Maximum_Cell_Voltage"]);
  const minCellVoltage = getValue(["Min Cell Voltage", "minimum_cell_voltage", "Minimum_Cell_Voltage"]);
  const maxCellTemperature = getValue(["Max Cell Temperature", "maximum_cell_temperature", "Maximum_Cell_Temperature"]);
  const minCellTemperature = getValue(["Min Cell Temperature", "minimum_cell_temperature", "Minimum_Cell_Temperature"]);
  const avgTemperature = getValue(["Avg Cell Temperature", "average_cell_temperature", "Average_Cell_Temperature"]);
  const maxVoltageCell = getCellLabel(["Max Cell Voltage Point", "maximum_cell_voltage_point_no", "Maximum_Cell_Voltage_Point_No"]);
  const minVoltageCell = getCellLabel(["Min Cell Voltage Point", "minimum_cell_voltage_point_no", "Minimum_Cell_Voltage_Point_No"]);
  const maxTempCell = getCellLabel(["Max Cell Temperature Point", "maximum_cell_temperature_point_no", "Maximum_Cell_Temperature_Point_No"]);
  const minTempCell = getCellLabel(["Min Cell Temperature Point", "minimum_cell_temperature_point_no", "Minimum_Cell_Temperature_Point_No"]);

  const voltageDelta = (() => {
    const max = Number(maxCellVoltage);
    const min = Number(minCellVoltage);
    if (!Number.isFinite(max) || !Number.isFinite(min)) return "--";
    return formatValue(max - min);
  })();

  const temperatureDelta = (() => {
    const max = Number(maxCellTemperature);
    const min = Number(minCellTemperature);
    if (!Number.isFinite(max) || !Number.isFinite(min)) return "--";
    return formatValue(max - min);
  })();

  const voltageStatus = (() => {
    if (loading || error || voltageDelta === "--") {
      return { text: loading ? "Loading" : error ? "Error" : "No Data", color: "#94A3B8" };
    }

    const value = Number(voltageDelta);
    if (!Number.isFinite(value)) return { text: "No Data", color: "#94A3B8" };
    if (value <= 25) return { text: "Excellent", color: "#22C55E" };
    if (value <= 50) return { text: "Good", color: "#3B82F6" };
    if (value <= 80) return { text: "Watch", color: "#F59E0B" };
    return { text: "High", color: "#EF4444" };
  })();

  const tempStatus = (() => {
    if (loading || error || temperatureDelta === "--") {
      return { text: loading ? "Loading" : error ? "Error" : "No Data", color: "#94A3B8" };
    }

    const value = Number(temperatureDelta);
    if (!Number.isFinite(value)) return { text: "No Data", color: "#94A3B8" };
    if (value <= 3) return { text: "Excellent", color: "#22C55E" };
    if (value <= 6) return { text: "Good", color: "#3B82F6" };
    if (value <= 10) return { text: "Watch", color: "#F59E0B" };
    return { text: "High", color: "#EF4444" };
  })();

  return (
    <Box
      w="100%"
      h="100%"
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="10px"
      overflow="hidden"
    >
      <Box
        px="16px"
        py="12px"
        borderBottom="1px solid"
        borderColor={border}
      >
        <Text fontSize="14px" fontWeight="700" color={title}>
          Delta Summary
        </Text>
      </Box>

      <HStack px="16px" py="14px" spacing={8} align="flex-start">
        <Box flex={1}>
          <Text fontSize="10px" color={label} mb="6px">
            Cell Voltage Delta <Text as="span" fontSize="9px">(Max-Min)</Text>
          </Text>

          <HStack spacing={2}>
            <Text fontSize="30px" fontWeight="700" color={title}>
              {loading || error ? "--" : voltageDelta}
            </Text>

            <Text fontSize="18px" fontWeight="600" color={title}>
              mV
            </Text>
          </HStack>

          <Text color={loading || error ? "#94A3B8" : voltageStatus.color} fontSize="12px" fontWeight="600">
            {loading || error ? (loading ? "Loading" : "Error") : voltageStatus.text}
          </Text>
        </Box>

        <Box flex={1}>
          <Text fontSize="10px" color={label} mb="6px">
            Temperature Delta <Text as="span" fontSize="9px">(Max-Min)</Text>
          </Text>

          <HStack spacing={2}>
            <Text fontSize="30px" fontWeight="700" color={title}>
              {loading || error ? "--" : temperatureDelta}
            </Text>

            <Text fontSize="18px" fontWeight="600" color={title}>
              °C
            </Text>
          </HStack>

          <Text color={loading || error ? "#94A3B8" : tempStatus.color} fontSize="12px" fontWeight="600">
            {loading || error ? (loading ? "Loading" : "Error") : tempStatus.text}
          </Text>
        </Box>
      </HStack>

      <Divider borderColor={border} />

      <Box px="16px" py="14px">
        <Text fontSize="13px" fontWeight="700" color={title} mb="10px">
          Temperatures
        </Text>

        <Row
          label="Max. Cell Temp"
          value={loading || error ? "-- °C" : `${maxCellTemperature} °C`}
          color="#EF4444"
          sub={loading || error ? "--" : maxTempCell}
        />

        <Divider borderColor={border} />

        <Row
          label="Min. Cell Temp"
          value={loading || error ? "-- °C" : `${minCellTemperature} °C`}
          color="#60A5FA"
          sub={loading || error ? "--" : minTempCell}
        />

        <Divider borderColor={border} />

        <Row
          label="Avg. Cell Temp"
          value={loading || error ? "-- °C" : `${avgTemperature} °C`}
          color="#C084FC"
        />
      </Box>
    </Box>
  );
}