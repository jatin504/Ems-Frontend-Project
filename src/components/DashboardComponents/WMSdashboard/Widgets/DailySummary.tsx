import {
  Box,
  Flex,
  Grid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { useEffect } from "react";

import {
  WiDaySunny,
  WiThermometer,
  WiStrongWind,
  WiRain,
} from "react-icons/wi";

import CommonCard from "./CommonCard.tsx";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

interface DailySummaryProps {
  selectedDevice: string;
}

const DailySummary = ({
  selectedDevice,
}: DailySummaryProps) => {

  const bg = useColorModeValue(
    "#ffffff",
    "linear-gradient(180deg, #07172c 0%, #0a2140 100%)"
  );

  const dividerColor = useColorModeValue(
    "rgba(0,0,0,0.12)",
    "rgba(255,255,255,0.12)"
  );

  const titleColor = useColorModeValue(
    "#1a202c",
    "#dce8ff"
  );

  const labelColor = useColorModeValue(
    "#4a5568",
    "#b9c7dd"
  );

  const valueColor = useColorModeValue(
    "#1a202c",
    "#ffffff"
  );

  const unitColor = useColorModeValue(
    "#4a5568",
    "#dce8ff"
  );

  const timeColor = useColorModeValue(
    "#4a5568",
    "#dce8ff"
  );

  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {

    if (!selectedDevice) return;

    const payload = {

      devices: {
        ids: [selectedDevice],
        patterns: [],
      },

      keys: [

        {
          key: "temperature",
          alias: "Irradiance",
          keyType: "timeseries",
        },

        {
          key: "ambient_temperature",
          alias: "Ambient Temperature",
          keyType: "timeseries",
        },

        {
          key: "wind_speed",
          alias: "Wind Speed",
          keyType: "timeseries",
        },

        {
          key: "rainfall",
          alias: "Rainfall",
          keyType: "timeseries",
        },

      ],

      aggregation: {
        func: "avg",
        interval: 5,
        intervalType: "minute",
      },

      timeRange: {
        type: "last",
        interval: 1,
        intervalType: "day",
      },

      orderBy: "ASC",

    } as any;

    const fetchSummary = () => fetchData(payload);

    // initial
    fetchSummary();

    const interval = setInterval(
      fetchSummary,
      60000
    );

    return () => clearInterval(interval);

  }, [selectedDevice]);

  const getArray = (key: string) => {
    return data?.[selectedDevice]?.[key] || [];
  };

  const getAverage = (key: string) => {

    const arr = getArray(key);

    if (arr.length === 0) return "0";

    const values = arr
      .map((d: any) => Number(d.value))
      .filter((v: number) => !isNaN(v));

    if (values.length === 0) return "0";

    const avg =
      values.reduce(
        (a: number, b: number) => a + b,
        0
      ) / values.length;

    return avg.toFixed(1);
  };

  const getMax = (key: string) => {

    const arr = getArray(key);

    if (arr.length === 0) return "0";

    const values = arr
      .map((d: any) => Number(d.value))
      .filter((v: number) => !isNaN(v));

    if (values.length === 0) return "0";

    return Math.max(...values).toFixed(1);
  };

  const getMaxTime = (key: string) => {

    const arr = getArray(key);

    if (arr.length === 0) return "--:--";

    let maxItem = arr[0];

    arr.forEach((item: any) => {

      if (
        Number(item.value) >
        Number(maxItem.value)
      ) {
        maxItem = item;
      }

    });

    return new Date(maxItem.ts)
      .toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
  };

  const getTotalRainfall = () => {

    const arr = getArray("Rainfall");

    if (arr.length === 0) return "0";

    const values = arr
      .map((d: any) => Number(d.value))
      .filter((v: number) => !isNaN(v));

    const total = values.reduce(
      (a: number, b: number) => a + b,
      0
    );

    return total.toFixed(1);
  };

  const items = [

    {
      title: "Avg. Irradiance",
      value: getAverage("Irradiance"),
      unit: "W/m²",
      icon: WiDaySunny,
      color: "#ffb400",
    },

    {
      title: "Avg. Ambient Temp.",
      value: getAverage("Ambient Temperature"),
      unit: "°C",
      icon: WiThermometer,
      color: "#cc75ff",
    },

    {
      title: "Max. Wind Speed",
      value: getMax("Wind Speed"),
      unit: "m/s",
      time: `Time: ${getMaxTime("Wind Speed")}`,
      icon: WiStrongWind,
      color: "#4ca8ff",
    },

    {
      title: "Total Rainfall",
      value: getTotalRainfall(),
      unit: "mm",
      icon: WiRain,
      color: "#5aa8ff",
    },

  ];

  return (

    <CommonCard
      p="18px"
      borderRadius="12px"
      bg={bg}
      minH="190px"
    >

      <Text
        color={titleColor}
        fontSize="15px"
        fontWeight="700"
        mb="16px"
      >
        Daily Summary
      </Text>

      <Grid
        templateColumns="repeat(4, 1fr)"
        w="100%"
      >

        {items.map((item, index) => {

          const Icon = item.icon;

          return (

            <Flex
              key={index}
              direction="column"
              align="center"
              justify="flex-start"
              position="relative"
              px="4px"
              minW={0}
            >

              {/* Divider */}
              {index !== 0 && (

                <Box
                  position="absolute"
                  left="0"
                  top="8px"
                  h="110px"
                  w="1px"
                  bg={dividerColor}
                />

              )}

              {/* Icon */}
              <Box mb="6px">

                <Icon
                  size={40}
                  color={item.color}
                />

              </Box>

              {/* Title */}
              <Text
                color={labelColor}
                fontSize="13px"
                textAlign="center"
                whiteSpace="normal"
                minH="32px"
                mb="8px"
              >
                {item.title}
              </Text>

              {/* Value */}
              <Text
                color={valueColor}
                fontSize="22px"
                fontWeight="500"
                lineHeight="1"
              >
                {item.value}
              </Text>

              {/* Unit */}
              <Text
                color={unitColor}
                fontSize="20px"
                lineHeight="1"
                mt="4px"
              >
                {item.unit}
              </Text>

              {/* Time */}
              {item.time && (

                <Text
                  color={timeColor}
                  fontSize="14px"
                  mt="10px"
                >
                  {item.time}
                </Text>

              )}

            </Flex>

          );
        })}

      </Grid>

    </CommonCard>
  );
};

export default DailySummary;
