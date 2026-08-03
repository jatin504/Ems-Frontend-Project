import {
  Box,
  Text,
  VStack,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  useEffect,
  useMemo,
} from "react";

import useTimeseriesData from "../../../hooks/useTimeseriesData";

/* =========================
   ROUND LED
   ========================= */

const DotLed = ({
  label,
  color = "gray",
}: {
  label: string;
  color?: "green" | "red" | "gray";
}) => {

  const bg =
    color === "green"
      ? "#00C853"
      : color === "red"
      ? "#FF4D4F"
      : "#A0AEC0";

  return (
    <HStack spacing={3} align="center">
      <Box
        w="10px"
        h="10px"
        borderRadius="50%"
        bg={bg}
        boxShadow={`0 0 4px ${bg}`}
      />

      <Text
        fontSize="11px"
        lineHeight="1"
      >
        {label}
      </Text>
    </HStack>
  );
};

export default function Led99() {

  // =========================
  // DEVICE
  // =========================

  const deviceId =
    "plant_1_transformer_annunciator_outgoing_1";

  // =========================
  // API
  // =========================

  const { data, fetchData } =
    useTimeseriesData();

  const buildDataSource = () => ({
    devices: {
      ids: [deviceId],
      patterns: [],
    },

    keys: [

      {
        key: "earth_fault_relay",
        alias: "earth_fault_relay",
        keyType: "common",
      },

      {
        key: "over_current_relay",
        alias: "over_current_relay",
        keyType: "common",
      },

    ],

    aggregation: {
      func: "last",
      interval: 1,
      intervalType: "minute",
    },

    timeRange: {
      type: "relative",

      relativeType:
        "currentDaySoFar",

      interval: 1,

      intervalType: "minute",
    },

    orderBy: "DESC",
  });

  // =========================
  // FETCH
  // =========================

  useEffect(() => {

    fetchData(
      buildDataSource() as any
    );

    const interval =
      setInterval(() => {

        fetchData(
          buildDataSource() as any
        );

      }, 60000);

    return () =>
      clearInterval(interval);

  }, []);

  // =========================
  // STATUS MAP
  // =========================

  const statusMap = useMemo(() => {

    const d =
      data?.[deviceId] || {};

    const getStatus = (
      key: string
    ) => {

      const latest =
        d?.[key]?.[0];

      // NO VALUE
      if (
        latest === undefined ||
        latest === null
      ) {
        return "gray";
      }

      const value = Number(
        latest?.value
      );

      // 0 = GREEN
      if (value === 0) {
        return "green";
      }

      // 1 = RED
      if (value === 1) {
        return "red";
      }

      return "gray";
    };

    return {

      earth_fault_relay:
        getStatus(
          "earth_fault_relay"
        ),

      over_current_relay:
        getStatus(
          "over_current_relay"
        ),

    };

  }, [data]);

  // =========================
  // THEME
  // =========================

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

  // =========================
  // UI
  // =========================

  return (
    <Box
      bg={primaryBg}
      rounded="12px"
      p="16px"
      width="200px"
      height="180px"
    >
      <Text
        fontSize="11px"
        fontWeight="bold"
        mb={2}
        textTransform="uppercase"
        color={primaryColor}
      >
        99 LED
      </Text>

      <VStack
        align="start"
        spacing={1}
      >

        {/* NOT MAPPED */}

        <DotLed
          label="HV OVERFLUX"
          color="gray"
        />

        <DotLed
          label="LV REF OPTD"
          color="gray"
        />

        {/* MAPPED */}

        <DotLed
          label="E/F PROTN"
          color={
            statusMap
              .earth_fault_relay as any
          }
        />

        <DotLed
          label="OVER CURRENT"
          color={
            statusMap
              .over_current_relay as any
          }
        />

        {/* NOT MAPPED */}

        <DotLed
          label="SPARE"
          color="gray"
        />

        <DotLed
          label="SPARE"
          color="gray"
        />

        <DotLed
          label="SPARE"
          color="gray"
        />

      </VStack>
    </Box>
  );
}