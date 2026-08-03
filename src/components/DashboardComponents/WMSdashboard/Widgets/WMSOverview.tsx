import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import { useEffect } from "react";

interface WMSOverviewProps {
  selectedDevice: string;
}

const WMSOverview = ({
  selectedDevice,
}: WMSOverviewProps) => {

  const bg = useColorModeValue(
    "#ffffff",
    "linear-gradient(180deg,#082041,#071b34)"
  );

  const border = useColorModeValue(
    "#d9e2ef",
    "#16365f"
  );

  const heading = useColorModeValue(
    "#1a202c",
    "#dbe7ff"
  );

  const text = useColorModeValue(
    "#2d3748",
    "#dbe7ff"
  );

  const head = useColorModeValue(
    "#718096",
    "#9db4d1"
  );

  const rowBorder = useColorModeValue(
    "#edf2f7",
    "#173961"
  );

  const { data, fetchData } = useTimeseriesData();

  useEffect(() => {
    if (!selectedDevice) return;

    const payload = {
      devices: { ids: [selectedDevice], patterns: [] },

      keys: [

        {
          key: "temperature",
          alias: "Temperature",
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
          key: "rainfall",
          alias: "Rainfall",
          keyType: "timeseries",
        },

        {
          key: "barometric_pressure",
          alias: "Barometric Pressure",
          keyType: "timeseries",
        },

      ],

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

      orderBy: "DESC",

    } as any;

    const run = () => fetchData(payload);

    run();

    const i = setInterval(
      run,
      60000
    );

    return () => clearInterval(i);

  }, [selectedDevice]);

  const getArray = (key: string) => {
    return data?.[selectedDevice]?.[key] || [];
  };

  const getCurrent = (key: string) => {

    const arr = getArray(key);

    if (arr.length === 0) return "0";

    return Number(
      arr[arr.length - 1]?.value || 0
    ).toFixed(1);
  };

  const getMin = (key: string) => {

    const arr = getArray(key);

    if (arr.length === 0) return "-";

    const values = arr
      .map((d: any) => Number(d.value))
      .filter((v: number) => !isNaN(v));

    if (values.length === 0) return "-";

    return Math.min(...values).toFixed(1);
  };

  const getMax = (key: string) => {

    const arr = getArray(key);

    if (arr.length === 0) return "-";

    const values = arr
      .map((d: any) => Number(d.value))
      .filter((v: number) => !isNaN(v));

    if (values.length === 0) return "-";

    return Math.max(...values).toFixed(1);
  };

  const getAvg = (key: string) => {

    const arr = getArray(key);

    if (arr.length === 0) return "-";

    const values = arr
      .map((d: any) => Number(d.value))
      .filter((v: number) => !isNaN(v));

    if (values.length === 0) return "-";

    const avg =
      values.reduce(
        (a: number, b: number) => a + b,
        0
      ) / values.length;

    return avg.toFixed(1);
  };

  const rows = [

    {
      parameter: "Ambient Temp. (°C)",
      key: "Temperature",
    },

    {
      parameter: "Module Temp. (°C)",
      key: "Module Temperature",
    },

    {
      parameter: "Irradiance (W/m²)",
      key: "Irradiance",
    },

    {
      parameter: "Wind Speed (m/s)",
      key: "Wind Speed",
    },

    {
      parameter: "Relative Humidity (%)",
      key: "Relative Humidity",
    },

    {
      parameter: "Rainfall (mm)",
      key: "Rainfall",
    },

    {
      parameter: "Barometric Pressure (hPa)",
      key: "Barometric Pressure",
    },

  ];

  return (

    <Box
      bg={bg}
      border={`1px solid ${border}`}
      borderRadius="10px"
      p="14px"
      w="100%"
      h="100%"
    >

      {/* TITLE */}
      <Text
        color={heading}
        fontWeight="700"
        fontSize="16px"
        mb="14px"
        letterSpacing="0.3px"
      >
        Weather Overview
      </Text>

      {/* TABLE */}
      <Table
        variant="unstyled"
        size="sm"
      >

        <Thead>

          <Tr>

            <Th
              color={head}
              fontSize="12px"
              fontWeight="700"
              pb="10px"
            >
              Parameter
            </Th>

            <Th
              color={head}
              fontSize="12px"
              fontWeight="700"
            >
              Current
            </Th>

            <Th
              color={head}
              fontSize="12px"
              fontWeight="700"
            >
              Min (Today)
            </Th>

            <Th
              color={head}
              fontSize="12px"
              fontWeight="700"
            >
              Max (Today)
            </Th>

            <Th
              color={head}
              fontSize="12px"
              fontWeight="700"
            >
              Avg (Today)
            </Th>

            <Th
              color={head}
              fontSize="12px"
              fontWeight="700"
            >
              Trend (24H)
            </Th>

          </Tr>

        </Thead>

        <Tbody>

          {rows.map((item, index) => (

            <Tr
              key={index}
              borderTop={`1px solid ${rowBorder}`}
            >

              <Td
                color={text}
                fontSize="14px"
                py="12px"
                whiteSpace="nowrap"
              >
                {item.parameter}
              </Td>

              <Td
                color={text}
                fontSize="14px"
              >
                {getCurrent(item.key)}
              </Td>

              <Td
                color={text}
                fontSize="14px"
              >
                {getMin(item.key)}
              </Td>

              <Td
                color={text}
                fontSize="14px"
              >
                {getMax(item.key)}
              </Td>

              <Td
                color={text}
                fontSize="14px"
              >
                {getAvg(item.key)}
              </Td>

              {/* TREND */}
              <Td>

                <Flex
                  align="center"
                  h="24px"
                >

                  <Box
                    w="95px"
                    h="24px"
                    position="relative"
                  >

                    <svg
                      width="95"
                      height="24"
                      viewBox="0 0 95 24"
                      fill="none"
                    >

                      <path
                        d={
                          item.key === "Rainfall"
                            ? "M0 12 L95 12"
                            : "M0 18 L8 15 L14 19 L20 6 L28 13 L34 4 L40 16 L46 7 L52 10 L58 5 L64 14 L70 6 L76 11 L82 8 L88 15 L95 10"
                        }
                        stroke="#66d10d"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />

                    </svg>

                  </Box>

                </Flex>

              </Td>

            </Tr>

          ))}

        </Tbody>

      </Table>

    </Box>
  );
};

export default WMSOverview;