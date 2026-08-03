import {
  useColorModeValue,
} from "@chakra-ui/react";

import {
  Section,
  Led,
} from "./SharedComponents";

import useTimeseriesData from "../../../hooks/useTimeseriesData";

import {
  useEffect,
  useMemo,
} from "react";

export default function CircuitBreaker() {

  // DEVICE ID

  const deviceId =
    "plant_1_transformer_annunciator_outgoing_1";

  // FETCH DATA

  const { data, fetchData } =
    useTimeseriesData();

  const buildDataSource = () => ({
    devices: {
      ids: [deviceId],
      patterns: [],
    },

    keys: [
      {
        key: "master_trip_relay",
        alias: "MASTER_TRIP_RELAY",
        keyType: "common",
      },

      {
        key: "emergency_stop",
        alias: "EMERGENCY_STOP",
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
      relativeType: "currentDaySoFar",
      interval: 1,
      intervalType: "minute",
    },

    orderBy: "DESC",
  });

  useEffect(() => {

    fetchData(buildDataSource() as any);

    const interval = setInterval(() => {

      fetchData(buildDataSource() as any);

    }, 60000);

    return () => clearInterval(interval);

  }, []);

  // STATUS LOGIC

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

      MASTER_TRIP_RELAY:
        getStatus(
          "MASTER_TRIP_RELAY"
        ),

      EMERGENCY_STOP:
        getStatus(
          "EMERGENCY_STOP"
        ),

    };

  }, [data]);

  // RENDER

  return (
    <Section title="CIRCUIT BREAKER">

      {/* NOT MAPPED */}

      <Led
        label="CB DC FAIL"
        color="gray"
      />

      {/* MAPPED */}

      <Led
        label="MASTER TRIP"
        color={
          statusMap.MASTER_TRIP_RELAY
        }
      />

      <Led
        label="EMERGENCY STOP"
        color={
          statusMap.EMERGENCY_STOP
        }
      />

      {/* NOT MAPPED */}

      <Led
        label="CB AC FAIL"
        color="gray"
      />

      <Led
        label="SPARE"
        color="gray"
      />

      <Led
        label="CB SF6 LOCKOUT"
        color="gray"
      />

      <Led
        label="CB SF6 ALARM"
        color="gray"
      />

      <Led
        label="CB SPRING DISCHARGED"
        color="gray"
      />

      <Led
        label="CB TC-1 FAULTY"
        color="gray"
      />

      <Led
        label="CB TC-2 FAULTY"
        color="gray"
      />

    </Section>
  );
}