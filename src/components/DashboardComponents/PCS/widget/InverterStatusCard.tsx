import { useColorMode } from "@chakra-ui/react";
import useTimeseriesData from "../../../../hooks/useTimeseriesData";
import { useEffect, useState } from "react";

import { useAlarmLatest } from "../../../../hooks/useAlarmLatest";

const InverterStatusCard = () => {

  const { colorMode } =
    useColorMode();

  const isDark =
    colorMode === "dark";

  const { data: tsData, fetchData: fetchTs } =
    useTimeseriesData();

  /* ================= ALARM HOOK ================= */

  const { pageRows } =
    useAlarmLatest();

  const [counts, setCounts] =
    useState({
      online: 0,
      offline: 0,
      total: 0,
      alarm: 0,
    });

  // =========================
  // API SOURCE
  // =========================

  const buildStatusSource =
    () => ({
      devices: {
        patterns: [
          "_inverter_inverter_",
        ],
        ids: [],
      },

      keys: [
        {
          key: "active_power",
          alias: "active_power",
          keyType: "common",
          type: "spline",
        },
      ],

      aggregation: {
        func: "last",
        interval: 1,
        intervalType:
          "minute",
      },

      timeRange: {
        type: "relative",
        relativeType:
          "currentDaySoFar",
        interval: 1,
        intervalType:
          "minute",
      },

      orderBy: "DESC",
    });

  // =========================
  // FETCH
  // =========================

  useEffect(() => {

    fetchTs(
      buildStatusSource() as any
    );

    const id = setInterval(
      () => {

        fetchTs(
          buildStatusSource() as any
        );

      },
      60000
    );

    return () =>
      clearInterval(id);

  }, []);

  // =========================
  // STATUS LOGIC
  // =========================

  useEffect(() => {

    if (!tsData) return;

    let online = 0;

    let offline = 0;

    const deviceIds = Object.keys(tsData || {});

    const alarmDevices = new Set(pageRows.map((row) => row.device));

    deviceIds.forEach((dev) => {
      const points = tsData?.[dev]?.["active_power"];
      const latest = points && points.length > 0 ? points[0] : null;
      const value = latest ? Number(latest.value ?? 0) : 0;

      if (value > 0) online++;
      else offline++;
    });

    setCounts({
      online,
      offline,

      total: online + offline + alarmDevices.size,

      alarm: alarmDevices.size,
    });

  }, [tsData, pageRows]);

  // =========================
  // PERCENTAGE
  // =========================

  const total =
    counts.total > 0
      ? counts.total
      : 1;

  const onlinePercent = (
    (counts.online / total) *
    100
  ).toFixed(1);

  const offlinePercent = (
    (counts.offline /
      total) *
    100
  ).toFixed(1);

  // =========================
  // PIE DATA
  // =========================

  const chartData = [
    counts.online > 0 ? counts.online : 0.0001,
    counts.offline > 0 ? counts.offline : 0.0001,
  ];

  return (
    <div
      style={{
        background: isDark
          ? "radial-gradient(circle at top right, #123b63 0%, #081c33 45%, #051525 100%)"
          : "#ffffff",

        border: isDark
          ? "1px solid #123457"
          : "1px solid #d5e6f7",

        borderRadius: "10px",

        padding: "16px",

        height: "100%",

        color: isDark
          ? "#ffffff"
          : "#0f172a",

        boxShadow: isDark
          ? "inset 0 0 40px rgba(0,0,0,0.25)"
          : "0 4px 18px rgba(15, 23, 42, 0.08)",

        transition:
          "0.3s ease",
      }}
    >

      {/* TITLE */}

      <h3
        style={{
          margin: 0,
          marginBottom: "18px",
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing:
            "0.5px",

          color: isDark
            ? "#d7e8ff"
            : "#1e293b",
        }}
      >
        INVERTER STATUS
      </h3>

      {/* CONTENT */}

      <div
        style={{
          display: "flex",

          alignItems: "center",

          justifyContent:
            "space-between",

          gap: "18px",
        }}
      >

        {/* PIE */}

        {/* PIE */}

        <div
          style={{
            width: "190px",
            height: "190px",
            borderRadius: "50%",

            background: `conic-gradient(
      #7ac943 0% ${onlinePercent}%,
      #9ca3af ${onlinePercent}% 100%
    )`,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            flexShrink: 0,
          }}
        >

          {/* INNER CIRCLE */}

          <div
            style={{
              width: "125px",
              height: "125px",

              background: isDark
                ? "#0F2235"
                : "#ffffff",

              borderRadius: "50%",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >

            <h1
              style={{
                margin: 0,
                fontSize: "42px",
                fontWeight: 700,
                lineHeight: 1,

                color: isDark ? "#ffffff" : "#0f172a",
              }}
            >
              {counts.total}
            </h1>

            <p
              style={{
                margin: 0,
                marginTop: "8px",
                fontSize: "17px",

                color: isDark ? "#cbd5e1" : "#475569",
              }}
            >
              Total
            </p>

          </div>

        </div>

        {/* LEGENDS */}

        <div
          style={{
            display: "flex",

            flexDirection:
              "column",

            gap: "18px",

            flex: 1,
          }}
        >

          {/* ONLINE */}

          <div
            style={{
              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",
            }}
          >

            <div
              style={{
                display: "flex",

                alignItems:
                  "center",

                gap: "10px",

                fontSize:
                  "17px",

                color: isDark
                  ? "#dce7f5"
                  : "#1e293b",
              }}
            >

              <span
                style={{
                  width: "14px",

                  height:
                    "14px",

                  background:
                    "#7ac943",

                  display:
                    "inline-block",

                  borderRadius:
                    "2px",
                }}
              />

              Online

            </div>

            <span
              style={{
                fontSize:
                  "17px",

                color: isDark
                  ? "#ffffff"
                  : "#0f172a",

                fontWeight: 500,
              }}
            >
              {counts.online} (
              {onlinePercent}%)
            </span>

          </div>

          {/* ALARM */}

          <div
            style={{
              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",
            }}
          >

            <div
              style={{
                display: "flex",

                alignItems:
                  "center",

                gap: "10px",

                fontSize:
                  "17px",

                color: isDark
                  ? "#dce7f5"
                  : "#1e293b",
              }}
            >

              <span
                style={{
                  width: "14px",

                  height:
                    "14px",

                  background:
                    "#ef4444",

                  display:
                    "inline-block",

                  borderRadius:
                    "2px",
                }}
              />

              Alarm

            </div>

            <span
              style={{
                fontSize:
                  "17px",

                color: isDark
                  ? "#ffffff"
                  : "#0f172a",

                fontWeight: 500,
              }}
            >
              {counts.alarm}
            </span>

          </div>

          {/* OFFLINE */}

          <div
            style={{
              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",
            }}
          >

            <div
              style={{
                display: "flex",

                alignItems:
                  "center",

                gap: "10px",

                fontSize:
                  "17px",

                color: isDark
                  ? "#dce7f5"
                  : "#1e293b",
              }}
            >

              <span
                style={{
                  width: "14px",

                  height:
                    "14px",

                  background:
                    "#9ca3af",

                  display:
                    "inline-block",

                  borderRadius:
                    "2px",
                }}
              />

              Offline

            </div>

            <span
              style={{
                fontSize:
                  "17px",

                color: isDark
                  ? "#ffffff"
                  : "#0f172a",

                fontWeight: 500,
              }}
            >
              {counts.offline} (
              {offlinePercent}%)
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default InverterStatusCard;