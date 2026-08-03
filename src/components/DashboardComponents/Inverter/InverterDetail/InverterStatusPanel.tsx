// InverterStatusPanel.tsx

import {
  useColorMode,
} from "@chakra-ui/react";

import {
  FaCheckCircle,
} from "react-icons/fa";

import {
  useEffect,
  useMemo,
} from "react";

import useTimeseriesData from "../../../../hooks/useTimeseriesData";

import {
  useAlarmLatest,
} from "../../../../hooks/useAlarmLatest";

const InverterStatusPanel = ({
  deviceId,
}: any) => {

  const { colorMode } =
    useColorMode();

  const isDark =
    colorMode === "dark";

  const {
    data,
    fetchData,
  } = useTimeseriesData();

  const {
    rows,
  } = useAlarmLatest();

  /* ================= API ================= */

  useEffect(() => {

    if (!deviceId) return;

    const fetchStatusData =
      () => {

        fetchData({

          devices: {
            patterns: [],
            ids: [deviceId],
          },

          keys: [

            {
              key: "active_power",
              alias: "active_power",
              keyType: "common",
            },

          ],

          aggregation: {
            func: "none",
            interval: 1,
            intervalType: "minute",
          },

          timeRange: {
            type: "relative",
            relativeType:
              "currentDaySoFar",
          },

          orderBy: "ASC",

        } as any);

      };

    fetchStatusData();

    const interval =
      setInterval(() => {

        fetchStatusData();

      }, 60000);

    return () =>
      clearInterval(interval);

  }, [deviceId]);

  /* ================= DEVICE DATA ================= */

  const deviceData =
    (data as any)?.[deviceId];

  /* ================= MAPPED DATA ================= */

  const mappedData =
    useMemo(() => {

      if (
        !deviceData
      ) {

        return {
          activePower: 0,
          lastTs: 0,
        };

      }

      const activePowerArr =
        deviceData[
          "active_power"
        ];

      const latestPoint =
        activePowerArr &&
        activePowerArr.length > 0
          ? activePowerArr[
              activePowerArr.length - 1
            ]
          : null;

      const activePower =
        latestPoint
          ? Number(
              latestPoint.value
            )
          : 0;

      const lastTs =
        latestPoint
          ? latestPoint.ts
          : 0;

      return {
        activePower,
        lastTs,
      };

    }, [deviceData]);

  /* ================= STATUS LOGIC ================= */

  const now = Date.now();

  let inverterStatus =
    "STOP";

  let statusColor =
    "#EF4444";

  if (
    !mappedData.lastTs ||
    now - mappedData.lastTs >
      4 * 60 * 1000
  ) {

    inverterStatus =
      "NON-COMM";

    statusColor =
      "#F59E0B";

  } else if (
    mappedData.activePower > 0
  ) {

    inverterStatus =
      "ONLINE";

    statusColor =
      "#22C55E";

  }

  /* ================= ALARM COUNT ================= */

  const normalizedDeviceId =
    String(deviceId)
      .trim()
      .toLowerCase();

  const alarmCount =
    rows.filter(
      (row: any) => {

        const rowDeviceId =
          String(
            row.deviceId ||
            row.device_id ||
            row.device ||
            ""
          )
            .trim()
            .toLowerCase();

        return (
          rowDeviceId ===
            normalizedDeviceId &&
          row.status ===
            "Latest Alarm"
        );

      }
    ).length;

  /* ================= ROWS ================= */

  const rowsData = [

    {
      label: "Status",
      value: inverterStatus,
      color: statusColor,
    },

    {
      label: "Alarm",
      value: String(alarmCount),
      color:
        alarmCount > 0
          ? "#ef4444"
          : "#22c55e",
    },

    {
      label: "AC Breaker",
      value: "----",
      color: "#94A3B8",
    },

    {
      label: "DC Breaker 1",
      value: "----",
      color: "#94A3B8",
    },

    {
      label: "DC Breaker 2",
      value: "----",
      color: "#94A3B8",
    },

    {
      label: "DC Breaker 3",
      value: "----",
      color: "#94A3B8",
    },

    {
      label: "GFDI Relay",
      value: "----",
      color: "#94A3B8",
    },

  ];

  return (

    <div
      style={{
        background: isDark
          ? "linear-gradient(135deg,#0a2744 0%, #081f37 45%, #06172d 100%)"
          : "linear-gradient(135deg,#ffffff 0%, #f7fafc 50%, #edf4fb 100%)",

        border: isDark
          ? "1px solid #16395c"
          : "1px solid #dbe7f3",

        borderRadius: "10px",

        padding: "14px",

        height: "100%",

        boxShadow: isDark
          ? "inset 0 0 35px rgba(0,0,0,0.18)"
          : "0 2px 10px rgba(15,23,42,0.05)",
      }}
    >

      {/* TITLE */}

      <h3
        style={{
          margin: 0,

          marginBottom: "14px",

          color: isDark
            ? "#ffffff"
            : "#0f172a",

          fontSize: "15px",

          fontWeight: 700,
        }}
      >
        Inverter Status
      </h3>

      {/* TABLE */}

      <div
        style={{
          borderTop: isDark
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid rgba(15,23,42,0.06)",

          paddingTop: "10px",
        }}
      >

        {rowsData.map((row, index) => (

          <div
            key={index}
            style={{
              display: "grid",

              gridTemplateColumns:
                "1fr 24px 1fr",

              alignItems: "center",

              minHeight: "34px",

              borderBottom:
                index !== rowsData.length - 1
                  ? isDark
                    ? "1px solid rgba(255,255,255,0.05)"
                    : "1px solid rgba(15,23,42,0.05)"
                  : "none",
            }}
          >

            {/* LABEL */}

            <div
              style={{
                color: isDark
                  ? "#dbeafe"
                  : "#334155",

                fontSize: "13px",

                fontWeight: 500,
              }}
            >
              {row.label}
            </div>

            {/* ICON */}

            <div
              style={{
                display: "flex",

                justifyContent:
                  "center",

                borderLeft: isDark
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "1px solid rgba(15,23,42,0.06)",

                borderRight: isDark
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "1px solid rgba(15,23,42,0.06)",

                height: "100%",

                alignItems: "center",
              }}
            >

              <FaCheckCircle
                size={12}
                color={row.color}
              />

            </div>

            {/* VALUE */}

            <div
              style={{
                color: row.color,

                fontSize: "13px",

                fontWeight: 700,

                textAlign: "center",

                letterSpacing:
                  "0.3px",
              }}
            >
              {row.value}
            </div>

          </div>

        ))}

      </div>

    </div>

  );
};

export default InverterStatusPanel;