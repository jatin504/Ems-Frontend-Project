import React, { useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

import {
  FiZap,
  FiActivity,
  FiTarget,
} from "react-icons/fi";

import {
  BsBatteryCharging,
  BsThermometerHalf,
} from "react-icons/bs";

import {
  MdElectricBolt,
} from "react-icons/md";

import {
  TbCurrentLocation,
} from "react-icons/tb";

interface SummaryCardProps {
  title: string;
  value: string;
  unit?: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
}

const SummaryCard = ({
  title,
  value,
  unit,
  subtitle,
  icon,
  color,
}: SummaryCardProps) => {
  const border = useColorModeValue("#E9EEF5", "#2D3748");
  const titleColor = useColorModeValue("#8B97A8", "#94A3B8");
  const valueColor = useColorModeValue("#111827", "white");

  return (
    <Flex
      align="center"
      gap={3}
      h="82px"
      px={5}
      borderRight="1px solid"
      borderColor={border}
    >
      <Flex
        w="34px"
        h="34px"
        borderRadius="full"
        bg={`${color}18`}
        align="center"
        justify="center"
        color={color}
        flexShrink={0}
      >
        {icon}
      </Flex>

      <Box>
        <Text
          fontSize="11px"
          color={titleColor}
          fontWeight="600"
          lineHeight="14px"
        >
          {title}
        </Text>

        <Box mt="2px">
          <Text
            fontSize="18px"
            lineHeight="20px"
            fontWeight="700"
            color={valueColor}
          >
            {value}
          </Text>

          {unit && (
            <Text
              mt="1px"
              fontSize="11px"
              lineHeight="12px"
              color={titleColor}
              fontWeight="600"
            >
              {unit}
            </Text>
          )}
        </Box>

        {subtitle && (
          <Text
            mt="1"
            fontSize="11px"
            color={titleColor}
            fontWeight="600"
          >
            {subtitle}
          </Text>
        )}
      </Box>
    </Flex>
  );
};

const PCSTopSummaryCards = ({ deviceId }: { deviceId?: string }) => {
  const { data, fetchData } = useTimeseriesData();
  const bg = useColorModeValue("#FFFFFF", "#1A202C");
  const border = useColorModeValue("#E9EEF5", "#2D3748");

  useEffect(() => {
    if (!deviceId) return;

    fetchData({
      devices: {
        patterns: [],
        ids: [deviceId],
      },
      keys: [
        { key: "active_power", alias: "active_power", keyType: "common" },
        { key: "reactive_power", alias: "reactive_power", keyType: "common" },
        { key: "apparent_power", alias: "apparent_power", keyType: "common" },
        { key: "power_factor", alias: "power_factor", keyType: "common" },
        { key: "frequency", alias: "efficiency", keyType: "common" },
        { key: "voltage", alias: "dc_voltage", keyType: "common" },
        { key: "current", alias: "dc_current", keyType: "common" },
        { key: "temperature", alias: "temperature", keyType: "common" },
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
      orderBy: "ASC",
    } as any);
  }, [deviceId]);

  const summaryData = useMemo(() => {
    const deviceData = (data as any)?.[deviceId || ""];

    const getLatestValue = (key: string) => {
      const points = deviceData?.[key] ?? [];
      const latest = points[points.length - 1];
      return latest?.value ?? null;
    };

    const formatNumber = (value: number | null | undefined, digits = 2) => {
      if (value === null || value === undefined || Number.isNaN(value)) return "--";
      return Number(value).toFixed(digits);
    };

    return [
      {
        title: "Active Power",
        value: formatNumber(getLatestValue("active_power")),
        unit: "kW",
        icon: <FiZap size={16} />,
        color: "#3B82F6",
      },
      {
        title: "Reactive Power",
        value: formatNumber(getLatestValue("reactive_power")),
        unit: "kVAR",
        icon: <MdElectricBolt size={16} />,
        color: "#22C55E",
      },
      {
        title: "Apparent Power",
        value: formatNumber(getLatestValue("apparent_power")),
        unit: "kVA",
        icon: <FiActivity size={16} />,
        color: "#8B5CF6",
      },
      {
        title: "Power Factor",
        value: formatNumber(getLatestValue("power_factor")),
        subtitle: "Leading",
        icon: <FiTarget size={16} />,
        color: "#F59E0B",
      },
      {
        title: "Efficiency",
        value: formatNumber(getLatestValue("efficiency")),
        unit: "%",
        icon: <FiActivity size={16} />,
        color: "#0EA5A4",
      },
      {
        title: "DC Voltage",
        value: formatNumber(getLatestValue("dc_voltage")),
        unit: "V",
        icon: <BsBatteryCharging size={16} />,
        color: "#64748B",
      },
      {
        title: "DC Current",
        value: formatNumber(getLatestValue("dc_current")),
        unit: "A",
        icon: <TbCurrentLocation size={16} />,
        color: "#D97706",
      },
      {
        title: "Internal Temp",
        value: formatNumber(getLatestValue("temperature")),
        unit: "°C",
        icon: <BsThermometerHalf size={16} />,
        color: "#EF4444",
      },
    ];
  }, [data, deviceId]);

  return (
    <Box
      bg={bg}
      borderRadius="12px"
      border="1px solid"
      borderColor={border}
      overflow="hidden"
      w="100%"
      boxShadow="0 1px 3px rgba(15,23,42,0.05)"
    >
      <Grid
        templateColumns="repeat(8,1fr)"
        h="82px"
      >
        {summaryData.map((item, index) => (
          <Box
            key={item.title}
            borderRight={
              index !== summaryData.length - 1
                ? "1px solid"
                : "none"
            }
            borderColor={border}
          >
            <SummaryCard
              title={item.title}
              value={item.value}
              unit={item.unit}
              subtitle={item.subtitle}
              icon={item.icon}
              color={item.color}
            />
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default PCSTopSummaryCards;