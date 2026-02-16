import {
  Box,
  Flex,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useMemo } from "react";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";

/* ================= TYPES ================= */

interface WidgetPoint {
  ts: number;
  value: number;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

interface MeterMetricsBarProps {
  selectedMeter: string;
}

/* ================= COMPONENT ================= */

const MeterMetricsBar: React.FC<MeterMetricsBarProps> = ({
  selectedMeter,
}) => {
  const { data, fetchData } = useTimeseriesData();

  /* ================= API CALL ================= */

  useEffect(() => {
    if (!selectedMeter) return;

    fetchData({
      devices: {
        patterns: [],
        ids: [selectedMeter],
      },
      keys: [
        { key: "dcdc1_battery_side_current", alias: "current", keyType: "common" },
        { key: "dcdc2_battery_side_volatge", alias: "voltage", keyType: "common" },
        { key: "container_status_1", alias: "frequency", keyType: "common" },
        { key: "power_factor", alias: "power_factor", keyType: "common" },
        { key: "energy", alias: "energy", keyType: "common" },
        { key: "lifetime_import", alias: "lifetime_import", keyType: "common" },
        { key: "lifetime_export", alias: "lifetime_export", keyType: "common" },
      ],
      aggregation: {
        func: "avg",
        interval: 15,
        intervalType: "minute",
      },
      timeRange: {
        type: "relative",
        relativeType: "currentDaySoFar",
      },
      orderBy: "DESC",
    } as any);
  }, [selectedMeter]);

  /* ================= DATA MAP ================= */

  const metrics = useMemo(() => {
    const widgetData = data as WidgetData | null;

    if (!widgetData || !selectedMeter || !widgetData[selectedMeter]) {
      return {
        current: 0,
        voltage: 0,
        frequency: 0,
        power_factor: 0,
        energy: 0,
        lifetime_import: 0,
        lifetime_export: 0,
      };
    }

    const d = widgetData[selectedMeter];

    const latest = (arr?: WidgetPoint[]) =>
      arr && arr.length > 0 ? arr[arr.length - 1].value : 0;

    return {
      current: latest(d["current"]),
      voltage: latest(d["voltage"]),
      frequency: latest(d["frequency"]),
      power_factor: latest(d["power_factor"]),
      energy: latest(d["energy"]),
      lifetime_import: latest(d["lifetime_import"]),
      lifetime_export: latest(d["lifetime_export"]),
    };
  }, [data, selectedMeter]);

  /* ================= UI ================= */

  return (
    <Box
      width="608px"
      height="332px"
      p="20px"
      bg={useColorModeValue("#FAFBFC", "#0A0A0A")}
      borderRadius="md"
      border="1px solid"
      borderColor={useColorModeValue("#E8EAED", "#1F1F1F")}
    >
      <HStack
        color={useColorModeValue("#4A5568", "#CBD5E0")}
        alignItems="flex-start"
      >
        {/* COLUMN 1 - 3 metrics */}
        <Flex
          flexDir="column"
          height="219px"
          width="240px"
          pr="20px"
          borderRight="1px solid"
          borderColor={useColorModeValue("#E8EAED", "#1F1F1F")}
          gap="20px"
          mr="20px"
        >
          <Metric value={metrics.current} unit="A" label="Line Avg Current" />
          <Metric value={metrics.voltage} unit="V" label="Line Avg Voltage" />
          <Metric value={metrics.frequency} unit="Hz" label="Frequency" />
        </Flex>

        {/* COLUMN 2 - 3 metrics */}
        <Flex
          flexDir="column"
          height="219px"
          width="240px"
          pr="20px"
          borderRight="1px solid"
          borderColor={useColorModeValue("#E8EAED", "#1F1F1F")}
          gap="20px"
          mr="20px"
        >
          <Metric value={metrics.power_factor} unit="" label="Power Factor" />
          <Metric value={metrics.energy} unit="kWh" label="Consumption" />
          <Metric
            value={metrics.lifetime_import}
            unit="MWh"
            label="Lifetime Import"
          />
        </Flex>

        {/* COLUMN 3 - 1 metric */}
        <Flex
          flexDir="column"
          height="80px"
          width="240px"
          gap="20px"
        >
          <Metric
            value={metrics.lifetime_export}
            unit="MWh"
            label="Lifetime Export"
          />
        </Flex>
      </HStack>
    </Box>
  );
};

/* ================= METRIC UI ================= */

const Metric = ({
  value,
  unit,
  label,
}: {
  value: number | string;
  unit: string;
  label: string;
}) => {
  const displayValue =
    typeof value === "number" && !isNaN(value) ? value.toFixed(2) : value;

  return (
    <VStack spacing={0} alignItems="flex-start">
      <Flex alignItems="baseline" gap={1}>
        <Text fontWeight={700} fontSize="22px">
          {displayValue}
        </Text>
        <Text fontWeight={500} fontSize="14px">
          {unit}
        </Text>
      </Flex>
      <Text fontSize="14px" color="#9BABBD">
        {label}
      </Text>
    </VStack>
  );
};

export default MeterMetricsBar;
