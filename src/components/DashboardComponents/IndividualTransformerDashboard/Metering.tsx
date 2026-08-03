import {
  Box,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  useEffect,
} from "react";

import useTimeseriesData from "../../../hooks/useTimeseriesData";

/* =========================
   VALUE BOX
   ========================= */

const ValueBox = ({
  value,
}: {
  value: string;
}) => {

  const valueBoxBg =
    useColorModeValue(
      "#CFCFCF",
      "#4A4A4A"
    );

  const valueBoxShadow =
    useColorModeValue(
      "#B0B0B0",
      "#666666"
    );

  return (
    <Box
      bg={valueBoxBg}
      w="72px"
      h="20px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontSize="11px"
      borderRadius="4px"
      boxShadow={`inset 0 0 0 1px ${valueBoxShadow}`}
    >
      {value}
    </Box>
  );
};

export default function Metering() {

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
  // API
  // =========================

  const { data, fetchData } =
    useTimeseriesData();

  const deviceId =
    "plant_1_ht_outgoing_meter_1";

  const buildDataSource = () => ({
    devices: {
      ids: [deviceId],
      patterns: [],
    },

    keys: [

      // VOLTAGE
      {
        key: "voltage_ll_ry",
        alias: "voltage_ll_ry",
        keyType: "common",
      },

      {
        key: "voltage_ll_yb",
        alias: "voltage_ll_yb",
        keyType: "common",
      },

      {
        key: "voltage_ll_br",
        alias: "voltage_ll_br",
        keyType: "common",
      },

      // CURRENT
      {
        key: "current_r",
        alias: "current_r",
        keyType: "common",
      },

      {
        key: "current_y",
        alias: "current_y",
        keyType: "common",
      },

      {
        key: "current_b",
        alias: "current_b",
        keyType: "common",
      },

      // ACTIVE POWER
      {
        key: "active_power_r",
        alias: "active_power_r",
        keyType: "common",
      },

      {
        key: "active_power_y",
        alias: "active_power_y",
        keyType: "common",
      },

      {
        key: "active_power_b",
        alias: "active_power_b",
        keyType: "common",
      },

      // REACTIVE POWER
      {
        key: "reactive_power_r",
        alias: "reactive_power_r",
        keyType: "common",
      },

      {
        key: "reactive_power_y",
        alias: "reactive_power_y",
        keyType: "common",
      },

      {
        key: "reactive_power_b",
        alias: "reactive_power_b",
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
  // DATA
  // =========================

  const d =
    data?.[deviceId] || {};

  const getValue = (
    key: string,
    digits = 1
  ) => {

    const value =
      d?.[key]?.[0]?.value;

    if (
      value === undefined ||
      value === null
    ) {
      return "----";
    }

    return Number(value)
      .toFixed(digits);
  };

  // =========================
  // UI
  // =========================

  return (
    <Box
      bg={primaryBg}
      rounded="12px"
      p="16px"
      width="480px"
      height="180px"
    >
      {/* TITLE */}

      <Text
        fontSize="11px"
        fontWeight="bold"
        mb="6px"
        color={primaryColor}
      >
        METERING
      </Text>

      {/* COLUMN HEADER */}

      <Box
        display="grid"
        gridTemplateColumns="130px 72px 72px 72px"
        columnGap="14px"
        alignItems="center"
        mb="6px"
      >
        <Box />

        <Text
          fontSize="11px"
          textAlign="center"
        >
          R-PHASE
        </Text>

        <Text
          fontSize="11px"
          textAlign="center"
        >
          Y-PHASE
        </Text>

        <Text
          fontSize="11px"
          textAlign="center"
        >
          B-PHASE
        </Text>
      </Box>

      {/* V L-L */}

      <Box
        display="grid"
        gridTemplateColumns="130px 72px 72px 72px"
        columnGap="14px"
        alignItems="center"
        mb="4px"
      >
        <Text fontSize="11px">
          V L-L (V)
        </Text>

        <ValueBox
          value={getValue(
            "voltage_ll_ry"
          )}
        />

        <ValueBox
          value={getValue(
            "voltage_ll_yb"
          )}
        />

        <ValueBox
          value={getValue(
            "voltage_ll_br"
          )}
        />
      </Box>

      {/* I L */}

      <Box
        display="grid"
        gridTemplateColumns="130px 72px 72px 72px"
        columnGap="14px"
        alignItems="center"
        mb="8px"
      >
        <Text fontSize="11px">
          I L (A)
        </Text>

        <ValueBox
          value={getValue(
            "current_r"
          )}
        />

        <ValueBox
          value={getValue(
            "current_y"
          )}
        />

        <ValueBox
          value={getValue(
            "current_b"
          )}
        />
      </Box>

      {/* BOTTOM */}

      <Box
        display="grid"
        gridTemplateColumns="130px 72px 72px 72px"
        columnGap="14px"
        rowGap="6px"
        alignItems="center"
      >
        {/* ACTIVE POWER */}

        <Text fontSize="11px">
          P (KW)
        </Text>

        <ValueBox
          value={getValue(
            "active_power_r"
          )}
        />

        <ValueBox
          value={getValue(
            "active_power_y"
          )}
        />

        <ValueBox
          value={getValue(
            "active_power_b"
          )}
        />

        {/* REACTIVE POWER */}

        <Text fontSize="11px">
          Q (KVAR)
        </Text>

        <ValueBox
          value={getValue(
            "reactive_power_r"
          )}
        />

        <ValueBox
          value={getValue(
            "reactive_power_y"
          )}
        />

        <ValueBox
          value={getValue(
            "reactive_power_b"
          )}
        />
      </Box>
    </Box>
  );
}