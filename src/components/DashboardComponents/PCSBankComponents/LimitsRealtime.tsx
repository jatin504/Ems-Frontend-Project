import React, { useEffect, useMemo } from "react";
import {
  Box,
  Divider,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import WidgetTitle from "../../Common/WidgetTitle";
import useTimeseriesData from "../../../hooks/useTimeseriesData";

interface Props {
  selectedDevice?: string;
}

const LimitsRealtime: React.FC<Props> = ({ selectedDevice }) => {
  const bg = useColorModeValue("#FFFFFF", "#101820");
  const border = useColorModeValue("#E2E8F0", "#243244");
  const title = useColorModeValue("#1E293B", "#F8FAFC");
  const text = useColorModeValue("#64748B", "#CBD5E1");

  const { data: timeseriesData, fetchData } = useTimeseriesData();

  const metrics = [
    { key: "max_charge_current", alias: "MaxChargeCurrent", unit: "A" },
    { key: "max_discharge_current", alias: "MaxDischargeCurrent", unit: "A" },
    { key: "max_charge_power", alias: "MaxChargePower", unit: "kW" },
    { key: "max discharge_power", alias: "MaxDischargePower", unit: "kW" },
    { key: "current_limit_reason", alias: "CurrentLimitReason", unit: "" },
  ];

  useEffect(() => {
    if (!selectedDevice) return;

    fetchData({
      devices: {
        patterns: [],
        ids: [selectedDevice],
      },
      keys: metrics.map(({ key, alias }) => ({
        key,
        alias,
        keyType: "common",
      })),
      aggregation: {
        func: "last",
        interval: 1,
        intervalType: "minute",
      },
      timeRange: {
        type: "last",
        interval: 1,
        intervalType: "day",
      },
      orderBy: "ASC",
    } as any);
  }, [selectedDevice]);

  const data = useMemo(() => {
    const deviceData = selectedDevice
      ? (timeseriesData as Record<string, any> | undefined)?.[selectedDevice]
      : undefined;

    const latest = (alias: string, unit: string) => {
      const points = deviceData?.[alias];
      if (!Array.isArray(points) || points.length === 0) return "--";

      const value = points[points.length - 1]?.value;
      if (value === undefined || value === null || value === "") return "--";
      if (!unit) return String(value);

      const numericValue = Number(value);
      return Number.isFinite(numericValue)
        ? `${numericValue.toFixed(2)} ${unit}`
        : `${value} ${unit}`;
    };

    return [
      { label: "Max Charge Current", value: latest("MaxChargeCurrent", "A") },
      { label: "Max Discharge Current", value: latest("MaxDischargeCurrent", "A") },
      { label: "Max Charge Power", value: latest("MaxChargePower", "kW") },
      { label: "Max Discharge Power", value: latest("MaxDischargePower", "kW") },
      { label: "Current Limit Reason", value: latest("CurrentLimitReason", "") },
    ];
  }, [timeseriesData, selectedDevice]);

  return (
    <Box
      w="260px"
      h="300px"
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="10px"
      overflow="hidden"
    >
      {/* Header */}
      <Flex
        h="42px"
        px={4}
        align="center"
        justify="space-between"
        borderBottom="1px solid"
        borderColor={border}
      >
        <WidgetTitle color={title}>Limits (BMS Real-time)</WidgetTitle>

        <InfoOutlineIcon color={text} />
      </Flex>

      {/* Body */}
      <Flex
        direction="column"
        px={5}
        py={2}
        gap={3}
      >
        {data.map((item, index) => (
          <React.Fragment key={index}>
            <Flex
              justify="space-between"
              align="center"
            >
              <Text
                fontSize="13px"
                color={text}
              >
                {item.label}
              </Text>

              <Text
                fontSize="15px"
                fontWeight={700}
                color={title}
              >
                {item.value}
              </Text>
            </Flex>

            {index !== data.length - 1 && (
              <Divider borderColor={border} />
            )}
          </React.Fragment>
        ))}
      </Flex>
    </Box>
  );
};

export default LimitsRealtime;