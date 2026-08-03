import {
  Section,
  Led,
} from "./SharedComponents";

import useTimeseriesData from "../../../hooks/useTimeseriesData";

import {
  useEffect,
  useMemo,
} from "react";

export default function TransformerSection() {

  // =========================
  // DEVICE ID
  // =========================

  const deviceId =
    "plant_1_transformer_annunciator_outgoing_1";

  // =========================
  // FETCH API
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
        key: "oil_temp_alarm",
        alias: "oil_temp_alarm",
        keyType: "common",
      },

      {
        key: "oil_temp_trip",
        alias: "oil_temp_trip",
        keyType: "common",
      },

      {
        key: "winding_temp_trip",
        alias: "winding_temp_trip",
        keyType: "common",
      },

      {
        key: "winding_temp_alarm",
        alias: "winding_temp_alarm",
        keyType: "common",
      },

      {
        key: "pvr_trip",
        alias: "pvr_trip",
        keyType: "common",
      },

      {
        key: "buchholz_trip",
        alias: "buchholz_trip",
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
  // STATUS LOGIC
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

      oil_temp_alarm:
        getStatus(
          "oil_temp_alarm"
        ),

      oil_temp_trip:
        getStatus(
          "oil_temp_trip"
        ),

      winding_temp_trip:
        getStatus(
          "winding_temp_trip"
        ),

      winding_temp_alarm:
        getStatus(
          "winding_temp_alarm"
        ),

      pvr_trip:
        getStatus(
          "pvr_trip"
        ),

      buchholz_trip:
        getStatus(
          "buchholz_trip"
        ),

    };

  }, [data]);

  // =========================
  // UI
  // =========================

  return (
    <Section title="TRANSFORMER">

      {/* NOT MAPPED */}

      <Led
        label="BUCHHOLZ ALARM"
        color="gray"
      />

      {/* MAPPED */}

      <Led
        label="OIL TEMP ALARM (OLTC)"
        color={
          statusMap
            .oil_temp_alarm as any
        }
      />

      <Led
        label="OIL TEMP TRIP"
        color={
          statusMap
            .oil_temp_trip as any
        }
      />

      <Led
        label="WTI - TRIP"
        color={
          statusMap
            .winding_temp_trip as any
        }
      />

      <Led
        label="WTI - ALARM"
        color={
          statusMap
            .winding_temp_alarm as any
        }
      />

      {/* NOT MAPPED */}

      <Led
        label="MAIN SUPPLY FAIL"
        color="gray"
      />

      <Led
        label="STANDBY SUPPLY FAIL"
        color="gray"
      />

      {/* MAPPED */}

      <Led
        label="PVR - TRIP"
        color={
          statusMap
            .pvr_trip as any
        }
      />

      <Led
        label="BUCHHOLZ TRIP"
        color={
          statusMap
            .buchholz_trip as any
        }
      />

    </Section>
  );
}