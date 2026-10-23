import React, {
  useEffect,
  useMemo,
} from "react";

import {
  Box,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

interface ParameterTrendsProps {
  selectedDevice: string;
}

const ParameterTrends = ({
  selectedDevice,
}: ParameterTrendsProps) => {

  const bg = useColorModeValue(
    "#ffffff",
    "linear-gradient(180deg,#07182d 0%, #0a2140 100%)"
  );

  const border = useColorModeValue(
    "#d7e2f0",
    "#17365e"
  );

  const title = useColorModeValue(
    "#0f172a",
    "#dce8ff"
  );

  const grid = useColorModeValue(
    "#d9e2ef",
    "#21446d"
  );

  const axis = useColorModeValue(
    "#6b7280",
    "#9db4d1"
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
          alias: "Ambient Temperature",
          keyType: "timeseries",
        },

        {
          key: "module_temperature",
          alias: "Module Temperature",
          keyType: "timeseries",
        },

        {
          key: "irradiance",
          alias: "Irradiance",
          keyType: "timeseries",
        },

        {
          key: "wind_speed",
          alias: "Wind Speed",
          keyType: "timeseries",
        },

        {
          key: "relative_humidity",
          alias: "Relative Humidity",
          keyType: "timeseries",
        },

        {
          key: "barometric_pressure",
          alias: "Barometric Pressure",
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
        interval: 1,
        intervalType: "hour",
      },

      timeRange: {
        type: "last",
        interval: 24,
        intervalType: "hour",
      },

      orderBy: "ASC",

    } as any;

    const fetchTrend = () => fetchData(payload);

    fetchTrend();

    const interval = setInterval(
      fetchTrend,
      60000
    );

    return () => clearInterval(interval);

  }, [selectedDevice]);

  const rows = useMemo(() => [

    {
      label: "Ambient Temp. (°C)",
      key: "Ambient Temperature",
      color: "#4aa3ff",
    },

    {
      label: "Module Temp. (°C)",
      key: "Module Temperature",
      color: "#d45cff",
    },

    {
      label: "Irradiance (W/m²)",
      key: "Irradiance",
      color: "#f4a000",
    },

    {
      label: "Wind Speed (m/s)",
      key: "Wind Speed",
      color: "#20c9e8",
    },

    {
      label: "Relative Humidity (%)",
      key: "Relative Humidity",
      color: "#64d000",
    },

    {
      label: "Barometric Pressure (hPa)",
      key: "Barometric Pressure",
      color: "#ff9800",
    },

    {
      label: "Rainfall (mm)",
      key: "Rainfall",
      color: "#4aa3ff",
    },

  ], []);

  const getSeriesData = (key: string) => {

    const arr =
      data?.[selectedDevice]?.[key] || [];

    return arr.map((d: any) => [
      d.ts,
      Number(d.value),
    ]);
  };

  const getMin = (key: string) => {

    const arr =
      data?.[selectedDevice]?.[key] || [];

    if (arr.length === 0) return "-";

    const values = arr
      .map((d: any) => Number(d.value))
      .filter((v: number) => !isNaN(v));

    if (values.length === 0) return "-";

    return Math.min(...values).toFixed(1);
  };

  const getMax = (key: string) => {

    const arr =
      data?.[selectedDevice]?.[key] || [];

    if (arr.length === 0) return "-";

    const values = arr
      .map((d: any) => Number(d.value))
      .filter((v: number) => !isNaN(v));

    if (values.length === 0) return "-";

    return Math.max(...values).toFixed(1);
  };

  return (

    <Box
      bg={bg}
      border={`1px solid ${border}`}
      borderRadius="10px"
      p="14px"
      w="100%"
      minW={0}
      minH="300px"
      overflow="hidden"
    >

      {/* TITLE */}
      <Text
        color={title}
        fontWeight="700"
        fontSize="18px"
        mb="14px"
      >
        Parameter Trends (24 Hours)
      </Text>

      {/* ROWS */}
      <Flex
        direction="column"
        gap="8px"
      >

        {rows.map((item, index) => {

          const options = {

            chart: {
              type: "spline",
              backgroundColor: "transparent",
              height: 26,
              margin: [0, 0, 0, 0],
            },

            title: {
              text: "",
            },

            credits: {
              enabled: false,
            },

            exporting: {
              enabled: false,
            },

            legend: {
              enabled: false,
            },

            xAxis: {
              type: "datetime",
              visible: false,
            },

            yAxis: {
              visible: false,
              title: {
                text: "",
              },
              gridLineWidth: 0,
            },

            tooltip: {
              enabled: false,
            },

            plotOptions: {

              spline: {

                lineWidth: 2,

                marker: {
                  enabled: false,
                },

              },

              series: {
                animation: false,
              },

            },

            series: [

              {
                type: "spline",

                data: getSeriesData(item.key),

                color: item.color,
              },

            ],

          };

          return (

            <Box key={index}>

              <Flex align="center">

                {/* LABEL */}
                <Text
                  color={item.color}
                  fontSize="13px"
                  fontWeight="500"
                  minW="175px"
                >
                  {item.label}
                </Text>

                {/* GRAPH */}
                <Box
                  position="relative"
                  flex="1"
                  minW={0}
                  overflow="hidden"
                  h="26px"
                  mx="10px"
                >

                  {/* CENTER GRID */}
                  <Box
                    position="absolute"
                    top="50%"
                    left="0"
                    right="0"
                    borderTop={`1px solid ${grid}`}
                    opacity="0.2"
                    zIndex={0}
                  />

                  <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                  />

                </Box>

                {/* MAX MIN */}
                <Box minW="74px">

                  <Flex
                    direction="column"
                    align="flex-end"
                    gap="4px"
                  >

                    {/* MAX */}
                    <Flex
                      align="center"
                      gap="6px"
                    >

                      <Text
                        color={axis}
                        fontSize="11px"
                        lineHeight="1"
                      >
                        Max
                      </Text>

                      <Text
                        color={title}
                        fontSize="12px"
                        lineHeight="1"
                        minW="38px"
                        textAlign="right"
                      >
                        {getMax(item.key)}
                      </Text>

                    </Flex>

                    {/* MIN */}
                    <Flex
                      align="center"
                      gap="6px"
                    >

                      <Text
                        color={axis}
                        fontSize="11px"
                        lineHeight="1"
                      >
                        Min
                      </Text>

                      <Text
                        color={title}
                        fontSize="12px"
                        lineHeight="1"
                        minW="38px"
                        textAlign="right"
                      >
                        {getMin(item.key)}
                      </Text>

                    </Flex>

                  </Flex>

                </Box>

              </Flex>

              {/* HORIZONTAL DIVIDER */}
              {index !== rows.length - 1 && (

                <Box
                  mt="7px"
                  borderBottom={`1px solid ${grid}`}
                  opacity="0.12"
                />

              )}

            </Box>

          );
        })}

      </Flex>

      {/* TIME AXIS */}
      <Flex
        justify="space-between"
        mt="16px"
        pl="188px"
        pr="78px"
      >

        {[
          "19:00",
          "23:00",
          "03:00",
          "07:00",
          "11:00",
          "15:00",
          "19:00",
        ].map((time, index) => (

          <Text
            key={index}
            color={axis}
            fontSize="12px"
          >
            {time}
          </Text>

        ))}

      </Flex>

    </Box>
  );
};

export default ParameterTrends;
