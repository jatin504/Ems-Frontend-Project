import React, { useMemo, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

import StaleIndicator from "../../../../components/Common/StaleIndicator";

import { useAlarmLatest } from "../../../../hooks/useAlarmLatest";

import { useNavigate } from "react-router-dom";

const MeterCard = () => {

  const { data, fetchData } =
    useTimeseriesData();

  /* ---------- Alarm data ---------- */

  const {
    alarmCount,
    warningCount,
  } = useAlarmLatest();

  const navigate =
    useNavigate();

  /* ---------- Fetch Meter Data ---------- */

  useEffect(() => {

    fetchData({

      devices: {
        patterns: [],
        ids: [
          "plant_1_ht_outgoing_meter_1",
        ],
      },

      keys: [

        {
          key: "total_active_power",
          alias: "Active Power",
          keyType: "common",
        },

        {
          key: "total_reactive_power",
          alias: "Reactive Power",
          keyType: "common",
        },

        {
          key: "frequency",
          alias: "Frequency",
          keyType: "common",
        },

        {
          key: "avg_voltage_l",
          alias: "Voltage",
          keyType: "common",
        },

        {
          key: "avg_current_l",
          alias: "Current",
          keyType: "common",
        },

      ],

      aggregation: {
        func: "none",
        interval: 1,
        intervalType: "minute",
      },

      timeRange: {
        type: "last",
        interval: 10,
        intervalType: "minute",
      },

      orderBy: "ASC",

    } as any);

  }, []);

  /* ---------- Transform API Data ---------- */

  const metrics =
    useMemo(() => {

      if (
        !data ||
        typeof data !== "object"
      ) {
        return {};
      }

      const series: any = {};

      Object.values(data).forEach(
        (deviceObj: any) => {

          if (
            deviceObj &&
            typeof deviceObj === "object"
          ) {

            Object.entries(deviceObj).forEach(
              ([metric, points]: any) => {

                if (
                  Array.isArray(points) &&
                  points.length
                ) {

                  const latestPoint =
                    points[
                      points.length - 1
                    ];

                  series[metric] = {
                    value:
                      latestPoint?.value ??
                      "--",

                    ts:
                      latestPoint?.ts || 0,
                  };
                }
              }
            );
          }
        }
      );

      return series;

    }, [data]);

  /* ---------- Theme ---------- */

  const primaryBg =
    useColorModeValue(
      "primary.light",
      "primary.dark"
    );

  const primaryColor =
    useColorModeValue(
      "primaryText.light",
      "primaryText.dark"
    );

  const secondaryColor =
    useColorModeValue(
      "secondaryText.light",
      "secondaryText.dark"
    );

  return (

    <Box
      width="330px"
      p="16px"
      rounded="12px"
      bg={primaryBg}
      fontSize="14px"
      color={primaryColor}
    >

      {/* ---------- Title ---------- */}

      <Text
        fontSize="16px"
        fontWeight="600"
        mb={4}
      >
        Meter
      </Text>

      {/* ---------- Meter Values ---------- */}

      <VStack
        align="stretch"
        spacing={3}
      >

        {/* Active Power */}

        <HStack justify="space-between">

          <Text color={secondaryColor}>
            Active Power:
          </Text>

          <HStack spacing={1}>

            <Text fontWeight="600">
              {metrics["Active Power"]?.value ?? "--"}
            </Text>

            <StaleIndicator
              ts={metrics["Active Power"]?.ts}
              value={metrics["Active Power"]?.value}
            />

          </HStack>

        </HStack>

        {/* Reactive Power */}

        <HStack justify="space-between">

          <Text color={secondaryColor}>
            Reactive Power:
          </Text>

          <HStack spacing={1}>

            <Text fontWeight="600">
              {metrics["Reactive Power"]?.value ?? "--"}
            </Text>

            <StaleIndicator
              ts={metrics["Reactive Power"]?.ts}
              value={metrics["Reactive Power"]?.value}
            />

          </HStack>

        </HStack>

        {/* Frequency */}

        <HStack justify="space-between">

          <Text color={secondaryColor}>
            Frequency:
          </Text>

          <HStack spacing={1}>

            <Text fontWeight="600">
              {metrics["Frequency"]?.value ?? "--"}
            </Text>

            <StaleIndicator
              ts={metrics["Frequency"]?.ts}
              value={metrics["Frequency"]?.value}
            />

          </HStack>

        </HStack>

        {/* Voltage */}

        <HStack justify="space-between">

          <Text color={secondaryColor}>
            Voltage:
          </Text>

          <HStack spacing={1}>

            <Text fontWeight="600">
              {metrics["Voltage"]?.value ?? "--"}
            </Text>

            <StaleIndicator
              ts={metrics["Voltage"]?.ts}
              value={metrics["Voltage"]?.value}
            />

          </HStack>

        </HStack>

        {/* Current */}

        <HStack justify="space-between">

          <Text color={secondaryColor}>
            Current:
          </Text>

          <HStack spacing={2}>

            <Text fontWeight="600">
              {metrics["Current"]?.value ?? "--"}
            </Text>

            <StaleIndicator
              ts={metrics["Current"]?.ts}
              value={metrics["Current"]?.value}
            />

          </HStack>

        </HStack>

      </VStack>

      {/* ---------- Alarms Section ---------- */}

      <HStack
        mt={4}
        justify="space-between"
      >

        {/* Alarm Box */}

        <VStack
          align="flex-start"
          bg={useColorModeValue(
            "#FFF8F8",
            "rgba(255,161,161,0.14)"
          )}
          p="10px"
          rounded="8px"
          w="144px"
          _hover={{
            cursor: "pointer",
            boxShadow: "md",
          }}
          onClick={() =>
            navigate("/alarms/latest")
          }
        >

          <AlertCircle
            color="red"
            size={20}
          />

          <Text fontWeight="500">
            {alarmCount} ALARMS
          </Text>

        </VStack>

        {/* Warning Box */}

        <VStack
          align="flex-start"
          bg={useColorModeValue(
            "rgba(255,250,239,1)",
            "rgba(255,222,151,0.17)"
          )}
          p="10px"
          rounded="8px"
          w="144px"
          _hover={{
            cursor: "pointer",
            boxShadow: "md",
          }}
          onClick={() =>
            navigate("/alarms/latest")
          }
        >

          <AlertTriangle
            color="orange"
            size={20}
          />

          <Text fontWeight="500">
            {warningCount} WARNINGS
          </Text>

        </VStack>

      </HStack>

    </Box>
  );
};

export default MeterCard;