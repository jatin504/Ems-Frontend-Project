import {
  Box,
  Flex,
  Grid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { useEffect } from "react";

import CommonCard from "./CommonCard.tsx";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

interface WMSStationStatusProps {
  selectedDevice: string;
}

const WMSStationStatus = ({
  selectedDevice,
}: WMSStationStatusProps) => {

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

  const label = useColorModeValue(
    "#718096",
    "#dce8ff"
  );

  const divider = useColorModeValue(
    "#d9e2ef",
    "rgba(255,255,255,0.08)"
  );

  const timeColor = useColorModeValue(
    "#1a202c",
    "#ffffff"
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
          alias: "Temperature",
          keyType: "timeseries",
        },

        {
          key: "signal_strength",
          alias: "Signal Strength",
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

    const interval = setInterval(
      run,
      60000
    );

    return () => clearInterval(interval);

  }, [selectedDevice]);

  const getLatest = (key: string) => {

    const arr =
      data?.[selectedDevice]?.[key] || [];

    return arr[arr.length - 1];
  };

  const getLastTime = () => {

    const latest =
      getLatest("Temperature");

    if (!latest?.ts) return "--:--:--";

    return new Date(latest.ts)
      .toLocaleTimeString("en-IN", {
        hour12: false,
      });
  };

  const getStationStatus = () => {

    const latest =
      getLatest("Temperature");

    if (
      !latest ||
      latest.value === undefined ||
      latest.value === null
    ) {
      return "OFFLINE";
    }

    return "ONLINE";
  };

  const getLoggingStatus = () => {

    const latest =
      getLatest("Temperature");

    if (
      !latest ||
      latest.value === undefined ||
      latest.value === null
    ) {
      return "STOP";
    }

    return "NORMAL";
  };

  const getSignalValue = () => {

    return Number(
      getLatest("Signal Strength")?.value || 0
    );
  };

  const getSignalText = () => {

    const value = getSignalValue();

    if (value >= 80) return "Excellent";

    if (value >= 60) return "Good";

    if (value >= 40) return "Average";

    return "Weak";
  };

  const getSignalBars = () => {

    const value = getSignalValue();

    if (value >= 80) return 5;

    if (value >= 60) return 4;

    if (value >= 40) return 3;

    if (value >= 20) return 2;

    return 1;
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
        fontWeight="700"
        fontSize="18px"
        mb="16px"
      >
        WMS Station Status
      </Text>

      {/* CONTENT */}
      <Grid
        templateColumns="repeat(4,1fr)"
        gap="0"
      >

        {/* WMS STATION */}
        <Flex
          direction="column"
          align="center"
          position="relative"
        >

          <Text
            color={label}
            fontSize="14px"
            mb="16px"
          >
            WMS Station
          </Text>

          <Box
            bg={
              getStationStatus() === "ONLINE"
                ? "rgba(96, 211, 20, 0.12)"
                : "rgba(255, 91, 87, 0.12)"
            }
            borderRadius="6px"
            px="10px"
            py="4px"
          >

            <Text
              color={
                getStationStatus() === "ONLINE"
                  ? "#65d10d"
                  : "#ff5b57"
              }
              fontSize="14px"
              fontWeight="500"
            >
              {getStationStatus()}
            </Text>

          </Box>

          {/* DIVIDER */}
          <Box
            position="absolute"
            right="0"
            top="0"
            bottom="0"
            w="1px"
            bg={divider}
          />

        </Flex>

        {/* DATA LOGGING */}
        <Flex
          direction="column"
          align="center"
          position="relative"
        >

          <Text
            color={label}
            fontSize="14px"
            mb="16px"
          >
            Data Logging
          </Text>

          <Box
            bg={
              getLoggingStatus() === "NORMAL"
                ? "rgba(96, 211, 20, 0.12)"
                : "rgba(255, 91, 87, 0.12)"
            }
            borderRadius="6px"
            px="10px"
            py="4px"
          >

            <Text
              color={
                getLoggingStatus() === "NORMAL"
                  ? "#65d10d"
                  : "#ff5b57"
              }
              fontSize="14px"
              fontWeight="500"
            >
              {getLoggingStatus()}
            </Text>

          </Box>

          {/* DIVIDER */}
          <Box
            position="absolute"
            right="0"
            top="0"
            bottom="0"
            w="1px"
            bg={divider}
          />

        </Flex>

        {/* LAST DATA */}
        <Flex
          direction="column"
          align="center"
          position="relative"
        >

          <Text
            color={label}
            fontSize="14px"
            textAlign="center"
            lineHeight="1.2"
            mb="10px"
          >
            Last Data
            <br />
            Received
          </Text>

          <Text
            color={timeColor}
            fontSize="22px"
            fontWeight="400"
            lineHeight="1"
          >
            {getLastTime()}
          </Text>

          {/* DIVIDER */}
          <Box
            position="absolute"
            right="0"
            top="0"
            bottom="0"
            w="1px"
            bg={divider}
          />

        </Flex>

        {/* SIGNAL */}
        <Flex
          direction="column"
          align="center"
        >

          <Text
            color={label}
            fontSize="14px"
            mb="12px"
          >
            Signal Strength
          </Text>

          {/* SIGNAL BARS */}
          <Flex
            align="flex-end"
            gap="3px"
            h="32px"
            mb="6px"
          >

            {[8, 12, 18, 24, 30].map((h, index) => (

              <Box
                key={index}
                w="6px"
                h={`${h}px`}
                bg={
                  index < getSignalBars()
                    ? "#65d10d"
                    : "rgba(255,255,255,0.15)"
                }
                borderRadius="1px"
              />

            ))}

          </Flex>

          <Text
            color="#65d10d"
            fontSize="18px"
            fontWeight="500"
            lineHeight="1"
          >
            {getSignalText()}
          </Text>

        </Flex>

      </Grid>

    </CommonCard>
  );
};

export default WMSStationStatus;