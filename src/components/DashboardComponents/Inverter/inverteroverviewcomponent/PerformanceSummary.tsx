import React, {
  useEffect,
  useMemo,
} from "react";

import {
  useColorMode,
} from "@chakra-ui/react";

import useInverterPerformanceSummary from "../../../../hooks/useInverterPerformanceSummary";
import StaleIndicator from "../../../../components/Common/StaleIndicator";
import WidgetTitle from "../../../Common/WidgetTitle";

interface WidgetPoint {
  ts: number;
  value: number | null;
}

interface WidgetData {
  [deviceID: string]: {
    [keyAlias: string]: WidgetPoint[];
  };
}

const PerformanceSummary = () => {

  const { colorMode } =
    useColorMode();

  const isDark =
    colorMode === "dark";

  const cardBg = isDark
    ? "radial-gradient(circle at top right, #123b63 0%, #081c33 45%, #051525 100%)"
    : "#ffffff";

  const border = isDark
    ? "1px solid #123457"
    : "1px solid #d5e6f7";

  const titleColor = isDark
    ? "#d7e8ff"
    : "#1e293b";

  const labelColor = isDark
    ? "#b8c7d9"
    : "#64748b";

  const green = "#7CFC00";

  const blue = "#4DA6FF";

  const purple = "#B388FF";
  const valueColor = isDark ? "#8fa4b8" : "#4b596c";

  const {
  data,
  loading,
  error,
  fetchData,
} = useInverterPerformanceSummary();
  /* ================= API ================= */

  

          useEffect(() => {

  fetchData();

  const interval = setInterval(() => {
    fetchData();
  }, 60000);

  return () => clearInterval(interval);

}, []);

  /* ================= MAP ================= */

  const summaryData = useMemo(() => {

  if (!data) {
    return [
      {
        label: "Total Inverters",
        value: "--",
        unit: "",
        color: blue,
      },
      {
        label: "Total DC Power",
        value: "--",
        unit: "kW",
        color: green,
      },
      {
        label: "Total AC Power",
        value: "--",
        unit: "kW",
        color: blue,
      },
      {
        label: "Total Energy Today",
        value: "--",
        unit: "MWh",
        color: green,
      },
      {
        label: "Average PR",
        value: "--",
        unit: "%",
        color: purple,
      },
      {
        label: "Average Availability",
        value: "--",
        unit: "%",
        color: green,
      },
    ];
  }

  return [
    {
      label: "Total Inverters",
      value: String(data.totalInverters),
      unit: "",
      color: blue,
    },
    {
      label: "Total DC Power",
      value: Number(data.totalDCPower).toFixed(2),
      unit: "kW",
      color: green,
      ts: data.lastUpdateTime,
    },
    {
      label: "Total AC Power",
      value: Number(data.totalACPower).toFixed(2),
      unit: "kW",
      color: blue,
      ts: data.lastUpdateTime,
    },
    {
      label: "Total Energy Today",
      value: Number(data.totalEnergyToday / 1000).toFixed(2),
      unit: "MWh",
      color: green,
      ts: data.lastUpdateTime,
    },
    {
      label: "Average PR",
      value: Number(data.averagePR).toFixed(1),
      unit: "%",
      color: purple,
      ts: data.lastUpdateTime,
    },
    {
      label: "Average Availability",
      value: Number(data.averageAvailability).toFixed(1),
      unit: "%",
      color: green,
      ts: data.lastUpdateTime,
    },
  ];

}, [data]);

  return (
    <div
      style={{
        background:
          cardBg,

        border,

        fontFamily: "Poppins, sans-serif",

        borderRadius:
          "10px",

        padding: "12px",

        height: "280px",

        boxShadow: isDark
          ? "inset 0 0 40px rgba(0,0,0,0.25)"
          : "0 4px 18px rgba(15,23,42,0.08)",

        transition:
          "0.3s ease",
      }}
    >

      {/* TITLE */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "40px",
          marginBottom: "12px",
        }}
      >
        <WidgetTitle color={titleColor}>
          INVERTER PERFORMANCE SUMMARY
        </WidgetTitle>
      </div>

      {/* GRID */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(3, minmax(0,1fr))",

          gap: "22px 18px",
        }}
      >

        {summaryData.map(
          (
            item,
            index
          ) => (

            <div key={index}>

              {/* LABEL */}

              <p
                style={{
                  margin: 0,

                  marginBottom:
                    "8px",

                  fontSize:
                    "13px",

                  fontWeight: 500,

                  color:
                    labelColor,

                  whiteSpace:
                    "nowrap",
                }}
              >
                {item.label}
              </p>

              {/* VALUE */}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "4px",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "20px",
                      lineHeight: 1,
                      fontWeight: 700,
                      color: valueColor,
                      letterSpacing: "-1px",
                    }}
                  >
                    {item.value}
                  </h2>

                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: isDark ? "#d7e8ff" : "#475569",
                    }}
                  >
                    {item.unit}
                  </span>
                </div>

                <StaleIndicator
  ts={item.ts}
  value={item.value}
/>

              </div>

            </div>

          )
        )}

      </div>

    </div>
  );
};

export default PerformanceSummary;