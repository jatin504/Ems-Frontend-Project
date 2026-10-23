import {
  Box,
  Circle,
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

import { useEffect } from "react";

import CommonCard from "./CommonCard.tsx";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

interface SensorStatusProps {
  selectedDevice: string;
}

const SensorStatus = ({
  selectedDevice,
}: SensorStatusProps) => {

  const bg = useColorModeValue(
    "#ffffff",
    "linear-gradient(180deg,#07182d 0%, #0a2140 100%)"
  );

  const border = useColorModeValue(
    "#d9e2ef",
    "#16365f"
  );

  const title = useColorModeValue(
    "#1a202c",
    "#dce8ff"
  );

  const header = useColorModeValue(
    "#718096",
    "#b6c7de"
  );

  const text = useColorModeValue(
    "#1a202c",
    "#dce8ff"
  );

  const divider = useColorModeValue(
    "#d9e2ef",
    "#1f436a"
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
          key: "wind_direction",
          alias: "Wind Direction",
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

    const fetchSensors = () => fetchData(payload);

    // initial
    fetchSensors();

    const interval = setInterval(
      fetchSensors,
      60000
    );

    return () => clearInterval(interval);

  }, [selectedDevice]);

  const rows = [

    {
      sensor: "Ambient Temperature",
      key: "Ambient Temperature",
    },

    {
      sensor: "Module Temperature",
      key: "Module Temperature",
    },

    {
      sensor: "Pyranometer (Irradiance)",
      key: "Irradiance",
    },

    {
      sensor: "Anemometer (Wind Speed)",
      key: "Wind Speed",
    },

    {
      sensor: "Wind Vane (Direction)",
      key: "Wind Direction",
    },

    {
      sensor: "Humidity Sensor",
      key: "Relative Humidity",
    },

    {
      sensor: "Rain Gauge",
      key: "Rainfall",
    },

    {
      sensor: "Barometric Pressure",
      key: "Barometric Pressure",
    },

  ];

  const getLatest = (key: string) => {

    const arr =
      data?.[selectedDevice]?.[key] || [];

    return arr[arr.length - 1];
  };

  const getStatus = (key: string) => {

    const latest = getLatest(key);

    if (
      !latest ||
      latest.value === undefined ||
      latest.value === null
    ) {
      return "na";
    }

    return "good";
  };

  const getHealth = (key: string) => {

    return getStatus(key) === "na"
      ? "N/A"
      : "Good";
  };

  const getLastUpdated = (key: string) => {

    const latest = getLatest(key);

    if (!latest?.ts) return "--:--:--";

    return new Date(latest.ts)
      .toLocaleTimeString("en-IN", {
        hour12: false,
      });
  };

  return (

    <CommonCard
      bg={bg}
      border={`1px solid ${border}`}
      borderRadius="10px"
      p="14px"
      overflow="hidden"
    >

      {/* TITLE */}
      <Text
        color={title}
        fontSize="18px"
        fontWeight="700"
        mb="12px"
      >
        Sensor Status
      </Text>

      {/* TABLE */}
      <Table
        variant="unstyled"
        size="sm"
        sx={{ tableLayout: "fixed", "th, td": { px: "6px" }, "th:first-of-type": { width: "43%" } }}
      >

        <Thead>

          <Tr>

            <Th
              color={header}
              fontSize="12px"
              fontWeight="500"
              pb="10px"
              borderBottom={`1px solid ${divider}`}
              textTransform="none"
              maxW="320px"
            >
              Sensor
            </Th>

            <Th
              color={header}
              fontSize="12px"
              fontWeight="500"
              textAlign="center"
              pb="10px"
              borderBottom={`1px solid ${divider}`}
              textTransform="none"
            >
              Status
            </Th>

            <Th
              color={header}
              fontSize="12px"
              fontWeight="500"
              textAlign="center"
              pb="10px"
              borderBottom={`1px solid ${divider}`}
              textTransform="none"
            >
              Last Updated
            </Th>

            <Th
              color={header}
              fontSize="12px"
              fontWeight="500"
              textAlign="right"
              pb="10px"
              borderBottom={`1px solid ${divider}`}
              textTransform="none"
            >
              Health
            </Th>

          </Tr>

        </Thead>

        <Tbody>

          {rows.map((item, index) => {

            const status =
              getStatus(item.key);

            return (

              <Tr key={index}>

                {/* SENSOR */}
                <Td
                  color={text}
                  fontSize="14px"
                  py="10px"
                  borderBottom={`1px solid ${divider}`}
                  whiteSpace="normal"
                  overflowWrap="anywhere"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  maxW="320px"
                >
                  {item.sensor}
                </Td>

                {/* STATUS */}
                <Td
                  py="10px"
                  borderBottom={`1px solid ${divider}`}
                >

                  <Flex justify="center">

                    <Circle
                      size="13px"
                      bg={
                        status === "na"
                          ? "#9ca3af"
                          : "#63d10d"
                      }
                    >

                      <Circle
                        size="4px"
                        bg={
                          status === "na"
                            ? "#e5e7eb"
                            : "#0f3b00"
                        }
                      />

                    </Circle>

                  </Flex>

                </Td>

                {/* LAST UPDATED */}
                <Td
                  color={text}
                  fontSize="14px"
                  textAlign="center"
                  py="10px"
                  borderBottom={`1px solid ${divider}`}
                >
                  {getLastUpdated(item.key)}
                </Td>

                {/* HEALTH */}
                <Td
                  fontSize="14px"
                  textAlign="right"
                  py="10px"
                  borderBottom={`1px solid ${divider}`}
                  color={
                    status === "na"
                      ? "#dce8ff"
                      : "#63d10d"
                  }
                >
                  {getHealth(item.key)}
                </Td>

              </Tr>

            );
          })}

        </Tbody>

      </Table>

    </CommonCard>
  );
};

export default SensorStatus;
